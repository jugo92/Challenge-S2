const User = require("../dbUser");
const hashPassword = require("../hashPassword");
const config = require("../config/config");
const jsonwebtoken = require("jsonwebtoken");

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
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
    body : {password, name, adresse, city, zip, email, phone, dateofbirth, role}

}= req;

    if(!email || !phone){
        res.status(400).send({ error: "Missing fields" });
        return;
    }

    const userExist = await User.findOne({ where: { email: email } });
    if (userExist) {
        res.status(400).send({ error: "User already exist" });
        return;
    }
    const user = await User.create({
        password,
        passwordHash,
        passwordSalt,
        name,
        adresse,
        city,
        zip,
        email,
        phone,
        dateofbirth,
        role
    });

    const [passwordHash, passwordSalt] = hashPassword(password);

},





module.exports.loginUser = async (req, res) => {
    const {
        body: { email, password },
    } = req;

    if(!email || !password){
        res.status(400).send({ error: "Missing fields" });
        return;
    }

    const user = await User.findOne({ where: { email: email } });

    if(!user){
        res.status(400).send({ error: "User doesn't exist" });
        return;
    }

    const [passwordHash] = hashPassword(password, user.passwordSalt);

    if(passwordHash !== user.passwordHash){
        res.status(400).send({ error: "Wrong password" });
        return;
    }

    const security = config.security.session.secret;
    const jwt = jsonwebtoken.sign(
        {
             id: user.id
             },
              security, {
                 expiresIn:
                  config.security.session.expiresIn 
                }
            );
        res.send({
            token: jwt,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        })

    }


    
module.exports.logoutUser = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } });
        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json("error de la deconnexion de l'utilisateur", error);
    }
    }