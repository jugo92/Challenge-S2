const User = require("../Models/dbUser");
const { hashPassword, comparePassword } = require("../Helper/passwordHelper");
const config = require("../../config");
const jsonwebtoken = require("jsonwebtoken");
const { createHash } = require("crypto");

const { sendMail } = require("./mailController");

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    console.log(users);
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json("error de la reception des users", error);
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json("error de la reception de l'utilisateur", error);
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json("error de la creation de l'utilisateur", error);
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const user = await User.update(req.body, { where: { id: req.params.id } });
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json("error de la modification de l'utilisateur", error);
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    const hashedEmail = createHash("sha256").update(user.email).digest("hex");
    const hashePhone = createHash("sha256").update(user.phone).digest("hex");
    const hasheName = createHash("sha256").update(user.name).digest("hex");
    const hasheAdress = createHash("sha256").update(user.adress).digest("hex");
    const hasheCity = createHash("sha256").update(user.city).digest("hex");
    const hasheZip = createHash("sha256").update(user.zip).digest("hex");
    const hasheDateofbirth = createHash("sha256")
      .update(user.dateofbirth)
      .digest("hex");
    const hasheRole = createHash("sha256").update(user.role).digest("hex");

    user.email = hashedEmail;
    user.phone = hashePhone;
    user.name = hasheName;
    user.adress = hasheAdress;
    user.city = hasheCity;
    user.zip = hasheZip;
    user.dateofbirth = hasheDateofbirth;
    user.role = hasheRole;

    await user.save();

    res.status(200).json({ message: "Utilisateur supprimer avec succés" });
  } catch (error) {
    res.status(400).json({
      error: "Erreur de la suppression de l'utilisateur",
      message: error.message,
    });
  }
};

module.exports.registerUser = async (req, res) => {
  const {
    body: {
      email,
      password,
      adress,
      name,
      city,
      zip,
      phone,
      dateofbirth,
      role,
    },
  } = req;

  if (!email || !phone) {
    res.status(400).send({ error: "Missing fields" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).send({ error: "Invalid email" });
    return;
  }

  const [passwordHash, passwordSalt] = hashPassword(password);
  console.log(passwordHash);
  const users = await User.create({
    passwordHash,
    passwordSalt,
    adress,
    name,
    city,
    zip,
    email,
    phone,
    dateofbirth,
    role,
  });

  await sendMail(users, "validateUserAccount")
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });

  res.send(users);
};

module.exports.loginUser = async (req, res) => {
  const {
    body: { email, password },
  } = req;

  if (!email || !password) {
    res.status(400).send({ error: "Missing fields" });
    return;
  }
  console.log(password);

  const user = await User.findOne({ where: { email: email } });
  // console.log(user.passwordSalt);

  if (!user) {
    res.status(400).send({ error: "User doesn't exist" });
    return;
  }

  const [passwordHash] = hashPassword(password, user.passwordSalt);

  if (passwordHash !== user.passwordHash) {
    res.status(401).send({ error: "Invalid password" });
    return;
  }

  const security = config.security.session.secret;
  const jwt = jsonwebtoken.sign(
    {
      id: user.id,
    },
    security,
    {
      expiresIn: config.security.session.expiresIn,
    }
  );

  res.send({
    token: jwt,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
};

module.exports.verifyUser = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ where: { token: token } });
  if (!user) {
    res.status(200).send({ error: "Invalid token" });
    return;
  } else if (user.isVerified) {
    res.status(200).send({ error: "User already verified" });
    return;
  }
  user.isVerified = true;
  await user.save();
  res.send({ message: "User verified" });
};

module.exports.logoutUser = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json("error de la deconnexion de l'utilisateur", error);
  }
};