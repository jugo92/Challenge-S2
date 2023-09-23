require("dotenv").config({ path: ".env" });

export default {

    security: {
        password: {
          pepper: process.env.SECURITY_PASSWORD_PEPPER || "pepper",
          interation: 1000,
          Keylen: 128,
          digest: "sha512",
        },
        session: {
          secret: SECRET_SESSION_KEY || "secret",
          expiresIn: "1h",
        },
       
      },

    }