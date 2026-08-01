import { z } from "zod";
export const suggestionSchema = z.object({
  name: z.string().optional().or(z.literal("")),
  contact: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  message: z.string().min(10, "Please share your suggestion"),
});
export type SuggestionInput = z.infer<typeof suggestionSchema>;
