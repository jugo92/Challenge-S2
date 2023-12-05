const jwt = require("jsonwebtoken");

exports.createToken = function (user) {
  return jwt.sign(
    {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );
};

exports.verifyToken = function (token) {
  return jwt.verify(token, process.env.JWT_SECRET);
};
