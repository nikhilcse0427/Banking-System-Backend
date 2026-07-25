import { validate } from "../middlewares/validate.middleware.js";
import { userRegisterationSchemaValidation, userLoginSchemaValidation } from "../validators/user.validation.js";
import { login, userRegisteration as registerController } from "../controllers/auth.controller.js";
import { Router } from 'express';
import { verifyAccessToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/registerUser', validate(userRegisterationSchemaValidation), registerController);

router.post('/login', validate(userLoginSchemaValidation),login);


export { router };