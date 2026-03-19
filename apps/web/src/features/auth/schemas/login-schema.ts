import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid work email"),
  password: z.string().min(1, "Password is required"),
  keepLoggedIn: z.boolean()
});

export type LoginFormData = z.infer<typeof loginSchema>;
