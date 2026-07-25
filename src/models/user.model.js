import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required."]
  },
  email: {
    type: String,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter valid email."],
    required: [true, "Email is required."]
  },
  password: {
    type: String,
    minlength: [6, "Password should be atleast 6 characters long"],
    required: [true, "Password is required"],
    select: false
  },
  refreshToken: {
    type: String,
  }
}, { timestamps: true });


userSchema.pre('save', async function () {
  if (!this.isModified("password")) {
    return;
  }
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;

})

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);
export { User }