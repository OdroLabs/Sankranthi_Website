import { z } from "zod";
export const galleryImageSchema = z.object({
  url: z.string().url("Enter a valid image URL"),
  caption: z.string().optional().or(z.literal("")),
  eventId: z.string().optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).default(0),
});
export type GalleryImageInput = z.infer<typeof galleryImageSchema>;
