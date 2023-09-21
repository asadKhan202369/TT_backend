const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const reviewSchema = new mongoose.Schema({
 
    ownerid:{
            type : mongoose.Schema.Types.ObjectId , ref:'student'
    },
    htext:{
        type:String,
    },
    messsage:{
        type:String
    }
     
},{ timestamps: true });


const review = mongoose.model("review",reviewSchema);
module.exports = review;