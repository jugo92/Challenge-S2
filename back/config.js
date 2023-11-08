

module.exports ={

    security: {
        password: {
          pepper: "pepper",
          iteration: 1000,
          keylen: 128,
          digest: "sha512",
        },
        session: {
          secret:  "secret",
          expiresIn: "1h",
        },
       
      },

    }