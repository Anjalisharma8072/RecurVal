const mongoose = require("mongoose")

const jobDetailsSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  requirements: {
    type: [String],
    required: true,
  },
  techStack: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model("JobDetails", jobDetailsSchema);