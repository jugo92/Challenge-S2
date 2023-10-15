const nodemailer = require('nodemailer');
require("dotenv").config({ path: ".env" });
const mailCompany = process.env.MAIL_USER;
const password = process.env.MAIL_PASSWORD;
const port = process.env.MAIL_PORT;
const host = process.env.MAIL_HOST;
const fs = require('fs');

const htmlResources = "./Mailing/htmlResources.json";
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
            case 'validateUserAccount':
                content = content
                    .replace('{{name}}', user.name.capitalize())
                    .replace('{{confirmLink}}', process.env.API_SERVER_URL + "/verify/" + user.token)
                    .replace('{{emailSupport}}', mailCompany);
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
                    reject({ success: false, error: 'Erreur lors de l\'envoi de l\'e-mail' });
                } else {
                    console.log(info);
                    resolve({ success: true, message: 'E-mail envoyé' });
                }
            });
        });
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Internal server error' };
    }
};