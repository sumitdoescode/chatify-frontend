import * as z from "zod";

export const RegisterSchema = z.object({
    name: z.string().min(3, { message: "Name must be atleast of 3 characters" }).max(20, { message: "Name must be less than of 20 characters" }),
    email: z.email({ message: "Invalid email" }),
    password: z.string().min(8, { message: "Password must be atleast of 8 characters" }).max(50, { message: "Password must be less than of 50 characters" }),
});

export const LoginSchema = z.object({
    email: z.email({ message: "Invalid email" }),
    password: z.string().max(50, { message: "Password must be less than of 50 characters" }),
});

export const EditProfileSchema = z.object({
    name: z.string().min(3, { message: "Name must be atleast of 3 characters" }).max(20, { message: "Name must be less than of 20 characters" }),
    profileImage: z
        .file()
        .refine((file) => file?.size <= 1024 * 1024 * 1, { message: "Profile image must be less than 5MB" })
        .refine((file) => ["image/jpeg", "image/png", "image/gif"].includes(file?.type), { message: "Profile image must be a valid image file" })
        .optional(),
});
