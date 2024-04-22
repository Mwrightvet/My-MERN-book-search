const express = require("express");
const path = require("path");
const db = require("./config/connection");
const routes = require("./routes");
const { ApolloServer } = require("@apollo/server");
const { resolvers } = require("./graphql/resolvers");
const { typeDefs } = require("./graphql/typeDefs");
const { expressMiddleware } = require("@apollo/server/express4");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { context } = require("./utils/auth");

const app = express();
const PORT = process.env.PORT || 3001;

//init graphql
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers,
  introspection: true, // Enable introspection for GraphQL Playground
  playground: true, // Enable GraphQL Playground
  context: ({ req, res }) => {
    // Pass the req and res objects to the context
    return { req, res, authMiddleware };
  },
});
// Apply the Apollo Server middleware to the Express app

db.once(
  "open",
  async () =>
    await startStandaloneServer(server, { listen: { port: PORT } ,context:context}).then(
      (res) => console.log(`🚀 Server listening at: ${res.url}`)
    )
);
