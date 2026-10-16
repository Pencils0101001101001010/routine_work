import { z } from "zod";
export const whatsapp_number = z
    .string()
    .min(10, "Number should be 10 digits.")
    .max(10, "Number can't be more than 10 digits.");
export const password = z
    .string()
    .min(12)
    .max(128)
    .refine((value) => /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /[0-9]/.test(value) &&
    /[^A-Za-z0-9]/.test(value), "Use lower-case and capital letters, a number and a special character.");
const email = z
    .email()
    .trim()
    .max(254)
    .transform((value) => value.toLowerCase());
export const registerSchema = z
    .object({
    whatsapp_number,
    name: z.string().trim().min(1).max(160),
    password,
    email,
})
    .strict();
export const loginSchema = z
    .object({ whatsapp_number, password: z.string().min(1).max(128) })
    .strict();
export const emailSchema = z.object({ email }).strict();
export const tokenSchema = z
    .object({ token: z.string().min(32).max(128) })
    .strict();
export const resetSchema = tokenSchema.extend({ password }).strict();
export const changePasswordSchema = z
    .object({ currentPassword: z.string().min(1).max(128), password })
    .strict();
export const profileSchema = z
    .object({ name: z.string().trim().min(1).max(160) })
    .strict();
//# sourceMappingURL=auth.js.map