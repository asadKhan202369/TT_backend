const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const courseSchema = new mongoose.Schema({
 
    ownerid:{
            type : mongoose.Schema.Types.ObjectId , ref:'student'
    },
    cname: {
        type: String,
        required:[true,"Type is Required"]
    },
    nlacture:{
        type:String,
        required:[true,"Type is Required"]
    },

    price: {
        type: String,
        required:[true,"course price is Required"],
    },
    details: {
        type: String,
        required:[true,"number of opening is Required"],
    },
    sdes: {
        type: String, // This defines a date field
        required: true,
    },
   
    cprojects:{
        type:Number,
    },
    // BookingId:[{
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref:"student"
    // }],
    description: {
        type: String,
        required:[true,"description is Required"],
    },
    teachers:[{
        // type: mongoose.Schema.Types.ObjectId, 
        type:String
        // ref:"teacher"
    }],
    ldate: {
        type: String,
        required:[true,"last date is Required"],
    },
    cpic:{
        type: Object,
        // type:mongoose.Schema.Types.Object,
        default:{
            fileId:"",
            url:"https://images.unsplash.com/photo-1621272036047-bb0f76bbc1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dW5zcGFsc2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60"
        }
    },
    enrolled:[{
        type : mongoose.Schema.Types.ObjectId , ref:'enroll'
     }],
     
},{ timestamps: true });


const course = mongoose.model("course",courseSchema);
module.exports = course;