const cron = require("node-cron");
const fs = require("fs").promises;
const { User, Order } = require("../Models/index");
const { Op } = require("sequelize");
const { sendMail } = require("../Controllers/mailController");
module.exports.initCron = () => {
  remindChangePassword();
};

const remindChangePassword = async () => {
  try {
    var dateIlYa60Jours = new Date();
    dateIlYa60Jours.setDate(dateIlYa60Jours.getDate() - 60);

    var dateDebut = new Date(dateIlYa60Jours);
    dateDebut.setHours(0, 0, 0, 0);

    var dateFin = new Date(dateIlYa60Jours);
    dateFin.setHours(23, 59, 59, 999);

    const users = await User.findAll({
      where: {
        lastPasswordChange: {
          [Op.between]: [dateDebut, dateFin],
        },
      },
    });
    const content = await fs.readFile(`mails/remindPasswordChange.txt`, "utf8");
    for (const user of users) {
      const contentWithName = content.replace(
        "{{name}}",
        user.firstname.toUpperCase()
      );
      await sendMail(user.email, "Ca fait 60 jours", null, contentWithName);
    }
  } catch (error) {
    console.error("Erreur lors de l'exécution du cron job :", error);
  }
};

