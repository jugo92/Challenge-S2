const nodemailer = require("nodemailer");
require("dotenv").config({ path: ".env" });
const mailCompany = process.env.MAIL_USER;
const password = process.env.MAIL_PASSWORD;
const port = process.env.MAIL_PORT;
const host = process.env.MAIL_HOST;
const fs = require("fs");
const crypto = require("crypto");
const verifyRoute = "http://localhost:3000/api/verify/";

const htmlResources = "./htmlResources.json";
let htmlData = null;
function readFileCallback(err, content) {
  if (err) {
    console.error(err);
    return;
  }
  htmlData = JSON.parse(content);
}
fs.readFile(htmlResources, readFileCallback);

const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  auth: {
    user: mailCompany,
    pass: password,
  },
});

module.exports.sendMail = async (user, type) => {
  try {
    let { subject, content } = htmlData[type];

    switch (type) {
      case "validateUserAccount":
        console.log("USER : ", user.lastname);
        content = content
          .replace("{{name}}", user.lastname.toUpperCase())
          .replace("{{confirmLink}}", verifyRoute + user.token)
          .replace("{{emailSupport}}", mailCompany);
        break;
      case "forgetPassword":
        const token = crypto.randomBytes(30).toString("hex");
        content = content
          .replace("{{your_token}}", token)
        break;
      default:
        break;
    }

    const mailOptions = {
      from: mailCompany,
      to: user.email,
      subject: subject,
      html: content,
    };

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
