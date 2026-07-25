import { ApiError } from "../utils/ApiError.js";

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errorMessages = result.error.errors.map((err) => err.message);
    throw new ApiError(400, "Validation failed", errorMessages);
  }

  req.body = result.data; // zod ke through validated/cleaned data wapas req.body mein daal do
  next();
};

export { validate };