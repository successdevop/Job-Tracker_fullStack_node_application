const { StatusCodes } = require("http-status-codes");
const { validateCreateJob } = require("../Validations/jobValidation");
const Job = require("../Models/JobModel");

const getAllJobsAppliedFor = async (req, res) => {
  const jobs = await Job.find({});
  res.send("all jobs");
};

const createNewJob = async (req, res) => {
  try {
    req.body.createdBy = req.authorizedUser.id;

    const { error, value } = validateCreateJob(req.body);
    if (error) {
      console.log(error);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        ok: false,
        msg: error.details[0].message,
      });
    }

    const jobCreated = await Job.create({ ...value });
    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      ok: true,
      msg: jobCreated,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      ok: false,
      msg: "Unable to create job, please try again later",
    });
  }
};

const getASingleJob = (req, res) => {
  res.send("get single job");
};

const updateAJob = (req, res) => {
  res.send("update job");
};

const deleteASingleJob = (req, res) => {
  res.send("delete a single job");
};

const deleteAllJobs = (req, res) => {
  res.send("delete all job");
};

module.exports = {
  getAllJobsAppliedFor,
  createNewJob,
  getASingleJob,
  updateAJob,
  deleteASingleJob,
  deleteAllJobs,
};
