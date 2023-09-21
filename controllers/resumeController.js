// work handle callback functions

const { catchAsyncError } = require("../middlwares/catchAsyncError");
const student = require("../models/studentModel");
const studentModel = require('../models/studentModel')
const ErorrHandler = require('../utils/ErrorHandling');
const { v4:uuidv4 } = require('uuid');

exports.resume = catchAsyncError(async (req,res,next)=>{
    const {avatar} = await studentModel.findById(req.id).exec();
    const student = await studentModel.findById(req.id).exec();
    res.json({ message: "this is  rresume route" , student,avatar});
})

// / --------------------- Education ---------------------------------  /

exports.addeducation = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    student.resume.education.push({...req.body, id: uuidv4()})
    await student.save();
    res.json({ message: "education added"});
})

exports.findeducation = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    const eduIndex = student.resume.education.findIndex(
        (i)=>i.id === req.params.eduid
    );
     // Check if the education entry is found
    if (eduIndex !== -1) {
        const foundEducation = student.resume.education[eduIndex];
        res.json({ message: "Education found!", education: foundEducation, eduIndex });
    } else {
        res.status(404).json({ message: "Education not found" });
    }
})

exports.editeducation = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    const eduIndex = student.resume.education.findIndex(
        (i)=>i.id === req.params.eduid
    );
    student.resume.education[eduIndex] =({
        ...student.resume.education[eduIndex] ,
        ...req.body,
    })
    await student.save();
    res.json({ message: "education updated!"});
})

exports.deleteducation = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    const Filterrededucation = student.resume.education.filter(
        (i)=>i.id !== req.params.eduid
    );
    student.resume.education = Filterrededucation;
    await student.save();
    res.json({ message: "education deleted!"});
})

// / --------------------- Job ---------------------------------  /

exports.addjob = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    const existingJob = student.resume.jobs.find(
        (existingJob) => existingJob.profile.toLowerCase() === req.body.profile.toLowerCase()
    );
    if (existingJob) {
        return res.status(400).json({ error: 'Intern already exists' });
    }
    
    student.resume.jobs.push({...req.body, id: uuidv4()})
    await student.save();
    res.json({ message: "job added"});
})

exports.findjob = catchAsyncError(async (req,res,next)=>{
   try{
      console.log("its a find job");
      console.log("its a find id",req.params.jobid);

        const student = await studentModel.findById(req.id).exec();
        const jobIndex = student.resume.jobs.findIndex(
            (i)=>i.id === req.params.jobid
        );
        // Check if the education entry is found
        if (jobIndex !== -1) {
            const foundJob = student.resume.jobs[jobIndex];
            res.json({ message: "Education found!", job: foundJob, jobIndex });
        } else {
            res.status(404).json({ message: "Education not found" });
        }
   }catch(error){
        console.log(error);
   }
})

exports.editjob = catchAsyncError(async (req, res, next) => {
    try {
      const student = await studentModel.findById(req.id).exec();
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      const jobIndex = student.resume.jobs.findIndex((job) => job.id === req.params.jobid);
      console.log(req.params.jobid,"its prm id");
      if (jobIndex === -1) {
        return res.status(404).json({ message: 'Job not found' });
      }
  
      student.resume.jobs[jobIndex] = {
        ...student.resume.jobs[jobIndex],
        ...req.body,
      };
  
      await student.save();
      res.json({ message: 'Job updated!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
exports.deletjob = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    const Filterrededucation = student.resume.jobs.filter(
        (i)=>i.id !== req.params.jobid
    );
    student.resume.jobs = Filterrededucation;
    await student.save();
    res.json({ message: "education deleted!"});
})

// / --------------------- Job ---------------------------------  /

// / --------------------- Internships ---------------------------------  /

exports.addintern = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    const existingIntern = student.resume.internship.find(
        (existingIntern) => existingIntern.profile.toLowerCase() === req.body.profile.toLowerCase()
    );
    if (existingIntern) {
        return res.status(400).json({ error: 'Intern already exists' });
    }
    
    student.resume.internship.push({...req.body, id: uuidv4()})
    await student.save();
    res.json({ message: "Intern added"});
})

exports.findintern = catchAsyncError(async (req,res,next)=>{
    try{
         const student = await studentModel.findById(req.id).exec();
         const internIndex = student.resume.internship.findIndex(
             (i)=>i.id === req.params.intid
         );
         // Check if the education entry is found
         if (internIndex !== -1) {
             const foundIntern = student.resume.internship[internIndex];
             res.json({ message: "Intern found!", job: foundIntern, internIndex });
         } else {
             res.status(404).json({ message: "Intern not found" });
         }
    }catch(error){
         console.log(error);
    }
 })

exports.editinternships = catchAsyncError(async (req,res,next)=>{
    try{
        const student = await studentModel.findById(req.id).exec();
        console.log(student,"int studnt");
        const internIndex = student.resume.internship.findIndex(
            (i)=>i.id === req.params.intid
        );
        console.log(internIndex,"int indx");
        // internship
        student.resume.internship[internIndex] =({
            ...student.resume.internship[internIndex] ,
            ...req.body,
        })
        await student.save();
        console.log(student.resume.internship[internIndex],"itsts upst int");
        res.json({ message: "intern updated!"});
    }catch(error){
         console.log(error,"ifts eroror");
    }
})

exports.deletinternship = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    console.log(student,"dstudent");
    const Filterredinternship = student.resume.internship.filter(
        (i)=>i.id !== req.params.intid
    );
    console.log(Filterredinternship,"filters");
    student.resume.internship = Filterredinternship;
    await student.save();
    console.log(student.resume.internship ,"itsgsg");
    res.json({ message: "internship deleted!"});
})

// / --------------------- Responsibility ---------------------------------  /

exports.addresponsibility = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    student.resume.responsibilities.push({...req.body, id: uuidv4()})
    await student.save();
    res.json({ message: "responsibilities added"});
})

exports.findres = catchAsyncError(async (req,res,next)=>{
    try{
         const student = await studentModel.findById(req.id).exec();
         const resIndex = student.resume.responsibilities.findIndex(
             (i)=>i.id === req.params.resid
         );
         // Check if the education entry is found
         if (resIndex !== -1) {
             const foundRes = student.resume.responsibilities[resIndex];
             res.json({ message: "Resp found!", resp: foundRes, resIndex });
         } else {
             res.status(404).json({ message: "Resp not found" });
         }
    }catch(error){
         console.log(error);
    }
})

exports.editresp = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    const respIndex = student.resume.responsibilities.findIndex(
        (i)=>i.id === req.params.resid
    );
    student.resume.responsibilities[respIndex] =({
        ...student.resume.responsibilities[respIndex] ,
        ...req.body,
    })
    await student.save();
    res.json({ message: "Responsibility updated!"});
})

exports.deleteresp = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    const Filterredresp = student.resume.responsibilities.filter(
        (i)=>i.id !== req.params.resid
    );
    student.resume.responsibilities = Filterredresp;
    await student.save();
    res.json({ message: "education deleted!"});
})

// / --------------------- Training ---------------------------------  /

exports.addtrain = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    const existingTrain = student.resume.train.find(
        (existingTrain) => existingTrain.training.toLowerCase() === req.body.training.toLowerCase()
    );
    if (existingTrain) {
        return res.status(400).json({ error: 'Skill already exists' });
    }
    student.resume.train.push({...req.body, id: uuidv4()})
    await student.save();
    res.json({ message: "training  added"});

})


exports.findtrain = catchAsyncError(async (req,res,next)=>{
    try{
         const student = await studentModel.findById(req.id).exec();
         const trainIndex = student.resume.train.findIndex(
             (i)=>i.id === req.params.trainid
         );
         // Check if the education entry is found
         if (trainIndex !== -1) {
             const foundTrain = student.resume.train[trainIndex];
             res.json({ message: "trainp found!", trainp: foundTrain, trainIndex });
         } else {
             res.status(404).json({ message: "trainp not found" });
         }
    }catch(error){
         console.log(error);
    }
})

exports.edittrain = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    const trainIndex = student.resume.train.findIndex(
        (i)=>i.id === req.params.trainid
    );
    student.resume.train[trainIndex] =({
        ...student.resume.train[trainIndex] ,
        ...req.body,
    })
    await student.save();
    res.json({ message: "train updated!"});
})

exports.deletedtrain = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    const Filterredtrain = student.resume.train.filter(
        (i)=>i.id !== req.params.trainid
    );
    student.resume.train = Filterredtrain;
    await student.save();
    res.json({ message: "Training deleted!"});
})

// --------------------- Portfolio ---------------------------------  /

exports.ylinks = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    student.resume.portfolio.push({...req.body, id: uuidv4()})
    await student.save();
    res.json({ message: "Links added"});
})

exports.findlink = catchAsyncError(async (req,res,next)=>{
    try{
         const student = await studentModel.findById(req.id).exec();
         const linkIndex = student.resume.portfolio.findIndex(
             (i)=>i.id === req.params.linkid
         );
         // Check if the education entry is found
         if (linkIndex !== -1) {
             const foundlink = student.resume.portfolio[linkIndex];
             res.json({ message: "Link found!", link: foundlink, linkIndex });
         } else {
             res.status(404).json({ message: "Link not found" });
         }
    }catch(error){
         console.log(error);
    }
})


exports.editlink = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    const linkIndex = student.resume.portfolio.findIndex(
        (i)=>i.id === req.params.linkid
    );
    student.resume.portfolio[linkIndex] =({
        ...student.resume.portfolio[linkIndex] ,
        ...req.body,
    })
    await student.save();
    res.json({ message: "link updated!"});
})

exports.deletlink = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    const Filterredlink = student.resume.portfolio.filter(
        (i)=>i.id !== req.params.linkid
    );
    student.resume.portfolio = Filterredlink;
    await student.save();
    res.json({ message: "link deleted!"});
})

// / --------------------- Accomp ---------------------------------  /

exports.addachive = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    student.resume.accomplishments.push({...req.body, id: uuidv4()})
    await student.save();
    res.json({ message: "accomplishments added"});
})

exports.findachive = catchAsyncError(async (req,res,next)=>{
    try{
         const student = await studentModel.findById(req.id).exec();
         const achiveIndex = student.resume.accomplishments.findIndex(
             (i)=>i.id === req.params.aid
         );
         // Check if the education entry is found
         if (achiveIndex !== -1) {
             const foundachive = student.resume.accomplishments[achiveIndex];
             res.json({ message: "achive found!", achive: foundachive, achiveIndex });
         } else {
             res.status(404).json({ message: "achive not found" });
         }
    }catch(error){
         console.log(error);
    }
})


exports.editachive = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    const achiveIndex = student.resume.accomplishments.findIndex(
        (i)=>i.id === req.params.aid
    );
    student.resume.accomplishments[achiveIndex] =({
        ...student.resume.accomplishments[achiveIndex] ,
        ...req.body,
    })
    await student.save();
    res.json({ message: "achive updated!"});
})

exports.deleteachive = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    const Filterredachive = student.resume.accomplishments.filter(
        (i)=>i.id !== req.params.aid
    );
    student.resume.accomplishments = Filterredachive;
    await student.save();
    res.json({ message: "achive deleted!"});
})

// / --------------------- Skills ---------------------------------  /


exports.addskill = catchAsyncError(async (req,res,next)=>{
    
    const student = await studentModel.findById(req.id).exec();
    const existingSkill = student.resume.skills.find(
        (existingSkill) => existingSkill.skill.toLowerCase() === req.body.skill.toLowerCase()
    );
    if (existingSkill) {
        return res.status(400).json({ error: 'Skill already exists' });
    }

    student.resume.skills.push({...req.body, id: uuidv4()})
    await student.save();
    res.json({ message: "skill added"});

})

exports.findskill = catchAsyncError(async (req,res,next)=>{
    try{
         const student = await studentModel.findById(req.id).exec();
         const skillIndex = student.resume.skills.findIndex(
             (i)=>i.id === req.params.sid
         );
         // Check if the education entry is found
         if (skillIndex !== -1) {
             const foundskill = student.resume.skills[skillIndex];
             res.json({ message: "skill found!", skill: foundskill, skillIndex });
         } else {
             res.status(404).json({ message: "skill not found" });
         }
    }catch(error){
         console.log(error);
    }
})

exports.editskill = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    const skillIndex = student.resume.skills.findIndex(
        (i)=>i.id === req.params.sid
    );
    const skil_l = student.resume.skills[skillIndex] = ({
        ...student.resume.skills[skillIndex] ,
        ...req.body,
    })
    await student.save();
    res.json({ message: "achive updated!",skil_l});
})

exports.deletskill = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    const Filterrskill = student.resume.skills.filter(
        (i)=>i.id !== req.params.sid
    );
    student.resume.skills = Filterrskill;
    await student.save();
    res.json({ message: "skills deleted!"});
})

// / --------------------- Projects ---------------------------------  /

exports.addproject = catchAsyncError(async (req,res,next)=>{

    const student = await studentModel.findById(req.id).exec();
    const existingProject = student.resume.projects.find(
        (existingProject) => existingProject.title.toLowerCase() === req.body.title.toLowerCase()
    );
    if (existingProject) {
        return res.status(400).json({ error: 'Project already exists' });
    }

    student.resume.projects.push({...req.body, id: uuidv4()})
    await student.save();
    res.json({ message: "projects added"});
})


exports.findproject = catchAsyncError(async (req,res,next)=>{
    try{
         const student = await studentModel.findById(req.id).exec();
         const projectIndex = student.resume.projects.findIndex(
             (i)=>i.id === req.params.pid
         );
         // Check if the education entry is found
         if (projectIndex !== -1) {
             const foundproject = student.resume.projects[projectIndex];
             res.json({ message: "project found!", project: foundproject, projectIndex });
         } else {
             res.status(404).json({ message: "project not found" });
         }
    }catch(error){
         console.log(error);
    }
})

exports.updateproject = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    const projectIndex = student.resume.projects.findIndex(
        (i)=>i.id === req.params.pid
    );
    student.resume.projects[projectIndex] =({
        ...student.resume.projects[projectIndex] ,
        ...req.body,
    })
    await student.save();
    res.json({ message: "achive updated!"});
})


exports.deleteproject = catchAsyncError(async (req,res,next)=>{
    const student = await studentModel.findById(req.id).exec();
    const Filterrproject = student.resume.projects.filter(
        (i)=>i.id !== req.params.pid
    );
    student.resume.projects = Filterrproject;
    await student.save();
    res.json({ message: "skills deleted!"});
})


