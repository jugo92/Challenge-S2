const { pbkdf2Sync, randomBytes } = require("crypto");
const config = require("./config/config");

const { Keylen, pepper, interation, digest } = config.security.password;
const hashPassword = (password, salt = randomBytes(128).toString("hex")) => {
    const fullHash = pbkdf2Sync(password, salt + pepper, interation, Keylen, digest).toString("hex");
    const truncatedSalt = salt.substring(0, 255); 
    const truncatedHash = fullHash.substring(0, 255);
    return [truncatedHash, truncatedSalt];
  };
  

module.exports = hashPassword;
