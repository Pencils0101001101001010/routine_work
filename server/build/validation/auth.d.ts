import { z } from "zod";
export declare const whatsapp_number: z.ZodString;
export declare const password: z.ZodString;
export declare const registerSchema: z.ZodObject<{
    whatsapp_number: z.ZodString;
    name: z.ZodString;
    password: z.ZodString;
    email: z.ZodPipe<z.ZodEmail, z.ZodTransform<string, string>>;
}, z.core.$strict>;
export declare const loginSchema: z.ZodObject<{
    whatsapp_number: z.ZodString;
    password: z.ZodString;
}, z.core.$strict>;
export declare const emailSchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodEmail, z.ZodTransform<string, string>>;
}, z.core.$strict>;
export declare const tokenSchema: z.ZodObject<{
    token: z.ZodString;
}, z.core.$strict>;
export declare const resetSchema: z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
}, z.core.$strict>;
export declare const changePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    password: z.ZodString;
}, z.core.$strict>;
export declare const profileSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strict>;
//# sourceMappingURL=auth.d.ts.map