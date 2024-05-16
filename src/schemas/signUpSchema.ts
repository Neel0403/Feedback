import { z } from "zod"

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .min(20, "Username must be no more than 20 characters")
    .regex(/^[a-zA-z0-9_]+$/, "Username must not contain special character")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(6, { message: "Password must be atleast 6 characters" })
})
