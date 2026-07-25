import { User } from '../models/user.model.js';
import * as z from 'zod';

const userRegisterationSchemaValidation = z.object({
    name: z
        .string({ required_error: "name is required" })
        .min(1, "name is required")
        .trim(),

    email: z
        .string({ required_error: "email field is required" })
        .email("please enter a valid email")
        .trim()
        .toLowerCase(),

    password: z
        .string({ required_error: "password is required" })
        .min(6, "password must be atleast 6 characters long")
})

const userLoginSchemaValidation = z.object({
    email: z
        .string({ required_error: "email field is required" })
        .email("please enter a valid email")
        .trim()
        .toLowerCase(),

    password: z
        .string({ required_error: "password is required" })
        .min(6, "password must be atleast 6 characters long")
})

export { userRegisterationSchemaValidation, userLoginSchemaValidation }