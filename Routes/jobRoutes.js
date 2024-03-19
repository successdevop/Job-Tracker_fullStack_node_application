const express = require("express");
const {
  getAllJobsAppliedFor,
  createNewJob,
  deleteAllJobs,
  getASingleJob,
  updateAJob,
  deleteASingleJob,
  rejectedJobApplication,
} = require("../Controllers/jobController");
const jobRouter = express.Router();

jobRouter
  .route("/")
  .get(getAllJobsAppliedFor)
  .post(createNewJob)
  .delete(deleteAllJobs);

jobRouter.route("/rejected/:id").patch(rejectedJobApplication);

jobRouter
  .route("/:id")
  .get(getASingleJob)
  .patch(updateAJob)
  .delete(deleteASingleJob);

module.exports = jobRouter;
