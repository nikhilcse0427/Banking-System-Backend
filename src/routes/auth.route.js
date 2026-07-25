import { validate } from "../middlewares/validate.middleware.js";
import { userRegisterationSchemaValidation, userLoginSchemaValidation } from "../validators/user.validation.js";
import { userRegisteration as registerController } from "../controllers/auth.controller.js";
import { Router } from 'express';

const router = Router();

router.post('/registerUser', validate(userRegisterationSchemaValidation), registerController);

export { router };