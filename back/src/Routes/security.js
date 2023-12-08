const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { User } = require("../Models");
const ValidationError = require("../errors/ValidationError");
const { createToken } = require("../Services/token");
const { uuidv7 } = require("uuidv7");
const { isPasswordExpired } = require("../Helper/Utils");
const { sendMail } = require("../Controllers/mailController");
const router = new Router();
const fs = require("fs").promises;
const crypto = require("crypto");

router.post("/login", async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return next(
        new ValidationError({
          email: "Mauvais Identifiants.",
          password: "Mauvais Identifiants.",
        })
      );
    }
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return next(
        new ValidationError({
          email: "Mauvais Identifiants.",
          password: "Mauvais Identifiants.",
        })
      );
    }
    if(!user.isActive){
      return next(
        new ValidationError({
          isActive: "Votre compte est désactivé.",
        })
      )
    }
    if (!user.isVerified) {
      return next(
        new ValidationError({
          accountLocked: "Votre compte n'a pas ete verifie",
        })
      );
    }

    if (user.loginAttempts >= 3) {
      return next(
        new ValidationError({
          accountLocked: "Compte bloque",
        })
      );
    }

    if (!(await bcrypt.compare(req.body.password, user.password))) {
      await user.increment("loginAttempts");
      return next(
        new ValidationError({
          password: "Mauvais Identifiants.",
        })
      );
    }
    await user.update({ loginAttempts: 0 });

    const token = createToken(user);

    res.cookie("jwt", token, {
      httpOnly: true,
      signed: true
    });

    return res.json(user);
  } catch (e) {
    next(e);
  }
});

router.get("/verify/:token", async (req, res, next) => {
  try {
    if (!req.params.token) {
      return next(
        new ValidationError({
          token: "Pas de token.",
        })
      );
    }
    const user = await User.findOne({
      where: {
        token: req.params.token,
      },
    });
    if (!user) {
      return next(
        new ValidationError({
          token: "Token invalide.",
        })
      );
    }
    if (user.isVerified) {
      return next(
        new ValidationError({
          user: "Votre compte a deja ete verifie",
        })
      );
    }
    const token = crypto.randomBytes(30).toString("hex");
    await user.update({ isVerified: 1 , token: token});
    return res.json(user);
  } catch (e) {
    next(e);
  }
});

router.post("/updatePassword/:token", async (req, res, next) => {
  try {
    if (!req.params.token) {
      return next(
        new ValidationError({
          token: "Pas de token.",
        })
      );
    }
    const user = await User.findOne({
      where: {
        token: req.params.token,
      },
    });
    const token = crypto.randomBytes(30).toString("hex");
    await user.update({password:req.body.password, token: token})
    return res.json(user);
  } catch (e) {
    next(e);
  }
});

router.get("/checkToken/:token", async (req, res, next) => {
  try {
    if (!req.params.token) {
      return next(
        new ValidationError({
          token: "Pas de token.",
        })
      );
    }
    const user = await User.findOne({
      where: {
        token: req.params.token,
      },
    });
    if (!user) {
      return next(
        new ValidationError({
          token: "Token invalide.",
        })
      );
    }
    return res.json(user);
  } catch (e) {
    next(e);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const id = uuidv7();
    const user = await User.create({
      id,
      ...req.body,
      role: "user",
      isVerified: false,
      loginAttempts: 0,
      lastPasswordChange: new Date(),
    });
    res.status(201).json(user);
  } catch (error) {
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      error = ValidationError.fromSequelize(error);
    }
    next(error);
  }
});

router.post("/forget-password", async (req, res, next) => {
  try {
    if (!req.body.email) {
      return next(
        new ValidationError({
          email: "Veuillez fournir un email.",
        })
      );
    }
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (user !== null) {
      let content = await fs.readFile(`mails/forgetPassword.txt`, "utf8");
      const token = crypto.randomBytes(30).toString("hex");
      content = content.replace(`{{url_forget}}`, `${process.env.CLIENT_URL}/new_password?token=${token}`);
      await user.update({token:token})
      sendMail(user.email, "Reinitialiser votre mot de passe", null, content);
      res.status(200).send();
    } else {
      res.status(200).send();
    }
  } catch (error) {
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      error = ValidationError.fromSequelize(error);
    }
    next(error);
  }
});

module.exports = router;
