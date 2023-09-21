// / work handle callback functions
const { catchAsyncError } = require("../middlwares/catchAsyncError");
const employeeModel = require("../models/employeeModel");
const applyModel = require("../models/applyModel");
const studentModel = require("../models/studentModel");
const ErorrHandler = require("../utils/ErrorHandling");
const interviewModel = require("../models/interviewModel");
const { sendtoken } = require("../utils/SendToken");
const { sendmail1 } = require("../utils/nodemailer1");
const { sendmailintr } = require("../utils/nodemailerintr");
const { sendmail } = require("../utils/nodemailer");
const jobModel = require("../models/jobModel");
const reviewModel = require("../models/revieweModel");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const student = require("../models/studentModel");
const interview = require("../models/interviewModel");
const imagekit = require("../utils/imagekit").initImagekit();

exports.employeesignup = catchAsyncError(async (req, res, next) => {
  try {
    const employee = await new employeeModel(req.body);
    await employee.save();
    // const reset_link = `${req.protocol}://localhost:3000/student/forgotp/${employee._id}`
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    sendmail1(req, res, next, otp);
    employee.otp = otp;
    employee.resetPaswwordToken = "1";
    await employee.save();

    sendtoken(employee, 201, res);
    res.status(201).json(employee);
  } catch (error) {
    // Handle errors here
    next(error);
    console.log(error);
    ``;
    console.log("next error");
  }
});

exports.confirmemployee = catchAsyncError(async (req, res, next) => {
  const otp = req.body.otp;
  const id = req.id;

  const employee = await employeeModel.findById(id).exec();
  if (!employee) {
    return next(new ErrorHandler("User Not Found With This ID", 404));
  }

  const eotp = employee.otp;

  if (!otp) {
    return next(new ErrorHandler("OTP is required", 400));
  }

  console.log("Employee OTP:", employee.otp);
  console.log("Request OTP:", otp);

  if (eotp == otp.trim()) {
    console.log("Valid Employee");
    res.status(200).json({
      message: "valid otp",
    });
  } else {
    // Use a different variable name for the deletedEmployee
    const deletedEmployee = await employeeModel.findByIdAndDelete(id);
    if (deletedEmployee) {
      console.log("Invalid Employee deleted");
    } else {
      console.log("Failed to delete the invalid employee");
    }
  }
});

exports.employeesignin = catchAsyncError(async (req, res, next) => {
  const employee = await employeeModel
    .findOne({ email: req.body.email })
    .select("+password")
    .exec();

  if (!employee) {
    return next(new ErorrHandler("user Not Found With This Email", 404));
  }

  const isMatch = employee.comparepassword(req.body.password);
  if (!isMatch) return next(new ErorrHandler("Wrong Credentials", 500));

  // res.json(employee)
  sendtoken(employee, 201, res);
});

exports.employeesignout = catchAsyncError(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "succesfully sign out" });
});

exports.currentemployee = catchAsyncError(async (req, res, next) => {
  const employee = await employeeModel
    .findById(req.id)
    .populate("job")
    .populate({
      path: "application",
      populate: [
        {
          path: "jobid",
        },
        {
          path: "applicant",
        },
      ],
    });
  const reviews = await reviewModel.find().populate("ownerid").skip(0).limit(5);
  res.json({ employee, reviews });
});

exports.employeeavatar = catchAsyncError(async (req, res, next) => {
  try {
    const employee = await employeeModel.findById(req.id).exec();
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "employee not found",
      });
    }

    const file = req.files.file;
    const modifiedFileName = `resumebuilder-${Date.now()}${path.extname(
      file.name
    )}`;

    try {
      if (employee.organisationlogo.fileId !== "") {
        await imagekit.deleteFile(employee.organisationlogo.fileId);
      }
    } catch (error) {
      // Handle the error if employee.avatar.fileId is undefined or other issues
      console.error("Error deleting previous organisationlogo:", error);
    }

    const { fileId, url } = await imagekit.upload({
      file: file.data,
      fileName: modifiedFileName,
    });

    employee.organisationlogo = { fileId, url };
    await employee.save();
    res.status(200).json({
      success: true,
      message: "Profile Uploaded",
      employee,
    });
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

exports.forgotpassword = catchAsyncError(async (req, res, next) => {
  try {
    const employee = await employeeModel
      .findOne({ email: req.body.email })
      .exec();

    if (!student) {
      return next(new ErorrHandler("user Not Found With This Email", 404));
    }

    const reset_link = `${req.protocol}://localhost:3000/employee/forgotp/${employee._id}`;

    sendmail(req, res, next, reset_link);
    employee.resetPaswwordToken = "1";
    await employee.save();

    res.json({ employee, reset_link });
    console.log("Emailsent");
  } catch (error) {
    console.log(error);
    console.log("email did not send");
  }
});

exports.forgotlink = catchAsyncError(async (req, res, next) => {
  try {
    const password = req.body.password;
    const id = req.params.id;

    const employee = await employeeModel.findById(id).exec();
    if (!employee) {
      return next(new ErorrHandler("user Not Found With This Email", 404));
    }
    if (!password) {
      return next(new ErorrHandler("Password is required", 400));
    }
    if (employee.resetPaswwordToken === 1) {
      employee.password = password;
      employee.resetPaswwordToken = 0;
      try {
        await employee.save();
        console.log("employee saved successfully");
      } catch (error) {
        console.error(
          "Error while saving employee:",
          error,
          "thisi the dina; error"
        );
        return next(error); // Assuming catchAsyncError handles the error properly
      }
    } else {
      return next(
        new ErorrHandler("Invalid Reset Password Link,Please Try again", 500)
      );
    }

    res.status(200).json({
      message: "Password has been succesfully Changed",
    });
  } catch (error) {
    console.log(error);
  }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const employee = await employeeModel.findById(req.id).exec();
  employee.password = req.body.password;
  employee.resetPaswwordToken = "0";
  await employee.save();
  sendtoken(employee, 201, res);
});

exports.employeeupdate = catchAsyncError(async (req, res, next) => {
  const employee = await employeeModel
    .findByIdAndUpdate(req.id, req.body)
    .exec();
  await employee.save();
  res.status(200).json({
    success: true,
    message: "employee Updated successfully",
    employee,
  });
});

exports.createopportunity = catchAsyncError(async (req, res, next) => {
  try {
    const employee = await employeeModel.findById(req.id).exec();

    if (!employee) {
      console.log("employee not found");
    }

    let newopportunity = await jobModel.create({
      ownerid: employee._id,
      otype: req.body.otype,
      title: req.body.title,
      type: req.body.type,
      opening: req.body.opening,
      applicationDeadline: req.body.deadline,
      stipend: req.body.salary,
      experience: req.body.experience,
      location: req.body.location,
      description: req.body.description,
      requiredSkills: req.body.skills,
      applicationDeadline: req.body.deadline,
    });

    if (req.body.otype === "internship") {
      employee.internships.push(newopportunity);
    } else if (req.body.otype === "job") {
      employee.job.push(newopportunity);
    }
    await employee.save();
    res.status(201).json({ employee, newopportunity });
  } catch (error) {
    console.log(error);
    console.log("its error");
  }
});

exports.findopportunity = catchAsyncError(async (req, res, next) => {
  try {
    const employee = await employeeModel.findById(req.id).exec();
    const student = await studentModel.findById(req.id).populate("applied");

    const job = await jobModel.findById(req.params.oid).populate("ownerid");

    if (!job) {
      // Handle the case where the job with the given ID is not found
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(201).json({ employee, job, student });
  } catch (error) {
    console.log(error);
    console.log("its error");
  }
});

exports.deleteopportunity = catchAsyncError(async (req, res, next) => {
  try {
    const employee = await employeeModel.findById(req.id).exec();

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const job = await jobModel.findById(req.params.oid).exec();

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const jobIndex = employee.job.indexOf(req.params.oid);

    if (jobIndex !== -1) {
      employee.job.splice(jobIndex, 1);
    }

    await employee.save();
    await jobModel.findByIdAndDelete(req.params.oid);

    res.status(201).json({ message: "Job deleted" });
  } catch (error) {
    console.log(error);
    console.log("its error");
  }
});

exports.editopportunity = catchAsyncError(async (req, res, next) => {
  try {
    const employee = await employeeModel.findById(req.id).exec();

    const updatedjob = await jobModel.findByIdAndUpdate(req.params.oid, {
      ownerid: employee._id,
      otype: req.body.otype,
      title: req.body.title,
      type: req.body.type,
      opening: req.body.opening,
      applicationDeadline: req.body.deadline,
      stipend: req.body.stipend,
      experience: req.body.experience,
      location: req.body.location,
      description: req.body.description,
      requiredSkills: req.body.skills,
      time: req.body.time,
    });

    if (!updatedjob) {
      // Handle the case where the job with the given ID is not found
      return res.status(404).json({ error: "Job not found" });
    }

    await updatedjob.save();
    res.status(201).json({ employee, updatedjob });
  } catch (error) {
    console.log(error);
    console.log("its error");
  }
});

exports.applyjob = catchAsyncError(async (req, res, next) => {
  try {
    const student = await studentModel.findById(req.id).exec();
    const job = await jobModel.findById(req.params.aid).exec();
    const employee = await employeeModel.findById(job.ownerid).exec();

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Create a new application
    let newapplication = await applyModel.create({
      ownerid: job.ownerid,
      jobid: job._id,
      applicant: student._id,
      availability: req.body.avail,
      plink: req.body.plink,
    });

    student.applied.push(newapplication);
    employee.application.push(newapplication);
    job.applicants.push(newapplication);

    // Save the changes to both student and employee
    await employee.save();
    await student.save();
    await job.save();

    res.status(201).json({ employee, student, newapplication });
  } catch (error) {
    console.log(error);
    console.log("It's an error");
  }
});

exports.sheduleinterview = catchAsyncError(async (req, res, next) => {
  try {
    const student = await studentModel.findById(req.params.sid).exec();
    const job = await jobModel.findById(req.params.jobid).exec();
    const employee = await employeeModel.findById(req.id).exec();

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    if (!job) {
      return res.status(404).json({ error: "job not found" });
    }

    let newinterview = await interviewModel.create({
      interviewer: req.id,
      interviewe: student._id,
      job: job._id,
      imode: req.body.imd,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
    });

    student.interview.push(newinterview);
    employee.interview.push(newinterview);
    job.interview.push(newinterview);

    await employee.save();
    await student.save();
    await job.save();

    sendmailintr(student.email, job.title, newinterview);
    res.status(201).json({ employee, student, newinterview });
  } catch (error) {
    console.log(error);
    console.log("It's an error");
  }
});

exports.createemployeereview = catchAsyncError(async (req, res, next) => {
  try {
    const owner = await employeeModel.findById(req.id).exec();

    var review = await reviewModel.create({
      ownerid: owner._id,
      htext: req.body.htext,
      messsage: req.body.messsage,
    });

    owner.reviews.push(review);
    await owner.save();
    res.status(200).json({
      success: true,
      message: "review Added",
      review,
    });
  } catch (error) {
    console.log(error);
  }
});
