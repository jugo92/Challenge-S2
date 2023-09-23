

module.exports ={

    security: {
        password: {
          pepper: "pepper",
          interation: 1000,
          Keylen: 128,
          digest: "sha512",
        },
        session: {
          secret:  "secret",
          expiresIn: "1h",
        },
       
      },

    }