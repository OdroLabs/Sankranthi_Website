import { z } from "zod";
export const volunteerSchema = z.object({
  name: z.string().min(2),
  role: z.string().optional().or(z.literal("")),
  photo: z.string().url().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});
export type VolunteerInput = z.infer<typeof volunteerSchema>;
