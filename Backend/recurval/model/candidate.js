const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  resumeLink: {
    type: String,
    required: true,
  },
  appliedJob: { type: mongoose.Schema.Types.ObjectId, ref: "jobdetails" },
});

module.exports = mongoose.model('CandidateDetails', candidateSchema);