const { StatusCodes } = require("http-status-codes");
const { validateCreateJob } = require("../Validations/jobValidation");
const Job = require("../Models/JobModel");

// == GET ALL JOBS == //
const getAllJobsAppliedFor = async (req, res) => {
  try {
    const userJobs = await Job.find({ createdBy: req.authorizedUser.id });
    if (!userJobs) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        ok: false,
        msg: `Unauthorized user access`,
      });
    }

    if (userJobs.length < 1) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        ok: true,
        msg: `No jobs applied for yet`,
      });
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      ok: true,
      msg: { userJobs, counts: userJobs.length },
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Unable to see all jobs applied for" });
  }
};

// == CREATE A NEW JOB == //
const createNewJob = async (req, res) => {
  try {
    if (!req.authorizedUser.id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        ok: false,
        msg: `Unauthorized user access`,
      });
    }

    req.body.createdBy = req.authorizedUser.id;

    const { error, value } = validateCreateJob(req.body);
    if (error) {
      console.log(error);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: error.details[0].message,
      });
    }

    const checkJob = await Job.findOne({
      company: value.company,
      companyInfo: value.companyInfo,
      jobTitle: value.jobTitle,
    });

    if (checkJob) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        ok: true,
        msg: `You have previously applied for this job on : ${checkJob.createdAt}`,
      });
    }

    const jobCreated = await Job.create({ ...value });
    res.status(StatusCodes.CREATED).json({
      status: "success",
      ok: true,
      msg: jobCreated,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Unable to create job, please try again later",
    });
  }
};

// == GET A SINGLE JOB == //
const getASingleJob = async (req, res) => {
  try {
    const {
      authorizedUser: { id: userId },
      params: { id: jobId },
    } = req;

    if (!jobId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `Provide a valid job id`,
      });
    }

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `You are not authorized to carry out this operation`,
      });
    }

    const job = await Job.findOne({ _id: jobId, createdBy: userId });
    if (!job) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `Job not found`,
      });
    }

    res.status(StatusCodes.OK).json({ status: "success", ok: true, job });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Unable to get job",
    });
  }
};

// == UPDATE A SINGLE JOB TO INTERVIEW STATUS == //
const updateAJob = async (req, res) => {
  try {
    const {
      authorizedUser: { id: userId },
      params: { id: jobId },
    } = req;

    if (!jobId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `Provide a valid book id`,
      });
    }

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `You are not authorized to carry out this operation`,
      });
    }

    const updatedJob = await Job.findOne({ _id: jobId, createdBy: userId });
    if (!updatedJob) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `Job not found`,
      });
    }

    if (updatedJob.jobStatus === "Pending") {
      updatedJob.jobStatus = "Interview";
    } else if (updatedJob.jobStatus === "Interview") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `You are already on Interview stage`,
      });
    } else if (updatedJob.jobStatus === "Rejected") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `You have been rejected for this job already`,
      });
    }

    await updatedJob.save();
    res
      .status(StatusCodes.OK)
      .json({ status: "success", ok: true, msg: "job updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Unable to update job",
    });
  }
};

// == UPDATE A SINGLE JOB TO DELETED STATUS == //
const rejectedJobApplication = async (req, res) => {
  try {
    const {
      authorizedUser: { id: userId },
      params: { id: jobId },
    } = req;

    if (!jobId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `Provide a valid book id`,
      });
    }

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `You are not authorized to carry out this operation`,
      });
    }

    const updatedJob = await Job.findOne({ _id: jobId, createdBy: userId });
    if (!updatedJob) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `Job not found`,
      });
    }

    if (updatedJob.jobStatus === "Rejected") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `You have been rejected for this job already`,
      });
    }

    updatedJob.jobStatus = "Rejected";
    await updatedJob.save();

    res.status(StatusCodes.OK).json({
      status: "success",
      ok: true,
      msg: "You have been rejected for this job position",
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Unable to reject job",
    });
  }
};

// == DELETE A SINGLE JOB == //
const deleteASingleJob = async (req, res) => {
  try {
    const {
      authorizedUser: { id: userId },
      params: { id: jobId },
    } = req;

    if (!jobId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `Provide a valid book id`,
      });
    }

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `You are not authorized to carry out this operation`,
      });
    }

    const deletedJob = await Job.findOne({ _id: jobId, createdBy: userId });
    if (!deletedJob) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        ok: false,
        msg: `Job not found`,
      });
    }

    await Job.findOneAndDelete({ _id: jobId, createdBy: userId });

    res.status(StatusCodes.OK).json({
      status: "success",
      ok: true,
      msg: "Job deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Unable to delete job",
    });
  }
};

// == DELETE ALL JOBS == //
const deleteAllJobs = async (req, res) => {
  try {
    const deleteJobs = await Job.deleteMany({
      createdBy: req.authorizedUser.id,
    });

    if (!deleteJobs) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        ok: false,
        msg: `Unauthorized user access`,
      });
    }

    if (deleteJobs.length < 1) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        ok: true,
        msg: `No jobs to delete`,
      });
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      ok: true,
      msg: "All jobs deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Unable to delete all jobs",
    });
  }
};

module.exports = {
  getAllJobsAppliedFor,
  createNewJob,
  getASingleJob,
  updateAJob,
  rejectedJobApplication,
  deleteASingleJob,
  deleteAllJobs,
};
