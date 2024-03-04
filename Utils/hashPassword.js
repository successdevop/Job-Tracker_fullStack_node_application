const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(+process.env.SALT_ROUND);
  return bcrypt.hashSync(password, salt);
};

const checkPassword = (givenPassword, storedPassword) => {
  return bcrypt.compareSync(givenPassword, storedPassword);
};

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

const formattedResponse = (user, token) => {
  return {
    id: user._id,
    userName: user.userName,
    email: user.email,
    token,
  };
};

module.exports = {
  hashPassword,
  checkPassword,
  generateToken,
  formattedResponse,
};
