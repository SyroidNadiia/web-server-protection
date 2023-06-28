const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/user");
const { increaseLoginAttempts } = require("../../utils/authUtils");
const dotenv = require("dotenv");
const sendEmail = require("../../helpers/sendEmail");
dotenv.config();

const { SECRET_KEY } = process.env;

const login = async (req, res) => {
  const { email, password, verificationToken } = req.body;
  const user = await User.findOne({ email });
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!user || !passwordCompare) {
    await increaseLoginAttempts(email);
    throw createError(401, `Email or password are wrong`);
  }

  if (user.verify) {
    await sendEmail(email, verificationToken);
  } else {
    throw createError(401, `Letter of verify does not send`);
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    status: "success",
    code: 200,
    data: {
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    },
  });
};

module.exports = login;
