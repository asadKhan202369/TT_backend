const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const reviewSchema1 = new mongoose.Schema({
 
    ownerid:{
            type : mongoose.Schema.Types.ObjectId , ref:'employee'
    },
    htext:{
        type:String,
    },
    messsage:{
        type:String
    }
     
},{ timestamps: true });


const review1 = mongoose.model("review1",reviewSchema1);
module.exports = review1;