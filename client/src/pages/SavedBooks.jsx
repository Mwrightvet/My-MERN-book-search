import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";

import { useMutation, useQuery } from "@apollo/client";
import { DELETE_BOOK } from "../graphql/mutations";
import { ME } from "../graphql/queries";
import { removeBookId } from "../utils/localStorage";

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  const [showModal, setShowModal] = useState(false);

  // use this to determine if `useEffect()` hook needs to run again;
  const [deleteBook] = useMutation(DELETE_BOOK);
  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (book) => {
    try {
      const { data } = await deleteBook({
        variables: { bookId: book._id },
      });
      // upon success, remove book's id from localStorage
      if (data && data.deleteBook) {
        removeBookId(book.bookId);
        //remove from state
        deleteBookFromState(book._id);
        //alert user
        setShowModal(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so

  const handleCloseModal = () => {
    setShowModal(!showModal);
    refetch();
    // window.location.reload();
  };
  const deleteBookFromState = (id) => {
    const index = userData.savedBooks.findIndex((book) => book._id === id);
    if (index !== -1) {
      const newSavedBooks = [...userData.savedBooks];
      newSavedBooks.splice(index, 1);
      setUserData((prevUserData) => ({
        ...prevUserData,
        savedBooks: newSavedBooks,
      }));
    }
  };

  const { loading, error, data, refetch } = useQuery(ME, {
    fetchPolicy: "network-only", // Used for first execution
    nextFetchPolicy: "network-only",
  });
  console.log("DATA", data);
  useEffect(() => {
    if (data && data.me) {
      setUserData(data.me);
    }
  }, [data]);

  useEffect(() => {
    // if (!loading && !error && !data) {
    refetch();
    // }
  }, []);

  if (loading) {
    return <h2>LOADING...</h2>;
  }
  return (
    <>
      <div fluid className="text-dark bg-light p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
        {/* <button onClick={() => refetch()}>Refetch!</button> */}
      </div>
      <Container>
        <h6 className="pt-5">
          {userData?.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h6>
        <Row>
          {userData?.savedBooks?.map((book, index) => {
            return (
              <Col md={3} sm={6} key={index} lg={4} className="py-3">
                <Card key={book.bookId} className="h-100">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                      className="object-fit-cover"
                      style={{ height: 300 }}
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>
                      {book.description.substring(0, 50)}...
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book)}
                    >
                      Delete
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
      <Modal
        size="md"
        show={showModal}
        onHide={handleCloseModal}
        aria-labelledby="deleted-book"
        centered
        className="custom-modal"
      >
        {/* tab container to do either signup or login component */}

        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title id="deleted-book">Success</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          Book has been successfully deleted from your list
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

export default SavedBooks;
