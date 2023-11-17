const { verifyToken } = require("../Services/token");

module.exports = function ({ excludePaths = [] } = {}) {
  return function (req, res, next) {
    if (excludePaths.includes(req.path)) return next();
    const token = req.cookies?.jwt;
    if (!token) return res.sendStatus(401);
    const proxyUser = verifyToken(token);
    req.user = proxyUser;
    console.log(proxyUser.id);
    next();
  };
};
