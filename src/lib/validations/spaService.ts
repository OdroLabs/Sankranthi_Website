import { z } from "zod";
export const spaServiceSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().or(z.literal("")),
  price: z.coerce.number().min(0), // rupees in the form, stored as cents
  durationMin: z.coerce.number().int().min(15).default(60),
  active: z.boolean().default(true),
});
export type SpaServiceInput = z.infer<typeof spaServiceSchema>;
