const { StatusCodes } = require("http-status-codes");
const User = require("../Models/UserModel");
const {
  validateNewUser,
  validateLoginUser,
} = require("../Validations/userValidate");
const {
  hashPassword,
  checkPassword,
  generateToken,
  formattedResponse,
} = require("../Utils/hashPassword");

// == REGISTER == //
const registerNewUser = async (req, res) => {
  try {
    const { error, value } = validateNewUser(req.body);
    if (error) {
      console.log(error);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: error.details[0].message,
      });
    }

    if (value.password !== value.confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: "Passwords do not match",
      });
    }

    const user = await User.findOne({ email: value.email });
    if (user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: "Email already exist, choose another email",
      });
    }

    const newPassword = hashPassword(value.password);
    value.password = newPassword;

    const newUser = new User({ ...value });
    await newUser.save();
    newUser.password = undefined;
    newUser.__v = undefined;

    res.status(StatusCodes.CREATED).json({
      status: "error",
      ok: false,
      msg: "Account created successfully",
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error });
  }
};

// == LOGIN == //
const loginUser = async (req, res) => {
  try {
    const { error, value } = validateLoginUser(req.body);
    if (error) {
      console.log(error);
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: error.details[0].message,
      });
    }

    const user = await User.findOne({ email: value.email });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: "Bad credentials",
      });
    }

    const isPasswordMatch = checkPassword(value.password, user.password);
    if (!isPasswordMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: "Invalid Email or Password",
      });
    }

    const token = generateToken(user);
    const response = formattedResponse(user, token);

    res.status(StatusCodes.OK).json({
      status: "success",
      ok: true,
      msg: response,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error });
  }
};

module.exports = { registerNewUser, loginUser };
