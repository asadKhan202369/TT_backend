const { catchAsyncError } = require("../middlwares/catchAsyncError");
const studentModel = require("../models/studentModel");
const courseModel = require("../models/courseModel");
const enrollModel = require("../models/enrollModel");
const Razorpay = require("razorpay");
const shortid = require("shortid");
const path = require("path");

const razorpay = new Razorpay({
  key_id: "rzp_test_e0p4ROsVzyQ7xL",
  key_secret: "DwGCKSi05b7yDJc6VijYVM6Y",
});



exports.order = async (req, res) => {
  try {
    const course = await courseModel.findById(req.params.cid).exec();
    const student = await studentModel.findById(req.id).exec();
    console.log(course);
    console.log(student, "its student");

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    let newenroll = await enrollModel.create({
      courseid: course._id,
      applicant: student._id,
      enrollmentDate: new Date(),
    });

    const payment_capture = 1;
    const amount = course.price;
    const currency = "INR";

    const options = {
      amount: amount * 100,
      currency,
      receipt: shortid.generate(),
      payment_capture,
    };

    const response = await razorpay.orders.create(options);
    student.Ecourses.push(newenroll);
    course.enrolled.push(newenroll);
    await student.save();
    await course.save();

    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
      course,
      newenroll,
      student,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
