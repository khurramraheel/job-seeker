let mongoose = require("mongoose");

let jobPostSchema = mongoose.Schema({
  category: String,
  type: String,
  title: String,
  experience: String,
  qualification: String,
  description: String,
  salary: String,
  expiry_date: String,
});

let jobs = mongoose.model("PostNewjob", jobPostSchema);

module.exports = jobs;
