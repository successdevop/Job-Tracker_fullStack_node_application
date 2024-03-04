const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const User = require("../Models/UserModel");

const authenticateUser = async (req, res, next) => {
  try {
    const authHeaderToken = req.headers.authorization.split(" ")[1];
    if (!authHeaderToken || authHeaderToken === undefined) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        ok: false,
        msg: "Authentication invalid",
      });
    }

    const decode = jwt.verify(authHeaderToken, process.env.JWT_SECRET);
    if (decode.id && decode.email) {
      const user = await User.findOne({ email: decode.email }).select(
        "-password"
      );
      if (user) {
        req.authorizedUser = { id: user._id, email: user.email };
        next();
      } else {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          status: StatusCodes.UNAUTHORIZED,
          ok: false,
          msg: "Authentication invalid",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid" });
  }
};

module.exports = { authenticateUser };
