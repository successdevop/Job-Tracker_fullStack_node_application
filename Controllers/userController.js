const { StatusCodes } = require("http-status-codes");
const User = require("../Models/UserModel");
const { validateUpdateUser } = require("../Validations/userValidate");

// == VIEW USER PROFILE == //
const getASingleUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `Provide a user id`,
      });
    }

    if (req.authorizedUser.id != userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `Provide a valid user id`,
      });
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `User not found`,
      });
    }

    res.status(StatusCodes.OK).json({ status: "success", ok: true, user });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Unable to get a user",
    });
  }
};

// == EDIT USER PROFILE == //
const updateASingleUser = async (req, res) => {
  try {
    const { error, value } = validateUpdateUser(req.body);
    if (error) {
      console.log(error);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: "error", ok: false, msg: error.details[0].message });
    }

    const userId = req.params.id;
    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `Provide a user id`,
      });
    }

    if (req.authorizedUser.id != userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `Provide a valid user id`,
      });
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `User not found`,
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: user.email },
      { ...value },
      { new: true, runValidators: true }
    );

    res
      .status(StatusCodes.OK)
      .json({ status: "success", ok: true, updatedUser });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Unable to update user",
    });
  }
};

// == DELETE USER PROFILE == //
const deleteASingleUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `Provide a user id`,
      });
    }

    if (req.authorizedUser.id != userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `Provide a valid user id`,
      });
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `User not found`,
      });
    }

    await User.findOneAndDelete({
      email: user.email,
      _id: req.authorizedUser.id,
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      ok: true,
      msg: "Account deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Unable to delete account",
    });
  }
};

module.exports = { getASingleUser, updateASingleUser, deleteASingleUser };
