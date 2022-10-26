const mongoose = require("mongoose");

const jobApiSchema = new mongoose.Schema(
  {
    title: String,
    url: String,
    source: String
  },
);

const Jobapi = mongoose.model("Jobapi", jobApiSchema);

module.exports = Jobapi;
