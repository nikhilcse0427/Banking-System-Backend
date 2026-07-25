import jwt from "jsonwebtoken";
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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "user created successfully",
      success: true,
      user: userData,
      accessToken: accessToken
    })

  } catch (error) {
    throw new ApiError(500, error.message || "Registration failed")
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError(404, "user does not exist with this email.");
    }
    const isPasswordMatch = await user.isPasswordCorrect(password);
    if (!isPasswordMatch) {
      throw new ApiError(401, "Invalid password entered")
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const userData = user.toObject();
    delete userData.password;
    delete userData.refreshToken;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.send({
      message: "login successfully",
      success: true,
      user: userData,
      accessToken: accessToken
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error.message || "login failed");
  }

}

const generateRefreshToken1 = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "refreshToken does not exist");
    }
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user_id = decodedToken.user_id;
    const user = await User.findById(user_id);
    if (!user) {
      throw new ApiError(401, "Invalid token");
    }
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "invalid token");
    }

    const newRefreshToken = jwt.sign({ user_id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
    const accessToken = generateAccessToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Access token regenerated successfully",
      success: true,
      accessToken,
    });

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error.message || "Internal server error");
  }
}

export { userRegisteration, login, generateRefreshToken1 };