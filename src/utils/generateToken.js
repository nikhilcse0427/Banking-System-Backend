import jwt from "jsonwebtoken";

const generateAccessToken = (userId) => {
  const accessToken = jwt.sign({ user_id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
  return accessToken;
};
const generateRefreshToken = (userId) => {
  const refreshToken = jwt.sign({ user_id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
  return refreshToken;
};

export { generateAccessToken, generateRefreshToken };