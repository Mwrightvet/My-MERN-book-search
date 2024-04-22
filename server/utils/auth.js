const jwt = require("jsonwebtoken");
const { ErrorTypes, throwCustomError } = require("./graphqlCustomErrors");

// set token secret and expiration date
const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
  // function for our authenticated routes
  authMiddleware: function (req, res, next) {
    // allows token to be sent via  req.query or headers
    let token = req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return res.status(400).json({ message: "You have no token!" });
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid token");
      return res.status(400).json({ message: "invalid token!" });
    }

    // send to next endpoint
    next();
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
  context: async ({ req, res }) => {
    if (req.body.operationName === "IntrospectionQuery") {
      // console.log('blocking introspection query..');
      return {};
    }
    if (
      req.body.operationName == "Register" ||
      req.body.operationName == "Login"
    ) {
      return {};
    }

    let token = req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      throwCustomError("User is not Authenticated", ErrorTypes.UNAUTHENTICATED);
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      return data;
    } catch {
      throwCustomError("User is not Authenticated", ErrorTypes.UNAUTHENTICATED);
    }
  },
};
