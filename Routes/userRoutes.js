const express = require("express");
const {
  getASingleUser,
  updateASingleUser,
  deleteASingleUser,
} = require("../Controllers/userController");
const userRouter = express.Router();

userRouter
  .route("/:id")
  .get(getASingleUser)
  .put(updateASingleUser)
  .delete(deleteASingleUser);

module.exports = userRouter;
