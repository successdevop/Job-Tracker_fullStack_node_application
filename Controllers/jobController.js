const getAllJobsAppliedFor = (req, res) => {
  res.send("all jobs");
};

const createNewJob = (req, res) => {
  res.send("create new job");
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
