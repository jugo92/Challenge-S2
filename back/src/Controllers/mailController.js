const nodemailer = require("nodemailer");
require("dotenv").config({ path: ".env" });
const mailCompany = process.env.MAIL_USER;
const password = process.env.MAIL_PASSWORD;
const port = process.env.MAIL_PORT;
const host = process.env.MAIL_HOST;
const fs = require("fs").promises;
const crypto = require("crypto");
const verifyRoute = "http://localhost:3000/api/verify/";

const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  auth: {
    user: mailCompany,
    pass: password,
  },
});

module.exports.sendMail = async (user, type, subject, attachementPath = null) => {
  try {
    console.log(type)
    let content = await fs.readFile(
      `mails/${type}.txt`,
      "utf8"
    );

    switch (type) {
      case "validateUserAccount":
        content = content
          .replace("{{name}}", user.lastname.toUpperCase())
          .replace("{{confirmLink}}", verifyRoute + user.token)
          .replace("{{emailSupport}}", mailCompany);
        break;
      case "forgetPassword":
        const token = crypto.randomBytes(30).toString("hex");
        content = content.replace("{{your_token}}", token);
        break;
      case "validateOrder":
        console.log("ICIIIIIIIIIIIIIIIII")
        content = content.replace("{{name}}", user.lastname);
        break;
      default:
        break;
    }

    const mailOptions = {
      from: mailCompany,
      to: user.email,
      subject: subject,
      html: content,
      attachments: []  
    };

    if (attachementPath) {
      console.log('DANS LE ATTACHEMENTPATH')
      mailOptions.attachments.push({
        filename: 'facture.pdf', 
        path: attachementPath  
      });
    }

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          reject({
            success: false,
            error: "Erreur lors de l'envoi de l'e-mail",
          });
        } else {
          console.log(info);
          resolve({ success: true, message: "E-mail envoyé" });
        }
      });
    });
  } catch (error) {
    console.error(error);
    return { success: false, error: "Internal server error" };
  }
};
