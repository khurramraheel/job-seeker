let express = require("express");

let cors = require("cors");
let Jobs = require("./db/jobpost");
let myApp = express();

myApp.use(cors());

myApp.use(express.json());

let mongoose = require("mongoose");

let Users = require("./db/user");
const jobs = require("./db/jobpost");
const Messages = require("./db/message");
const JobApplication = require("./db/job-application");

mongoose.connect("mongodb://localhost:27017/jobPortal", (error, connection) => {
  console.log(error || connection);
});

myApp.post("/api/userRegister", async (req, resp) => {
  try {
    req.body.id = Math.random(Math.random() * 100000);
    let newUser = new Users(req.body);
    await newUser.save();
    resp.json({
      resp:1
    });
  } catch (e) {
    resp.json({
      success: true,
    });
  }
});

myApp.delete("/api/employer/delete-job", async (req, resp) => {
  try {
    await Jobs.findOneAndDelete(req.query.id);
    resp.json({
      resp:1,
      success: true,
    });
  } catch (error) {
    resp.json({
      success: false,
    });
  }
});

myApp.get("/api/home", async (req, res) => {

  try{

  let posts = await Jobs.find(req.body);
  res. json({
    resp:1,
    hot_jobs:posts
  });

  }catch(e){
    res.json([])
  }

});



myApp.get("/api/job/:slug", async (req, res) => {

  try{
    let job = await Jobs.findOne({title:req.params.slug.replace(/-/," ")});
    res. json({
      resp:1,
      job:job
    })
  }catch(e){
    res.json({
      resp:1
    })
  }

});





myApp.get("/api/jobseeker", async (req, res) => {

try{

    let applications  = await JobApplication.find({userid:req.query.id});

  let jobApplications = await Promise.all(applications.map(async (application)=>{

    let job = await Jobs.findById(application.job_id);
    return job;

  }));

    res.json({
      resp:1,
      result:{jobs:jobApplications}
    })

}catch(e){
  res.json({
    resp:0
  });
}


});

myApp.post("/api/apply-for-job", async (req, res) => {

  try{

    let application = new JobApplication(req.body);
    await application.save();
    res.json({
      resp:1
    });

  }catch(e){


  }

});

myApp.post("/api/save-message", async (req, res) => {

  let message = new Messages(req.body);
  await message.save();
  res.json({
    resp:1
  })


});

myApp.post("/api/employer/post-new-job", async (req, res) => {
  try {
    
    let newJob = await new Jobs({...req.body.data});
    console.log(req.body);
    await newJob.save();
     res. json({resp:1});
  } catch (e) {
    res.json({resp:0});
  }
});



myApp.get("/api/employer/view-posted-jobs", async (req, res) => {
  
  try {

    let jobs = await Jobs.find({"employee._id":req.query.id});
    res.json({
      resp:1,
      jobs:jobs
    });

  }catch(e){

    res.json({
      resp:0
    })
  }

  });


  myApp.post("/api/employer/edit-profile", async (req, res) => {

    try{

      let user = await Users.findByIdAndUpdate(req.body._id, req.body);
      res.json({
        resp:1,
        user
      });
      
    }catch(e){
      res.json({
        resp:0
      })
    }

  });
  
  myApp.post("/api/jobseeker/edit-profile", async (req, res) => {

    try{

      let user = await Users.findByIdAndUpdate(req.body._id, req.body);
      res.json({
        resp:1,
        user
      });
      
    }catch(e){
      res.json({
        resp:0
      })
    }

  });




  myApp.get("/api/employer", async (req, res) => {


    try{

      let jobs =  await Jobs.find({"employer._id":req.query.id})

      let totalApplications = 0;

      let jobApplications = await Promise.all(jobs.map(async (job)=>{
         
        let applcations = await JobApplication.find({job_id:job._id});
        totalApplications += applcations.length;

      }));

      res.json({
        resp:1,
        result:{
          total_applicants:totalApplications,
          total_jobs_posted:jobs.length
        }
      })
      
    }catch(e){


    }

  });
  myApp.get("/api/employer/edit-profile", async (req, res) => {

    try{

      let user = await Users.findById(req.query.id);
      res.json({
        resp:1,
        user
      });
      
    }catch(e){
      res.json({
        resp:0
      })
    }

  });

  myApp.get("/api/jobseeker/edit-profile", async (req, res) => {

    try{

      let user = await Users.findById(req.query.id);
      res.json({
        resp:1,
        user
      });
      
    }catch(e){
      res.json({
        resp:0
      })
    }

  });

  myApp.post("/api/search", async (req, res) => {

    try{

      let   jobs;

      if(req.body.keyword){
        let reg = new RegExp(req.body.keyword,"i");

        jobs = await Jobs.find({title:reg})

        
        
      }else{

        if(!req.body.type){
          req.body.type = {list:[]}
        }

        if(!req.body.category){
          req.body.category = {list:[]}
        }

        if(!req.body.level){
          req.body.level = {list:[]}
        }


        let mArray = [];

        req.body.type.list.forEach((item)=>{
          mArray.push(item);
        });

        req.body.category.list.forEach(item=>{
          mArray.push(item)
        })

        req.body.level.list.forEach(item=>{
          mArray.push(item)
        })


        // [...req.body.category.list, ...req.body.type.list, , ...req.body.level.list]

        jobs = await Jobs.find({$or:mArray})
      }

      res.json({
        resp:1,
        jobs:{data:jobs,total:jobs.length}
      });


    }catch(e){
      res.json({
        resp:0
      })
    }
    
  });
  
myApp.post("/api/login", async (req, resp) => {
  try {
    let user = await Users.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if(user){

      resp.json({
        resp:1,
        user,
      });
    }else{
      resp.json({
        resp:0,        
      })
    }
  } catch (e) {}
});

myApp.listen(8090, () => {
  console.log("server is running");
});
