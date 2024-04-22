const { GraphQLError } = require("graphql");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

module.exports = {
  // get a single user by either their id or their username
  async getSingleUser(user) {
    const foundUser = await User.findById(user._id).populate("savedBooks");

    if (!foundUser) {
      return res
        .status(400)
        .json({ message: "Cannot find a user with this id!" });
    }

    return foundUser
  },
  // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
  async createUser({ data }, res) {
    const user = await User.create(data);
    if (!user) {
      return res.status(400).json({ message: "Something is wrong!" });
    }
    const token = signToken(user);
    return {
      username: user.username,
      email: user.email,
      _id: user._id,
      token,
    };
  },
  // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
  // {body} is destructured req.body
  async login({ data: { password, email } }, res) {
    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      return res.status(400).json({ message: "Can't find this user" });
    }

    const correctPw = await user.isCorrectPassword(password);

    if (!correctPw) {
      return res.status(400).json({ message: "Wrong password!" });
    }
    const token = signToken(user);
    return {
      username: user.username,
      email: user.email,
      _id: user._id,
      token,
    };
  },
  // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
  // user comes from `req.user` created in the auth middleware function
  async saveBook({ data }, user) {
    try {
      const { _id } = user;
      // Create a new book document
      const newBook = new Book({
        ...data,
        user: _id, // Set the user ID for the book
      });
      // Save the new book document to the database
      await newBook.save();
      const usr = await User.findById(_id);
      usr.savedBooks.push(newBook._id);
      await usr.save();
      return newBook.populate("user");
    } catch (err) {
      console.log(err);
      throw new GraphQLError(err);
    }
  },
  // remove a book from `savedBooks`
  async deleteBook({ bookId }, user) {
    try {
      const { _id } = user;
      // Find the book
      const book = await Book.findById(bookId);
      if (!book) {
        throw new Error("Book not found");
      }
      // Remove the book from the user's savedBooks array
      await User.findByIdAndUpdate(
        _id,
        { $pull: { savedBooks: bookId } },
        { new: true, runValidators: true }
      );
      // Delete the book document
      await Book.findByIdAndDelete(bookId);
      return true; // Return true if deletion is successful
    } catch (err) {
      console.error(err);
      return false; // Return false if deletion fails
    }
  },
};
