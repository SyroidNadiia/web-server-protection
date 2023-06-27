const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "lorenz.wilkinson26@ethereal.email",
    pass: "3E7sMkREVNQjsCB8zs",
  },
});

const { BASE_URL } = process.env;

const sendEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: "nura_arh@ukr.net",
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