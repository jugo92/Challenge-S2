const { verifyToken } = require("../Services/token");

module.exports = function () {
  return function (req, res, next) {
    const token = req.signedCookies['jwt']
    if (!token) return res.sendStatus(401);
    const proxyUser = verifyToken(token);
    req.user = proxyUser;
    next();
  };
};
