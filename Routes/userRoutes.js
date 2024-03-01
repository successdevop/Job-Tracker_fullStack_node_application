const express = require("express");
const { registerNewUser, loginUser } = require("../Controllers/userController");
const userRouter = express.Router();

userRouter.route("/register").post(registerNewUser);
userRouter.route("/login").post(loginUser);

module.exports = userRouter;
