import { z } from "zod";
export const serviceSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
  icon: z.string().optional().or(z.literal("")),
  description: z.string().min(10),
  specialCase: z.string().optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});
export type ServiceInput = z.infer<typeof serviceSchema>;
