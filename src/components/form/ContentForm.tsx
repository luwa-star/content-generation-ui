"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contentSchema, ContentInput, ContentOutputForm } from "@/lib/schema";
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
import { InfoIcon } from "lucide-react";
import { useState } from "react";
import { targetAudienceOptions } from "@/lib/interface";

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
		mode: "onChange",
		reValidateMode: "onChange",
	});
	const [resError, setResError] = useState<string | null>(null);
	const [errorType, setErrorType] = useState<"duplicate" | "error" | null>(
		null,
	);
	const [isRegeneRating, setIsRegenerating] = useState<boolean>(false);
	const [duplicateId, setDuplicateId] = useState<string | null>(null);

	const isValidUrl = (value: string) => {
		try {
			new URL(value);
			return true;
		} catch {
			return false;
		}
	};
	const parseKeywords = (value?: string) => {
		if (!value) return [];

		return value
			.split(",")
			.map((k) => k.trim())
			.filter(Boolean);
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
		setErrorType(null);
		validate(data);
		setDuplicateId(null);
		const payload: ContentOutputForm = { ...data };
		if (payload.keywords) {
			const keywords = parseKeywords(payload.keywords as string);
			if (Array.isArray(keywords) && keywords.length > 10) {
				setError("keywords", {
					message: "Maximum 10 keywords allowed",
				});
				return;
			}
			payload.keywords = keywords;
		}

		const res = await generateDrafts(payload);

		if (!res) {
			setResError("Something went wrong");
			return;
		}
		if ((res.code && res.code !== 200) || !res.success) {
			setResError(res.message);
			return;
		}
		if (!res.success) {
			setResError(res.message);
			return;
		}
		if (res.type === "duplicate") {
			// localStorage.setItem("duplicateData", JSON.stringify(res));
			// router.push("/duplicate");

			setResError("Duplicate Content");
			setDuplicateId(res?.recordId || null);
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

		if (res.code && res.code !== 200) {
			setResError(res.message);
			setIsRegenerating(false);
			return;
		}
		if (!res.success) {
			setResError(res.message);

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
						</Alert>
					</div>
				)}
				{errorType === "duplicate" && (
					<div className="grid w-full items-start gap-4">
						<Alert variant="destructive">
							<CircleXIcon />
							<AlertTitle>Duplicate Content</AlertTitle>
							<AlertDescription>
								We found similar content already published. Review before
								continuing.
								<a
									className="underline text-blue-600"
									href={`https://airtable.com/appfBqp8T9RYWiHaS/shr7GSCQ9DudHimix/tblikpXkU7z1OSAUp/${duplicateId}`}
									target="_blank"
									rel="noopener noreferrer">
									View Draft
								</a>
							</AlertDescription>
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
								<SelectValue placeholder="Tone" />
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
						{isSubmitting ? "Generating..." : "Generate Drafts"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
