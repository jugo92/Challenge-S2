const User = require("../dbUser");
const {hashPassword,comparePassword} = require("../passwordHelper/passwordHelper");
const config = require("../config/config");
const jsonwebtoken = require("jsonwebtoken");
const crypto = require('crypto');
const {sendMail} = require("../../Mailing/mailController");
const {router} = require("express/lib/application");

module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        console.log(users);
        res.status(200).json({ users });
    } catch (error) {
        res.status(400).json("error de la reception des users", error);
    }
}

module.exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } });
        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json("error de la reception de l'utilisateur", error);
    }
}

module.exports.getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.params.email } });
        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json("error de la reception de l'utilisateur", error);
    }
}


module.exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json("error de la creation de l'utilisateur", error);
    }
}

module.exports.updateUser = async (req, res) => {
    try {
        const user = await User.update(req.body, { where: { id: req.params.id } });
        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json("error de la modification de l'utilisateur", error);
    }
}

module.exports.deleteUser = async (req, res) => {
    try {
        const user = await User.destroy({ where: { id: req.params.id } });
        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json("error de la suppression de l'utilisateur", error);
    }
}

module.exports.registerUser = async (req, res) => {

    const {
        body: { email, password, adress, name, city, zip, phone, dateofbirth, role },

    }= req;


    if (!email || !phone ) {
        res.status(400).send({ error: "Missing fields" });
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).send({ error: "Invalid email" });
        return;
    }

    let users = await User.findOne({ where: { email: email } });

    if (users && !users.isVerified) {
        res.status(200).send({ error: "User already exists with this email address, please checks your box mail. You will receive an email to confirm your email adrdress." });
    }else if(users && users.isVerified){
        res.status(200).send({ error: "User already exists" });
        return;
    }else{
        const [passwordHash, passwordSalt] = hashPassword(password);
        console.log(passwordHash)
        users = await User.create({
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
            token: crypto.randomUUID(),
        });
    }


    await sendMail(users, "validateUserAccount")
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
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
    console.log(password)

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
            id: user.id
        },
        security,
        {
            expiresIn: config.security.session.expiresIn
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
}

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

    res.redirect(process.env.APP_SERVER_URL + "/login");
}



module.exports.logoutUser = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } });
        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json("error de la deconnexion de l'utilisateur", error);
    }
}

   