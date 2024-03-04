const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../Errors");

const generalErrorAPI = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    console.log(err);
    return res
      .status(err.statusCode)
      .json({ status: err.statusCode, ok: false, msg: err.message });
  }

  console.log(err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    ok: false,
    msg: "Something went wrong, try again later...",
  });
};

module.exports = generalErrorAPI;
