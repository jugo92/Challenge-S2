const jsonwebtoken = require('jsonwebtoken');
const config = require('../config/config');

const authenticate = (req, res, next) => {
    const {
        headers: { authentication: jwt },
    } = req

    try {
        const { payload } = jsonwebtoken.verify(jwt, config.security.session.secret)

        req.session = payload
        console.log(payload)
        next()
    } catch (err) {
        if (err instanceof jsonwebtoken.TokenExpiredError) {
            res.status(401).send(
                {
                    error: {
                        message: "Token expired",
                    }
                }
            )
        }
        if (err instanceof jsonwebtoken.JsonWebTokenError) {
            res.status(401).send(
                {
                    error: {
                        message: "Invalid token",
                    }
                }
            )
        }
        throw err
    }
}

module.exports = authenticate;