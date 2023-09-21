const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const enrollSchema = new mongoose.Schema({
 
    courseid:{
        type : mongoose.Schema.Types.ObjectId , ref:'course'
    },
    applicant:{
        type : mongoose.Schema.Types.ObjectId , ref:'student'
    },
    enrollmentDate: Date,
   
     
},{ timestamps: true });


const enroll = mongoose.model("enroll",enrollSchema);
module.exports = enroll;