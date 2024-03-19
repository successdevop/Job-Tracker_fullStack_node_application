const express = require("express");
const { registerNewUser, loginUser } = require("../Controllers/authController");
const authRouter = express.Router();

authRouter.route("/register").post(registerNewUser);
authRouter.route("/login").post(loginUser);

module.exports = authRouter;
