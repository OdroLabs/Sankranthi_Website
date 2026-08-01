import { z } from "zod";
export const contactSchema = z.object({
  name: z.string().min(2, "Your name is required"),
  contact: z.string().min(5, "A phone number or email is required"),
  subject: z.string().optional().or(z.literal("")),
  message: z.string().min(10, "Please add a short message"),
});
export type ContactInput = z.infer<typeof contactSchema>;
