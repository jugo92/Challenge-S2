const { pbkdf2Sync, randomBytes } = require("crypto");
const config = require("../config/config");


const { keylen, pepper, iteration, digest } = config.security.password

const hashPassword = (
  password,
  salt = randomBytes(128).toString("hex")
) => [
  pbkdf2Sync(password, salt + pepper, iteration, keylen, digest).toString(
    "hex"
  ),
  salt,
]

const comparePassword = (password, passwordHash, passwordSalt) => {
  const [passwordHash2, passwordSalt2] = hashPassword(password, passwordSalt)
  return passwordHash === passwordHash2
}

module.exports = { hashPassword, comparePassword };


