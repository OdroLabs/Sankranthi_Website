import { z } from "zod";
export const newsSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
  excerpt: z.string().min(10),
  content: z.string().min(20),
  coverImage: z.string().url().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  published: z.boolean().default(true),
});
export type NewsInput = z.infer<typeof newsSchema>;
