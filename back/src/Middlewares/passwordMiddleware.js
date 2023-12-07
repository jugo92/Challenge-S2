const bcrypt = require("bcrypt");
const ValidationError = require("../errors/ValidationError")
const {User}=require("../Models/")
module.exports = async function (req, res, next) {
  try {
    if (req.body.password) {
      if (!req.body.oldPassword) {
        return next(
          new ValidationError({
            oldPassword: "Veuillez saisir votre ancien mot de passe.",
          })
        );
      }
      console.log(req.params.id);
      const user = await User.findByPk(req.params.id);

      // Vérifier si le mot de passe actuel correspond à oldPassword
      const isPasswordCorrect = await bcrypt.compare(
        req.body.oldPassword,
        user.password
      );

      if (!isPasswordCorrect) {
        return next(
          new ValidationError({
            oldPassword: "Mauvais mot de passe actuel.",
          })
        );
      }
    }

    // Continuer vers le prochain middleware ou route
    next();
  } catch (error) {
    console.error("Erreur lors de la vérification du mot de passe :", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}