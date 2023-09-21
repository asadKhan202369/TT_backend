// work handle callback functions
const { catchAsyncError } = require("../middlwares/catchAsyncError");
const studentModel = require("../models/studentModel");
const jobModel = require("../models/jobModel");
const courseModel = require("../models/courseModel");
const employeeModel = require("../models/employeeModel");
const enrollModel = require("../models/enrollModel");
const reviewModel = require("../models/reviewModel");
const ErorrHandler = require("../utils/ErrorHandling");
const { sendtoken } = require("../utils/SendToken");
const { sendmail } = require("../utils/nodemailer");
const path = require("path");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const { log } = require("console");
const imagekit = require("../utils/imagekit").initImagekit();

// exports.homepage = catchAsyncError(async (req,res,next)=>{
//     res.json({ message: "this is test route" })
// })

exports.homepage = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  console.log(token, "its token");

  if (!token) {
    const student = null;
    res.json({ message: "its /", student });
  } else {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.id = id;
    const student = await studentModel.findById(req.id);
    if (!student) {
      const student = null;
      res.json({ message: "its /" });
    } else {
      res.json({ message: "its /", student });
    }
  }
});

exports.currentUser = catchAsyncError(async (req, res, next) => {
  const student = await studentModel
    .findById(req.id)
    .populate("Mycourses")
    .populate({
      path: "Ecourses",
      populate: {
        path: "courseid",
      },
    })
    .populate({
      path: "applied",
      populate: [
        {
          path: "jobid",
          populate: {
            path: "ownerid",
          },
        },
        {
          path: "applicant",
        },
      ],
    });
  const jobs = await jobModel.find().populate("ownerid").skip(0).limit(5);
  const courses = await courseModel.find().populate("ownerid").skip(0).limit(5);
  const reviews = await reviewModel.find().populate("ownerid").skip(0).limit(5);

  res.json({ student, jobs, courses, reviews });
});

exports.alljobs = catchAsyncError(async (req, res, next) => {
  const student = await studentModel.findById(req.id).exec();
  const jobs = await jobModel.find().populate("ownerid").skip(0).limit(5);
  res.json({ student, jobs });
});

exports.allcourses = catchAsyncError(async (req, res, next) => {
  const student = await studentModel.findById(req.id).exec();
  const courses = await courseModel.find().populate("ownerid").skip(0).limit(5);
  res.json({ student, courses });
});

exports.studentsignup = catchAsyncError(async (req, res, next) => {
  const student = await new studentModel(req.body);
  await student.save();
  sendtoken(student, 201, res);
  res.status(201).json(student);
});

exports.studentsignin = catchAsyncError(async (req, res, next) => {
  const student = await studentModel
    .findOne({ email: req.body.email })
    .select("+password")
    .exec();

  if (!student) {
    return next(new ErorrHandler("user Not Found With This Email", 404));
  }

  const isMatch = student.comparepassword(req.body.password);
  if (!isMatch) return next(new ErorrHandler("Wrong Credentials", 500));

  // res.json(student)
  sendtoken(student, 201, res);
});

exports.studentsignout = catchAsyncError(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "succesfully sign out" });
});

exports.studentupdate = catchAsyncError(async (req, res, next) => {
  const student = await studentModel.findByIdAndUpdate(req.id, req.body).exec();
  await student.save();
  res.status(200).json({
    success: true,
    message: "Student Updated successfully",
    student,
  });
});

exports.forgotpassword = catchAsyncError(async (req, res, next) => {
  try {
    const student = await studentModel
      .findOne({ email: req.body.email })
      .exec();

    if (!student) {
      return next(new ErorrHandler("user Not Found With This Email", 404));
    }

    const reset_link = `${req.protocol}://localhost:3000/student/forgotp/${student._id}`;

    sendmail(req, res, next, reset_link);
    student.resetPaswwordToken = "1";
    await student.save();

    res.json({ student, reset_link });
    console.log("Emailsent");
  } catch (error) {
    console.log(error);
    console.log("email did not send");
  }
});

exports.forgotlink = catchAsyncError(async (req, res, next) => {
  const password = req.body.password;
  const id = req.params.id;

  const student = await studentModel.findById(id).exec();
  if (!student) {
    return next(new ErorrHandler("user Not Found With This Email", 404));
  }
  if (!password) {
    return next(new ErorrHandler("Password is required", 400));
  }
  if (student.resetPaswwordToken === 1) {
    student.password = password;
    student.resetPaswwordToken = 0;
    try {
      await student.save();
      console.log("Student saved successfully");
    } catch (error) {
      console.error(
        "Error while saving student:",
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
  console.log(student, "its sthhg");

  res.status(200).json({
    message: "Password has been succesfully Changed",
  });
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const student = await studentModel.findById(req.id).exec();
  student.password = req.body.password;
  student.resetPaswwordToken = "0";
  await student.save();
  sendtoken(student, 201, res);
});

exports.studentupdate = catchAsyncError(async (req, res, next) => {
  const student = await studentModel.findByIdAndUpdate(req.id, req.body).exec();
  console.log(student, "its a students");
  res.status(200).json({
    success: true,
    message: "Student Updated successfully",
    student,
  });
});

exports.studentavatar = catchAsyncError(async (req, res, next) => {
  try {
    const student = await studentModel.findById(req.id).exec();
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const file = req.files.file;
    const modifiedFileName = `resumebuilder-${Date.now()}${path.extname(
      file.name
    )}`;

    try {
      if (student.avatar.fileId !== "") {
        await imagekit.deleteFile(student.avatar.fileId);
      }
    } catch (error) {
      // Handle the error if student.avatar.fileId is undefined or other issues
      console.error("Error deleting previous avatar:", error);
    }

    const { fileId, url } = await imagekit.upload({
      file: file.data,
      fileName: modifiedFileName,
    });

    student.avatar = { fileId, url };
    await student.save();
    res.status(200).json({
      success: true,
      message: "Profile Uploaded",
      student,
    });
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

exports.studentresume = catchAsyncError(async (req, res, next) => {
  try {
    console.log("enmterrre");
    const student = await studentModel
      .findById(req.params.sid)
      .populate("interview");
    res.json({ student });
  } catch (error) {
    console.log(error);
  }
});

exports.createcourse = catchAsyncError(async (req, res, next) => {
  try {
    const owner = await studentModel.findById(req.id).exec();
    const file = req.files.file;
    const modifiedFileName = `resumebuilder-${Date.now()}${path.extname(
      file.name
    )}`;

    const { fileId, url } = await imagekit.upload({
      file: file.data,
      fileName: modifiedFileName,
    });

    var course = await courseModel.create({
      ownerid: owner._id,
      cname: req.body.cname,
      price: req.body.price,
      details: req.body.details,
      sdes: req.body.sdes,
      cprojects: req.body.cprojects,
      teachers: req.body.teachers,
      description: req.body.description,
      teachers: req.body.teachers.split(",").map((teacher) => teacher.trim()),
      ldate: req.body.ldate,
      nlacture: req.body.nlacture,
      cpic: { fileId, url },
    });

    owner.Mycourses.push(course);
    await owner.save();
    res.status(200).json({
      success: true,
      message: "Courses Uploaded",
    });
  } catch (error) {
    console.log(error);
  }
});

exports.courseupdate = catchAsyncError(async (req, res, next) => {
  const course = await courseModel
    .findByIdAndUpdate(req.params.id, req.body)
    .exec();
  await course.save();
  res.status(200).json({
    success: true,
    message: "course Updated successfully",
    course,
  });
});

exports.deletecourse = catchAsyncError(async (req, res, next) => {
  try {
    const owner = await studentModel.findById(req.id).exec();

    if (!owner) {
      return res.status(404).json({ error: "owner not found" });
    }

    const course = await courseModel.findById(req.params.id).exec();

    if (!course) {
      return res.status(404).json({ error: "course not found" });
    }

    const courseIndex = owner.Mycourses.indexOf(req.params.id);

    if (courseIndex !== -1) {
      owner.Mycourses.splice(courseIndex, 1);
    }

    await owner.save();
    await courseModel.findByIdAndDelete(req.params.id);

    res.status(201).json({ message: "courses deleted" });
  } catch (error) {
    console.log(error);
    console.log("its error");
  }
});

exports.findcourse = catchAsyncError(async (req, res, next) => {
  try {
    const student = await studentModel.findById(req.id).populate("applied");
    const course = await courseModel
      .findById(req.params.cid)
      .populate("ownerid");

    if (!course) {
      // Handle the case where the course with the given ID is not found
      return res.status(404).json({ error: "course not found" });
    }

    res.status(201).json({ student, course });
  } catch (error) {
    console.log(error);
    console.log("its error");
  }
});

exports.enrollcourse = catchAsyncError(async (req, res, next) => {
  try {
    const student = await studentModel.findById(req.id).exec();
    const course = await courseModel.findById(req.params.cid).exec();

    if (!course) {
      return res.status(404).json({ error: "course not found" });
    }

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Create a new application
    let newenroll = await enrollModel.create({
      courseid: course._id,
      applicant: student._id,
      enrollmentDate: new Date(),
    });

    student.Mycourses.push(newenroll);
    course.enrolled.push(newenroll);
    // Save the changes to both student and employee
    await student.save();
    await course.save();

    res.status(201).json({ course, student, newapplication });
  } catch (error) {
    console.log(error);
    console.log("It's an error");
  }
});

exports.createstudentreview = catchAsyncError(async (req, res, next) => {
  try {
    const owner = await studentModel.findById(req.id).exec();

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
