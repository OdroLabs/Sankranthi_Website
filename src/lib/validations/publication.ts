import { z } from "zod";
export const publicationSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
  kind: z.string().default("Report"),
  summary: z.string().min(10),
  coverImage: z.string().url().optional().or(z.literal("")),
  fileUrl: z.string().url().optional().or(z.literal("")),
  externalUrl: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(true),
});
export type PublicationInput = z.infer<typeof publicationSchema>;
