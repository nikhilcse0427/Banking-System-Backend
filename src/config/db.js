import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';

const connectDB = async ()=>{
  try{
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
  }catch(error){
    console.log("Database connection error: ", error.message);
    process.exit(1);
  }
}

export {connectDB};