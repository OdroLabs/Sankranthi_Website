import { z } from "zod";
export const donationSchema = z.object({
  donorName: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  amount: z.coerce.number().min(100, "Minimum donation is LKR 100"), // rupees
  message: z.string().optional().or(z.literal("")),
});
export type DonationInput = z.infer<typeof donationSchema>;
