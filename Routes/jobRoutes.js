const express = require("express");
const {
  getAllJobsAppliedFor,
  createNewJob,
  deleteAllJobs,
  getASingleJob,
  updateAJob,
  deleteASingleJob,
} = require("../Controllers/jobController");
const jobRouter = express.Router();

jobRouter
  .route("/")
  .get(getAllJobsAppliedFor)
  .post(createNewJob)
  .delete(deleteAllJobs);

jobRouter
  .route("/:id")
  .get(getASingleJob)
  .put(updateAJob)
  .delete(deleteASingleJob);

module.exports = jobRouter;
