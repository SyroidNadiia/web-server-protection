const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");

const { User } = require("../../models/user");
const { sendEmail } = require("../../helpers");

const { BASE_URL } = process.env;

const signup = async (req, res) => {
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw createError(409, `This ${email} is already in use`);
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const verificationToken = nanoid();

   const result = await User.create({
    email,
    password: hashPassword,
    avatarURL,
    subscription,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    status: "success",
    code: 201,
    date: {
      user: {
        email: result.email,
        subscription: result.subscription,
      },
    },
  });
};

module.exports = signup;
