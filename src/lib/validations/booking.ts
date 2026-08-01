import { z } from "zod";
export const bookingSchema = z.object({
  spaServiceId: z.string().min(1, "Choose a service"),
  customerName: z.string().min(2, "Your name is required"),
  phone: z.string().min(7, "A contact number is required"),
  email: z.string().email().optional().or(z.literal("")),
  scheduledAt: z.coerce.date(),
  notes: z.string().optional().or(z.literal("")),
});
export type BookingInput = z.infer<typeof bookingSchema>;
