const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: "shcherbelova@ukr.net",
    pass: "22965ira",
  },
});

const { BASE_URL } = process.env;

const sendEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: "shcherbelova@ukr.net",
    to: email,
    subject: "Verify your email",
    html: `<p>Click verify email ${BASE_URL}/api/auth/verify/${verificationToken}</p>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendEmail;