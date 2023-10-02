const User = require("../dbUser");
const DeletedUserArchive = require("../dbArchiveUser");
const {hashPassword,comparePassword} = require("../passwordHelper/passwordHelper");
const config = require("../config/config");
const jsonwebtoken = require("jsonwebtoken");

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
            const userId = req.params.id;
            const user = await User.findOne({ where: { id: userId } });
    
            if (!user) {
                return res.status(404).json({ error: "Utilisateur non trouvé" });
            }
            const archivedUserData = {
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                gender: user.gender,
                adress: user.adress,
                city: user.city,
                zip: user.zip,
                email: user.email,
                phone: user.phone,
                passwordHash: user.passwordHash,
                passwordSalt: user.passwordSalt,
                dateofbirth: user.dateofbirth,
                role: user.role,
            };
    
            await user.destroy();
    
            await DeletedUserArchive.create(archivedUserData);
    
            res.status(200).json({ message: "Utilisateur marqué comme supprimé et archivé avec succès" });
        } catch (error) {
            console.error("Erreur lors de la suppression et de l'archivage de l'utilisateur :", error);
            res.status(500).json({ error: "Erreur lors de la suppression et de l'archivage de l'utilisateur" });
    }
}
    
    

module.exports.registerUser = async (req, res) => {
    const {
        body: { email, password, adress, name, city, zip, phone, dateofbirth, role },
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

    const deletedUser = await User.findOne({ where: { email: email + "_deleted", isDeleted: true } });

    if (deletedUser) {
        deletedUser.email = email;
        deletedUser.isDeleted = false; 


        deletedUser.adress = adress;
        deletedUser.name = name;
        deletedUser.city = city;
        deletedUser.zip = zip;
        deletedUser.phone = phone;
        deletedUser.dateofbirth = dateofbirth;
        deletedUser.role = role;

        await deletedUser.save();

        res.status(200).json({ message: "User recreated successfully" });
    } else {
        const [passwordHash, passwordSalt] = hashPassword(password);

        const newUser = await User.create({
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

        res.status(200).json({ message: "User created successfully", user: newUser });
    }
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




module.exports.logoutUser = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } });
        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json("error de la deconnexion de l'utilisateur", error);
    }
    }

   