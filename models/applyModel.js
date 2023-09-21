const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const applySchema = new mongoose.Schema({
 
    ownerid:{
            type : mongoose.Schema.Types.ObjectId , ref:'employee'
    },
    jobid:{
        type : mongoose.Schema.Types.ObjectId , ref:'job'
    },
    applicant:{
        type : mongoose.Schema.Types.ObjectId , ref:'student'
    },
    availability:{
        type:String,
    },
    plink:{
        type:String
    }
     
},{ timestamps: true });


const apply = mongoose.model("apply",applySchema);
module.exports = apply;