import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(3, "Title needs at least 3 characters"),
  slug: z
    .string()
    .min(3, "Slug needs at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes only"),
  summary: z.string().min(10, "Add a short summary"),
  content: z.string().min(20, "Add the full project description"),
  coverImage: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  published: z.boolean().default(false),
});

export type ProjectInput = z.infer<typeof projectSchema>;
