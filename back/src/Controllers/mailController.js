const nodemailer = require("nodemailer");
require("dotenv").config({ path: ".env" });
const mailCompany = process.env.MAIL_USER;
const password = process.env.MAIL_PASSWORD;
const port = process.env.MAIL_PORT;
const host = process.env.MAIL_HOST;
const fs = require("fs").promises;
const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  auth: {
    user: mailCompany,
    pass: password,
  },
});

module.exports.sendMail = async (
  mail,
  subject,
  attachementPath = null,
  content
) => {
  try {
    let masterMail = await fs.readFile(`mails/masterMail.txt`, "utf8");
    masterMail = masterMail.replace("{{content}}", content);

    const mailOptions = {
      from: mailCompany,
      to: mail,
      subject: subject,
      html: masterMail,
      attachments: [],
    };

    if (attachementPath) {
      mailOptions.attachments.push({
        filename: "facture.pdf",
        path: attachementPath,
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
module.exports.sendNotification = async (
  content,
  subject,
  productId,
  categoryId,
  type,
  User,
  NotificationUser
) => {
  try {
    const notificationUsers = await NotificationUser.findAll({
      where: {
        CategoryId: categoryId,
        ProductId: productId,
        type_id: type,
      },
      include: [
        {
          model: User,
        },
      ], 
    });
    notificationUsers.forEach(async notification => {
      let contentWithName = content.replace(
        "{{name}}",
        notification.User.firstname.toUpperCase()
      );
      await this.sendMail(
        notification.User.email,
        subject,
        null,
        contentWithName
      );
    });
  } catch (err) {
    console.log("Error : ", err);
  }
};

// module.exports.sendNotification = async (
//   type,
//   subject,
//   user,
//   product,
//   category,
//   notificationType
// ) => {
//   try {
//     let content = await fs.readFile(`mails/${type}.txt`, "utf8");
//     switch (notificationType) {
//       case 1:
//         content = content.replace("{{name}}", user.firstname);
//         break;
//       case 2:
//         console.log(product);
//         console.log(user);
//         content = content
//           .replace("{{name}}", user.firstname)
//           .replace("{{new_price}}", product.price);
//         break;
//       case 3:
//         content = content.replace("{{name}}", user.lastname);
//       case 5:
//         content = content
//           .replace("{{name}}", user.firstname)
//           .replace("{{product_name}}", product.name);
//         break;
//       default:
//         break;
//     }

//     const mailOptions = {
//       from: mailCompany,
//       to: user.email,
//       subject: subject,
//       html: content,
//       attachments: [],
//     };

//     return new Promise((resolve, reject) => {
//       transporter.sendMail(mailOptions, (err, info) => {
//         if (err) {
//           console.error(err);
//           reject({
//             success: false,
//             error: "Erreur lors de l'envoi de l'e-mail",
//           });
//         } else {
//           console.log(info);
//           resolve({ success: true, message: "E-mail envoyé" });
//         }
//       });
//     });
//   } catch (error) {
//     console.error(error);
//     return { success: false, error: "Internal server error" };
//   }
// };
