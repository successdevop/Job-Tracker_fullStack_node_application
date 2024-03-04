const {
  validateNewUser,
  validateLoginUser,
} = require("../Validations/userValidate");
const User = require("../Models/UserModel");
const { StatusCodes } = require("http-status-codes");
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
        status: StatusCodes.BAD_REQUEST,
        ok: false,
        msg: error.details[0].message,
      });
    }

    if (value.password !== value.confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        ok: false,
        msg: "Passwords do not match",
      });
    }

    const newPassword = hashPassword(value.password);
    value.password = newPassword;

    const newUser = new User({ ...value });
    await newUser.save();
    newUser.password = undefined;
    newUser.__v = undefined;

    res.status(StatusCodes.CREATED).json({ newUser });
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
        status: StatusCodes.BAD_REQUEST,
        ok: false,
        msg: error.details[0].message,
      });
    }

    const isUserExist = await User.findOne({ email: value.email });
    if (!isUserExist) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        ok: false,
        msg: "Invalid credentials",
      });
    }

    const isPasswordMatch = checkPassword(value.password, isUserExist.password);
    if (!isPasswordMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        ok: false,
        msg: "Invalid Email or Password",
      });
    }

    const token = generateToken(isUserExist);
    const response = formattedResponse(isUserExist, token);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      ok: true,
      msg: response,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error });
  }
};

module.exports = { registerNewUser, loginUser };
