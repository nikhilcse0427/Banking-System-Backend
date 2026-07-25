import dotenv from 'dotenv';
dotenv.config();

import { app } from "./app.js";
import { connectDB } from './config/db.js';


const port = process.env.port || 8000;


connectDB()
.then(()=>{
  app.listen(port, ()=>{
    console.log(`server is running on port number: ${port}`);
    console.log("Database connected successfully !!");
  })
})
.catch((error)=>{
  console.log("Database connection error: ", error.message);
})




