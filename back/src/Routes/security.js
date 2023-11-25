const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { User } = require("../Models");
const ValidationError = require("../errors/ValidationError");
const { createToken } = require("../Services/token");
const { uuidv7 } = require("uuidv7");
const { isPasswordExpired } = require("../Helper/Utils");
const router = new Router();

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
    if (user.loginAttempts >= 3) {
      return next(
        new ValidationError({
          accountLocked: "Compte bloque",
        })
      );
    }

    if (
      user.lastPasswordChange &&
      isPasswordExpired(user.lastPasswordChange, 60)
    ) {
      return next(
        new ValidationError({
          expired: "Mot de passe expire.",
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
    });

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

module.exports = router;
