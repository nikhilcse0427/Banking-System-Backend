import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import bcrypt from 'bcrypt';

const userRegisteration = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw new ApiError(409, "user already exist");
    }

    const user = await User.create({
      name,
      email,
      password,
    })

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
  

    // refreshToken DB mein save karo
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const userData = user.toObject();
    delete userData.password;
    delete userData.refreshToken;

    const options = {
      httpOnly: true,
      secure: true
    };

    res.cookie("refreshToken", refreshToken, options);

    res.status(200).json({
      message: "user created successfully",
      success: true,
      user: userData,
      accessToken: accessToken
    })

  } catch (error) {
    throw new ApiError(500, error.message)
  }

}


const loginUser = async(req, res)=>{
  try{
    const {email, password} = req.body;
    const user = await User.findOne({email}).select("+password")
    if(!existingUser){
      res.status(500).json({
        message: "user with this email does not exist",
        success: false
      })
      return;
    }
    const hashedPassword = user.toObject().password;
    const plainPassword = bcrypt.verify()


  }catch(error){

  }
}

export { userRegisteration };