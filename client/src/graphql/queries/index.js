import { gql } from "@apollo/client";

export const ME = gql`
  query me {
    me {
      _id
      email
      username
      savedBooks {
        _id
        authors
        bookId
        description
        genre
        image
        link
        title
      }
    }
  }
`;
