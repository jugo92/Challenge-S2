const { pbkdf2Sync, randomBytes} = require("crypto");
const config = require("./config/config");
const e = require("express");

const { Keylen, pepper, interation, digest } = config.security.password;
const hashPassword = (password, salt = randomBytes(128).toString("hex")) => [
  pbkdf2Sync(password, salt + pepper, interation, Keylen, digest).toString(
    "hex"
  ),
  salt,
];


module.exports = { hashPassword};