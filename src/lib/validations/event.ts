import { z } from "zod";
export const eventSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
  description: z.string().min(10),
  coverImage: z.string().url().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().optional().nullable(),
  published: z.boolean().default(true),
});
export type EventInput = z.infer<typeof eventSchema>;
