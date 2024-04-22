import { Col, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import auth from "../utils/auth";

const BookCard = ({ book, savedBookIds, handleSaveBook, index }) => {
  return (
    <Col md={3} sm={6} key={index} lg={4} className="py-3">
      <Card border="dark" className="h-100">
        {book.image && (
          <Card.Img
            src={book.image}
            alt={`The cover for ${book.title}`}
            variant="top"
            className="object-fit-cover"
            style={{ height: 300 }}
          />
        )}
        <Card.Body>
          <Card.Title>{book.title}</Card.Title>
          <p className="small">Authors: {book.authors}</p>
          <Card.Text>{book.description?.substring(0, 100)}...</Card.Text>
        </Card.Body>
        {auth.loggedIn() && (
          <Card.Footer>
            <Button
              disabled={savedBookIds?.some(
                (savedBookId) => savedBookId === book.bookId
              )}
              className="btn-block btn-info"
              onClick={() => handleSaveBook(book.bookId)}
            >
              {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                ? "This book has been saved!"
                : "Save"}
            </Button>
          </Card.Footer>
        )}
      </Card>
    </Col>
  );
};

export default BookCard;
