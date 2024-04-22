const { buildSchema } = require("graphql");

module.exports.typeDefs = `
type Book {
    _id: ID!
    title: String!
    authors: [String]
    genre: String
    image: String
    link: String
    description: String!
    bookId: String!
    user: User!
  }
  
  type User {
    _id: ID!
    username: String!
    email: String!
    token: String!
    savedBooks: [Book]
  }
  
  input Register {
    email: String!
    username: String!
    password: String!
  }
  
  input Login {
    password: String!
    email: String!
  }

  input BookInput {
    title: String!
    authors: [String]
    genre: String
    image: String
    link: String
    description: String!
    bookId: String!
  }

  type Query {
    me: User
  }
  
  type Mutation {
    addBook(data: BookInput): Book
    login(data: Login!): User
    register(data: Register!): User
    deleteBook(bookId: ID!): Boolean
  }
  
`;
