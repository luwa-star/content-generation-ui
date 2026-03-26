import { z } from "zod";
import { targetAudienceOptions } from "./interface";

export const contentSchema = z.object({
	topic: z.string().min(1, "Please enter a topic"),
	type: z.enum(["raw_idea", "url"], {
		error: "Please select content type",
	}),

	idea: z
		.string()
		.min(10, "Please enter content idea (min 10 characters)")
		.trim()
		.optional(),

	url: z.url({ error: "Please enter a valid URL" }).trim().optional(),
	keywords: z
		.string()
		.optional()
		.transform((value) => {
			if (!value) return [];

			return value
				.split(",")
				.map((k) => k.trim())
				.filter(Boolean);
		})
		.refine((arr) => arr.length <= 10, "Maximum 10 keywords allowed"),
	targetAudience: z.enum(targetAudienceOptions, {
		error: "Please select target audience",
	}),
	tone: z
		.enum(["professional", "casual", "technical", "thought-leadership"], {
			error: "Please select tone",
		})
		.nonoptional(),
});

export type ContentInput = z.infer<typeof contentSchema>;

export const distributionSchema = z.object({
	publishMode: z.enum(["now", "schedule"]),
	scheduledAt: z.date().optional(),
});
