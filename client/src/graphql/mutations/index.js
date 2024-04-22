import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation Login($password: String!, $email: String!) {
    login(data: { password: $password, email: $email }) {
      _id
      email
      token
      username
    }
  }
`;

export const CREATE_USER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(
      data: { username: $username, email: $email, password: $password }
    ) {
      email
      _id
      username
      token
    }
  }
`;

export const ADD_BOOK = gql`
  mutation addBook($data: BookInput) {
    addBook(data: $data) {
      _id
      title
      description
      bookId
      user {
        _id
        email
        username
      }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($bookId: ID!) {
    deleteBook(bookId: $bookId)
  }
`;
