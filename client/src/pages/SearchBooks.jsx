import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";

import { useMutation } from "@apollo/client";
import BookCard from "../components/BookCard";
import { ADD_BOOK } from "../graphql/mutations";
import { searchGoogleBooks } from "../utils/API";
import { getSavedBookIds, saveBookIds } from "../utils/localStorage";

const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  const [showModal, setShowModal] = useState(false);

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {

    return () => saveBookIds(savedBookIds);;
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ["No author to display"],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || "",
      }));

      setSearchedBooks(bookData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  //save book
  const [saveBook] = useMutation(ADD_BOOK);

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // Find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    try {
      if (!bookToSave.description) {
        bookToSave.description = "No decsription for this book";
      }
      // Call the saveBook mutation with the book data
      const { data } = await saveBook({
        variables: { data: { ...bookToSave } },
      });

      // Check if the mutation was successful
      if (data && data.addBook) {
        // If successful, update your state or perform any other necessary actions
        setSavedBookIds([...savedBookIds, data.addBook.bookId]);
        // alert user here
        setShowModal(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(!showModal);
    // window.location.reload();
  };

  return (
    <>
      <div className="bg-ligh py-5 text-dark">
        <Container>
          <h1 className="text-center mb-4">Search for Books</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row className="d-flex justify-content-center">
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Enter book title, author, or keyword"
                  className="mb-3"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg" block>
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h6 className="pt-5">
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : "Search for a book to begin"}
        </h6>
        <Row>
          {searchedBooks.map((book, index) => {
            return (
              <BookCard
                book={book}
                handleSaveBook={() => handleSaveBook(book.bookId)}
                savedBookIds={savedBookIds}
                index={index}
              />
              // <Col md="3" sm="2" key={book.bookId} lg="4" className="py-3">
              //   <Card border="dark">
              //     {book.image ? (
              //       <Card.Img
              //         src={book.image}
              //         alt={`The cover for ${book.title}`}
              //         variant="top"
              //         className="object-fit-cover"
              //         style={{ height: 340 }}
              //       />
              //     ) : null}
              //     <Card.Body>
              //       <Card.Title>{book.title}</Card.Title>
              //       <p className="small">Authors: {book.authors}</p>
              //       <Card.Text>
              //         {book.description?.substring(0, 100)}...
              //       </Card.Text>
              //       {Auth.loggedIn() && (
              //         <Button
              //           disabled={savedBookIds?.some(
              //             (savedBookId) => savedBookId === book.bookId
              //           )}
              //           className="btn-block btn-info"
              //           onClick={() => handleSaveBook(book.bookId)}
              //         >
              //           {savedBookIds?.some(
              //             (savedBookId) => savedBookId === book.bookId
              //           )
              //             ? "This book has already been saved!"
              //             : "Save this Book!"}
              //         </Button>
              //       )}
              //     </Card.Body>
              //   </Card>
              // </Col>
            );
          })}
        </Row>
      </Container>
      <Modal
        size="md"
        show={showModal}
        onHide={handleCloseModal}
        aria-labelledby="add-book"
        centered
        className="custom-modal" // Add a custom class for styling
      >
        <Modal.Header closeButton className="custom-modal-header">
          {" "}
          {/* Add custom class for header styling */}
          <Modal.Title id="add-book">Success</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          {" "}
          {/* Add custom class for body styling */}
          Book has been successfully added to your list
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal} className="custom-modal-button">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SearchBooks;
