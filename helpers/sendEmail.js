const nodemailer = require("nodemailer");

const sendEmail = async () => {
  const { MAIL_PASSWORD } = process.env;

  const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465,
    secure: true,
    auth: {
      user: "shcherbelova@ukr.net",
      pass: MAIL_PASSWORD,
    },
  }

  const transport = nodemailer.createTransport(nodemailerConfig);

  const email = {
    to: "shcherbelova90@gmail.com",
    from: "shcherbelova@ukr.net",
    subject: "Test email",
    html: "<p><srtong>TEST EMAIL</srtong></p>",
  };

  transport
    .sendMail(email)
    .then(() => console.log("Email send success"))
    .catch((error) => console.log(error.message));
}

module.exports = sendEmail;