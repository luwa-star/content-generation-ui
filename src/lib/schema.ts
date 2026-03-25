import { z } from "zod";

export const contentSchema = z.object({
  idea: z.string().optional(),
  url: z.url().optional().or(z.literal("")),
  keywords: z.string().optional(),
  tone: z.enum([
    "professional",
    "casual",
    "technical",
    "thought-leadership",
  ]),
});

export type ContentInput = z.infer<typeof contentSchema>;