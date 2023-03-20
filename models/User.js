const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please Enter Your firstname"]
      },
      lastName: {
        type: String,
        required: [true, "Please Enter Your lastname"]
      },
      userName: {
        type: String,
        required: [true, "Please Enter Your username"],
        unique: true,

      },
      email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: validator.isEmail,
      },
      password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [6, "Password must be at least 6 characters"],
        select: false,
      },
      role: {
        type: String,
        emun: ["admin", "user"],
        default: "user",
      },
      wallet: {
        type: mongoose.Schema.ObjectId,
        ref: 'Wallet'
      },
      createdAt:{
        type: Date,
        default: Date.now()
      },
})

schema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
      this.password = await bcrypt.hash(this.password, 10)
      next();
  })
  
  schema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
  }
  
  
  schema.methods.generateToken = function (){
    return jwt.sign({_id : this._id}, process.env.JWT_SECRET, {
      expiresIn : "15d",
    })
  }

module.exports = mongoose.model("User", schema)

