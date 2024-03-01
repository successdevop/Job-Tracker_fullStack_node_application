const { StatusCodes } = require("http-status-codes");

const notFoundError = (req, res) =>
  res.status(StatusCodes.NOT_FOUND).send("Resource not found");

module.exports = notFoundError;
