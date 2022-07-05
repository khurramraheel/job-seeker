let express = require("express");

let cors = require("cors");
let Jobs = require("./db/jobpost");
let myApp = express();

myApp.use(cors());

myApp.use(express.json());

let mongoose = require("mongoose");

let Users = require("./db/user");
const jobs = require("./db/jobpost");

mongoose.connect("mongodb://localhost:27017/jobPortal", (error, connection) => {
  console.log(error || connection);
});

myApp.post("/api/userRegister", async (req, resp) => {
  try {
    let newUser = new Users(req.body);
    await newUser.save();
  } catch (e) {
    resp.json({
      success: true,
    });
  }
});

myApp.post("/delete-route", async (req, resp) => {
  try {
    await Jobs.findOneAndDelete(req.body);
    resp.json({
      success: true,
    });
  } catch (error) {
    resp.json({
      success: false,
    });
  }
});

myApp.post("/api/employer/post-new-job", async (req, resp) => {
  try {
    let newJob = await new Jobs(req.body);
    console.log(req.body);
    newJob.save();
  } catch (e) {
    resp.json({
      success: true,
    });
  }
});

myApp.post("/api/login", async (req, resp) => {
  try {
    let userFound = await Users.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    resp.json({
      userFound,
    });
  } catch (e) {}
});

myApp.listen(8090, () => {
  console.log("server is running");
});
