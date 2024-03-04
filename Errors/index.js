const CustomAPIError = require("./customAPIError");
const BadRequestError = require("./bad_request");
const NotFoundError = require("./notFoundError");
const UnAuthorizedError = require("./unAuthorizedError");

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnAuthorizedError,
  NotFoundError,
};
