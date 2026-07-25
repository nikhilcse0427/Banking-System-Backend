import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

const verifyAccessToken = (req, res, next) => {
  try {
    // Authorization header:
    // Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ApiError(401, "Access token does not exist");
    }

    // Bearer token को अलग करना
    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Invalid authorization format");
    }

    // Token verify करना
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // User information request में store कर सकते हैं
    req.user = decodedToken;

    // Next middleware/controller पर जाएं
    next();

  } catch (error) {
    next(new ApiError(
      401,
      error.message || "Invalid or expired access token"
    ));
  }
};

export { verifyAccessToken };