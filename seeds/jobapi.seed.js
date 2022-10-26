require("dotenv/config");  // * Extern server required!

const jobApiArr = require("./jobapi.seed.json")

require("../db/index.js")

const Jobapi = require("../models/Jobapi.model.js");
const { default: mongoose } = require("mongoose");

Jobapi.insertMany(jobApiArr)
.then(() => {
    console.log("offers Added!");
})
.catch((err) => {
    console.log(err);
})

mongoose.connection.close(function () {
    console.log('Mongoose default connection closed');
  });