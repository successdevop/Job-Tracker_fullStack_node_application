const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const User = require("../Models/UserModel");

const verifyUserToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token || token === undefined) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        ok: false,
        msg: "Invalid Token Credentials",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (decode.id && decode.email) {
      const user = await User.findOne({ email: decode.email }).select(
        "-password"
      );
      if (user) {
        req.authorizedUser = { id: user._id, email: user.email };
        next();
      } else {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          status: "error",
          ok: false,
          msg: "Bad Credentials",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "User not authenticated" });
  }
};

module.exports = { verifyUserToken };
