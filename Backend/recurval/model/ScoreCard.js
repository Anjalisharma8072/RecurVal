const mongoose = require("mongoose")
const scorecardSchema = new mongoose.Schema({
  evaluations: [
    {
      question: String,
      answer: String,
      score: Number,
      areas_of_improvement: String,
    },
  ],
  final_decision: String,
});

module.exports = mongoose.model("ScoreCard", scorecardSchema);