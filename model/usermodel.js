const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const signupSchema = new Schema({
    name:String,
    email:String,
    contact:String,
    password:String,
    isAdmin:({
        type: Boolean,
        default: false 
    }),
    randomToken:String
})
const SignupModel = new mongoose.model('signup' , signupSchema)

module.exports = SignupModel
