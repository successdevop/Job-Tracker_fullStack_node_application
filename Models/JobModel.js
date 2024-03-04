const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      trim: true,
      required: true,
    },
    companyInfo: {
      type: String,
      trim: true,
      required: true,
    },
    jobTitle: {
      type: String,
      trim: true,
      required: true,
    },
    jobStatus: {
      type: String,
      trim: true,
      enum: ["pending", "declined", "interview"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
