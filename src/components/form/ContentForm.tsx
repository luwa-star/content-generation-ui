"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contentSchema, ContentInput } from "@/lib/schema";
import { generateDrafts } from "@/lib/api";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
	Select,
	SelectItem,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { CircleXIcon, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, InfoIcon } from "lucide-react";
import { useState } from "react";
import { targetAudienceOptions } from "@/lib/interface";

const raw = {
	success: true,
	message: "Fetched successfully",
	type: "new",
	data: {
		drafts: [
			{
				angle: "educational",
				title: "How AI Enhances Content Strategy for Marketing Teams",
				metaDescription:
					"Explore how AI transforms marketing strategy through automation, productivity boosts, and decision-making enhancements.",
				outline: [
					"Introduction to AI in Marketing",
					"Understanding AI's Role in Content Planning",
					"Automating Content Creation with AI",
					"Enhancing Distribution with AI Tools",
					"Conclusion and Future of AI in Marketing",
				],
				article:
					"### Introduction to AI in Marketing\nAI marketing is reshaping how teams approach their content strategies. By using AI, marketing managers can enhance their productivity and refine workflows. As digital transformation progresses, adopting AI technologies becomes imperative.\n\n### Understanding AI's Role in Content Planning\nAI tools aid in developing data-driven content strategies. They analyze customer preferences, allowing teams to custom-fit their campaigns. This automation contrasts with traditional methods, optimizing both time and resources.\n\n### Automating Content Creation with AI\nAI enhances creativity by offering predictive insights. Tools suggest trending topics, aiding in crafting engaging and relevant content. This automation saves significant time typically spent on brainstorming.\n\n### Enhancing Distribution with AI Tools\nAI tools enable precise distribution by identifying optimal channels and timing. This strategic approach ensures content reaches the right audience, boosting engagement and efficacy.\n\n### Conclusion and Future of AI in Marketing\nThe shift from manual to AI-driven processes marks a new era in digital marketing. AI will continue to revolutionize marketing strategies, driving more efficient and insightful campaigns.\n",
				cta: "Explore advanced AI tools to boost your content strategy today!",
			},
			{
				angle: "strategic",
				title: "AI Marketing Strategies: Insights for Forward-Thinking Teams",
				metaDescription:
					"Discover the strategic impact of AI on content marketing, focusing on trends and industry implications for managers.",
				outline: [
					"AI as a Strategic Asset in Marketing",
					"Trends in AI Marketing Tools and Technologies",
					"Implications of AI on Content Strategies",
					"Positioning Your Team for AI Success",
					"Conclusion: Future Trends in AI Marketing",
				],
				article:
					"### AI as a Strategic Asset in Marketing\nAI marketing tools position teams to make insightful strategic decisions. The shift towards AI-assisted content planning aligns with the broader digital transformation in marketing.\n\n### Trends in AI Marketing Tools and Technologies\nCurrent trends highlight the rise of personalized content delivery and automated customer engagement. AI technologies offer competitive advantages, helping teams stay ahead in fast-evolving markets.\n\n### Implications of AI on Content Strategies\nThe integration of AI redefines content strategies by making them more adaptive and data-centric. This shift enables real-time adjustments based on market trends and audience behavior.\n\n### Positioning Your Team for AI Success\nTo leverage AI fully, marketing managers must nurture a culture of innovation. Investing in AI training and tool acquisition is crucial for remaining competitive and effective.\n\n### Conclusion: Future Trends in AI Marketing\nAI's role will only grow, necessitating ongoing adaptation. Proactive teams will capitalize on emerging AI technologies, ensuring sustained strategic success.\n",
				cta: "Stay ahead in digital marketing—embrace AI tools and transform your strategy now!",
			},
			{
				angle: "tactical",
				title: "Implementing AI in Your Marketing Content Workflow",
				metaDescription:
					"Learn actionable steps for integrating AI into marketing workflows, focusing on productivity and automation enhancements.",
				outline: [
					"Getting Started with AI in Marketing Workflows",
					"Choosing the Right AI Tools for Content Planning",
					"Automating Content Creation Processes",
					"Enhancing Campaign Distribution Through AI",
					"Checklist for Integrating AI into Marketing",
				],
				article:
					"### Getting Started with AI in Marketing Workflows\nTo begin integrating AI, marketing managers should identify areas of their workflow ripe for automation. Initial steps include evaluating current processes and defining clear AI objectives.\n\n### Choosing the Right AI Tools for Content Planning\nSelecting appropriate AI tools is crucial. Look for those that offer advanced analytics, trend prediction, and automated content suggestion to boost efficiency and output quality.\n\n### Automating Content Creation Processes\nAI aids in automating routine tasks, such as topic discovery and content drafting. Implement AI to handle these aspects, allowing teams to focus on creative and strategic tasks.\n\n### Enhancing Campaign Distribution Through AI\nUtilize AI tools for optimized content distribution. This involves scheduling posts at peak engagement times and selecting platforms that maximize audience reach.\n\n### Checklist for Integrating AI into Marketing\nEnsure successful AI integration by following a detailed checklist:\n- Identify workflow bottlenecks\n- Evaluate AI tools\n- Train team members\n- Implement AI step-by-step\n- Monitor and adjust strategies\n",
				cta: "Integrate AI seamlessly—download our AI integration checklist to start transforming your workflows.",
			},
		],
		airtableId: "rec6kwW1VJ2lgyMRF",
		tone: "thought-leadership",
		audience: "Marketing Managers",
	},
};
export default function ContentForm() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		control,
		setError,
		formState: { isSubmitting, errors, isValid },
	} = useForm<ContentInput>({
		resolver: zodResolver(contentSchema),
	});
	const [resError, setResError] = useState<string | null>(null);
	const [errorType, setErrorType] = useState<"duplicate" | "error" | null>(
		null,
	);
	const [isRegeneRating, setIsRegenerating] = useState<boolean>(false);

	const isValidUrl = (value: string) => {
		try {
			new URL(value);
			return true;
		} catch {
			return false;
		}
	};
	const validate = (data: ContentInput) => {
		if (data.type === "raw_idea") {
			if (!data.idea || data.idea.length < 10) {
				setError("idea", {
					message: "Please enter content idea (min 10 characters)",
				});
			}
			return;
		}
		if (data.type === "url") {
			if (!data.url) {
				setError("url", {
					message: "Please provide a URL",
				});
			} else {
				const normalizeUrl = (url: string) => {
					if (!/^https?:\/\//i.test(url)) {
						return `https://${url}`;
					}

					return url;
				};
				const url = normalizeUrl(data.url);
				if (!isValidUrl(url)) {
					setError("url", {
						message: "Please enter a valid URL",
					});
				}
			}
			return;
		}
	};

	const onSubmit = async (data: ContentInput) => {
		setResError(null);
		validate(data);

		// const res = await generateDrafts(data);
		const res = raw;
		console.log("res", res);
		if (!res) {
			setResError("Something went wrong");
			return;
		}
		if ((res.code && res.code !== 200) || !res.success) {
			setResError(res.message);
			return;
		}
		if (res.type === "duplicate") {
			localStorage.setItem("duplicateData", JSON.stringify(res));
			router.push("/duplicate");
			return;
		}

		const { drafts, ...others } = res.data || {};
		localStorage.setItem("drafts", JSON.stringify(drafts));
		localStorage.setItem("draftAirtableData", JSON.stringify(others));

		router.push("/drafts");
	};
	//TODO: COMEBACK
	const regenerateDraft = async (data: ContentInput) => {
		setResError(null);
		setErrorType(null);
		setIsRegenerating(true);
		const res = await generateDrafts(data);
		console.log("res", res);
		if (res.code && res.code !== 200) {
			setResError(res.message);
			setIsRegenerating(false);
			return;
		}
		localStorage.setItem("drafts", JSON.stringify(res.data));
		setIsRegenerating(false);
		router.push("/drafts");
	};

	return (
		<Card className="w-full lg:w-1/2 max-w-xl shadow-sm">
			<CardHeader>
				<CardTitle className="flex gap-2 items-center">
					<Sparkles size={18} />
					Generate Content
				</CardTitle>
			</CardHeader>

			<CardContent className="space-y-4">
				{isSubmitting && (
					<div className="grid w-full items-start gap-4">
						<Alert variant={"default"}>
							<InfoIcon />
							<AlertTitle>Generating Drafts</AlertTitle>
							<AlertDescription>
								Please wait while we generate drafts for your content.
							</AlertDescription>
						</Alert>
					</div>
				)}
				{resError && (
					<div className="grid w-full items-start gap-4">
						<Alert variant="destructive">
							<CircleXIcon />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{resError}</AlertDescription>
							{errorType === "duplicate" && (
								<Button
									onClick={regenerateDraft}
									disabled={isRegeneRating}
									className="w-full">
									{isRegeneRating ? "Regenerating..." : "Regenerate Drafts"}
								</Button>
							)}
							<Button />
						</Alert>
					</div>
				)}
				<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
					<div className="space-y-2">
						<Input placeholder="Topic" {...register("topic")} />
						{errors.topic && (
							<p className="text-sm text-destructive">{errors.topic.message}</p>
						)}
					</div>
					<Label>Content Source Type</Label>
					<Controller
						name="type"
						control={control}
						render={({ field, fieldState }) => (
							<RadioGroup
								onValueChange={field.onChange}
								value={field.value}
								className="w-fit">
								<div className="w-full flex justify-start gap-3 items-center">
									<div className="flex items-center gap-3">
										<RadioGroupItem value="raw_idea" id="raw_idea" />

										<Label htmlFor="raw_idea">Raw Idea</Label>
									</div>

									<div className="flex items-center gap-3">
										<RadioGroupItem value="url" id="url" />

										<Label htmlFor="url">URL</Label>
									</div>
								</div>

								{fieldState.error && (
									<p className="text-sm text-red-500">
										{fieldState.error.message}
									</p>
								)}
							</RadioGroup>
						)}
					/>

					{watch("type") === "raw_idea" && (
						<div className="space-y-2">
							<Textarea
								placeholder="Enter content idea..."
								{...register("idea")}
							/>
							{errors.idea && (
								<p className="text-sm text-destructive">
									{errors.idea.message}
								</p>
							)}
						</div>
					)}

					{watch("type") === "url" && (
						<div className="space-y-2">
							<Input placeholder="Paste article URL" {...register("url")} />
							{errors.url && (
								<p className="text-sm text-destructive">{errors.url.message}</p>
							)}
						</div>
					)}
					<div className="space-y-2">
						<Label>Keywords(optional)</Label>

						<Input
							placeholder="seo, marketing automation, ai tools"
							{...register("keywords")}
						/>

						<p className="text-xs text-muted-foreground">
							Separate keywords with commas
						</p>
					</div>
					<div className="space-y-2">
						<Label>Target Audience</Label>

						<Select onValueChange={(v) => setValue("targetAudience", v as any)}>
							<SelectTrigger>
								<SelectValue placeholder="Select audience" />
							</SelectTrigger>

							<SelectContent>
								{targetAudienceOptions.map((audience) => (
									<SelectItem key={audience} value={audience}>
										{audience}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{errors.targetAudience && (
							<p className="text-sm text-destructive">
								{errors.targetAudience.message}
							</p>
						)}
					</div>
					<div className="space-y-2">
						<Select onValueChange={(v) => setValue("tone", v as any)}>
							<SelectTrigger>
								<SelectValue placeholder="tone" />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="professional">Professional</SelectItem>

								<SelectItem value="casual">Casual</SelectItem>

								<SelectItem value="technical">Technical</SelectItem>

								<SelectItem value="thought-leadership">
									Thought Leadership
								</SelectItem>
							</SelectContent>
						</Select>
						{errors.tone && (
							<p className="text-sm text-destructive">{errors.tone.message}</p>
						)}
					</div>

					<Button
						type="submit"
						disabled={isSubmitting || !isValid}
						className="w-full">
						Generate Drafts
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
