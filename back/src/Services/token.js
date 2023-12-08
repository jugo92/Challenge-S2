const jwt = require("jsonwebtoken");

exports.createToken = function (user) {
  return jwt.sign(
    {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

exports.verifyToken = function (token) {
  return jwt.verify(token, process.env.JWT_SECRET);
};
