const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const interviewSchema = new mongoose.Schema({
 
    interviewer:{
            type : mongoose.Schema.Types.ObjectId , ref:'employee'
    },
    interviewe:{
        type : mongoose.Schema.Types.ObjectId , ref:'student'
    },
    // job:{
    //     type : mongoose.Schema.Types.ObjectId , ref:'job'
    // },
    job:{
        type : String
    },
    imode: {
        type: String,
        required:[true,"Interview Mode is Required"]
    },
    date: {
        type: String,
        required:[true,"Job Type is Required"],
    },
    time: {
        type: String,
        required:[true,"Job Title is Required"],
    },
    location: {
        type: String,
        required:[true,"number of opening is Required"],
    },
    
     
},{ timestamps: true });


const interview = mongoose.model("interview",interviewSchema);
module.exports = interview;