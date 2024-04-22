const {
  getSingleUser,
  login,
  createUser,
  saveBook,
  deleteBook,
} = require("../controllers/user-controller");

module.exports.resolvers = {
  Query: {
    //   books: async () => await getBooks(),
    me: async (_,__,contextValue) => await getSingleUser(contextValue),
    // books: async () => await getBooks(),
    // book: async (_, { id }) => await getBookById(id),
  },
  Mutation: {
    addBook: async (_, data, contextValue) =>
      await saveBook(data, contextValue),
    deleteBook: async (_, data, contextValue) =>
      await deleteBook(data, contextValue),
    register: async (_, data) => await createUser(data),
    login: async (_, data) => await login(data),
  },
};
