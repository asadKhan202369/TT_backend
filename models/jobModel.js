const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jobSchema = new mongoose.Schema({
 
    ownerid:{
            type : mongoose.Schema.Types.ObjectId , ref:'employee'
    },
    otype: {
        type: String,
        required:[true,"Type is Required"]
    },
    type: {
        type: String,
        required:[true,"Job Type is Required"],
    },
    title: {
        type: String,
        required:[true,"Job Title is Required"],
    },
    opening: {
        type: Number,
        required:[true,"number of opening is Required"],
    },
    applicationDeadline: {
        type: String, // This defines a date field
        required: true,
    },
    stipend:{
        type:Number,
        required:[true,"Stipend is Required"],
    },
    experience:{
        type:String,
    },
    description: {
        type: String,
        required:[true,"description is Required"],
    },
    requiredSkills: {
        type: [String], // This defines an array of strings
        required: true,
    },
    location:{
        type:String,
    },
    time:{
        type:String,
    },
    websiteurl:{
        type:String,
    },
    applicants:[
        {
            type : mongoose.Schema.Types.ObjectId , ref:'employee'
        }
     ],
     hired:[
        {
            type : mongoose.Schema.Types.ObjectId , ref:'employee'
        }
     ],
     interview:[{
        type : mongoose.Schema.Types.ObjectId , ref:'interview'
     }],
     
},{ timestamps: true });


const job = mongoose.model("job",jobSchema);
module.exports = job;