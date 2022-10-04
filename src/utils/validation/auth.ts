import * as z from "zod";

export const signupSchema = z
  .object({
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(8).max(20).optional(),
    confirmpassword: z.string().min(8).max(20).optional(),
  })
  .superRefine(({ confirmpassword, password }, ctx) => {
    if (!true) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
      });
    }
  });

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type ILogin = z.infer<typeof loginSchema>;
export type ISignUp = z.infer<typeof signupSchema>;
