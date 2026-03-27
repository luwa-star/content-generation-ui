"use client";

import { useEffect, useState } from "react";
import ChannelPreview from "@/components/distribute/ChannelPreview";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { publishContent, scheduleContent } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectItem,
	SelectContent,
} from "@/components/ui/select";

import { CircleXIcon } from "lucide-react";

import { distributionSchema, SchedulePayload } from "@/lib/schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, InfoIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import DateTimePicker from "@/components/DateTimePicker";
import {
	EmailData,
	LinkedInData,
	SelectDraftData,
	TweetData,
} from "@/lib/interface";
import PlatformSelector from "@/components/PlatformSelector";

export default function DistributionPage() {
	const [data, setData] = useState<SelectDraftData | null>(null);
	const [resError, setResError] = useState<string | null>(null);

	const [successRes, setSuccessRes] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [errorPlatforms, setErrorPlatforms] = useState<
		string[] | null | undefined
	>(null);
	const [isRetrying, setIsRetrying] = useState<boolean>(false);
	const [errorType, setErrorType] = useState<"duplicate" | "error" | null>(
		null,
	);

	useEffect(() => {
		const stored = localStorage.getItem("previewContent");

		if (stored) {
			setData(JSON.parse(stored));
		}
	}, []);

	const { handleSubmit, watch, setValue, setError, control, reset } = useForm({
		resolver: zodResolver(distributionSchema),

		defaultValues: {
			publishMode: "now",
		},
	});

	const publishMode = watch("publishMode");

	const onSubmit = async ({
		publishMode,
		scheduledAt,
		platforms,
	}: {
		publishMode: string;
		scheduledAt?: Date;
		platforms: string[];
	}) => {
		setResError(null);
		setSuccessRes(null);
		setErrorType(null);
		setErrorPlatforms(null);

		let payload = {
			draft: data?.draft,
			recordID: data?.airtableId,
			platforms,
		};
		console.log(payload);

		setIsSubmitting(true);
		if (publishMode === "now") {
			const res = await publishContent(payload);
			console.log("publish res", res);
			setIsSubmitting(false);
			if (!res) {
				setResError("Something went wrong");

				return;
			}
			if (res.code && res.code !== 200) {
				setResError(res.message);
				return;
			}
			if (!res.success) {
				setResError(res.message);
				if (res.platforms) {
					setErrorPlatforms(res.platforms);
				}
				if (res.type === "duplicate") {
					setErrorType("duplicate");
					setResError(res.message);
				}

				return;
			}
			reset();
			setSuccessRes(res.message);
			return;
		}

		if (publishMode === "schedule") {
			if (!scheduledAt) {
				setError("scheduledAt", { message: "Please select a date and time" });
				return;
			}
			payload = Object.assign(payload, {
				scheduledAt: scheduledAt?.toISOString(),
				platforms,
			});
			console.log("schedule payload", payload);
			const res = await scheduleContent(payload as SchedulePayload);
			console.log("scheduled res", res);
			setIsSubmitting(false);
			if (!res) {
				setResError("Something went wrong");
				return;
			}
			if (res.code && res.code !== 200) {
				setResError(res.message);

				return;
			}

			if (!res.success) {
				setResError(res.message);
				if (res.type === "duplicate") {
					setErrorType("duplicate");
					setResError(res.message);
				}
				return;
			}
			reset();
			setIsSubmitting(false);
			setSuccessRes(res.message);
		}
	};

	const retryPublish = async () => {
		setResError(null);
		setSuccessRes(null);
		setErrorPlatforms(null);

		const payload = {
			draft: data?.draft,
			recordID: data?.airtableId,
			platforms: errorPlatforms,
		};
		console.log(payload);
		setIsRetrying(true);

		const res = await publishContent(payload);
		console.log("publish res", res);
		setIsRetrying(false);
		if (!res) {
			setResError("Something went wrong");
			return;
		}
		if (res.code && res.code !== 200) {
			setResError(res.message);
			return;
		}

		if (!res.success) {
			setResError(res.message);
			if (res.platforms) {
				setErrorPlatforms(res.platforms);
			}

			return;
		}
		setSuccessRes(res.message);
	};

	if (!data) return <p>No draft found</p>;

	const tweets = JSON.parse(data.draft.x) as TweetData;
	const linkedIn = JSON.parse(data.draft.linkedIn) as LinkedInData;
	const email = JSON.parse(data.draft.email) as EmailData;

	return (
		<main className="p-10 space-y-6 min-h-screen bg-muted/40">
			<h1 className="text-xl font-semibold">Distribution</h1>

			<div className="grid md:grid-cols-3 gap-6">
				<ChannelPreview
					title="LinkedIn"
					content={linkedIn.post_text}
					type={"linkedIn"}
				/>

				<ChannelPreview title="X(Twitter)" content={tweets.tweets} type={"x"} />

				<ChannelPreview
					title="Email"
					content={email.markdown}
					emailProps={email}
					type={"email"}
				/>
			</div>
			<Card className="max-w-md">
				<CardContent className="space-y-4 pt-6">
					{isSubmitting && (
						<div className="grid w-full max-w-md items-start gap-4">
							<Alert>
								<InfoIcon />
								<AlertTitle>Publishing Content</AlertTitle>
								<AlertDescription>
									Please wait while we publish your content.
								</AlertDescription>
							</Alert>
						</div>
					)}
					{successRes && (
						<div className="grid w-full max-w-md items-start gap-4">
							<Alert>
								<CheckCircle2Icon />
								<AlertTitle>Success</AlertTitle>
								<AlertDescription>
									{successRes || "Content published successfully"}
									<br />
									Check out the content calendar here{" "}
									<a
										href="https://airtable.com/appfBqp8T9RYWiHaS/shrBFKOcDlPsFGQVS"
										className="text-blue-500 underline">
										here
									</a>
								</AlertDescription>
							</Alert>
						</div>
					)}
					{resError && (
						<div className="grid w-full items-start gap-4">
							<Alert className="flex flex-col space-y-2" variant="destructive">
								<div className="flex gap-2">
									<CircleXIcon size={20} />
									<AlertTitle>
										{errorType === "duplicate" ? "Duplicate" : "Error"}
									</AlertTitle>
								</div>
								<AlertDescription>
									{resError}
									<br />

									<a
										href="https://airtable.com/appfBqp8T9RYWiHaS/shrEGfPtaq3j67lhq"
										className="text-blue-500 underline">
										Click here to view Error logs
									</a>
								</AlertDescription>
								{Array.isArray(errorPlatforms) &&
									errorPlatforms?.length > 0 && (
										<AlertDescription>
											<p>Failed to publish on: {errorPlatforms.join(", ")}</p>
											<Button disabled={isRetrying} onClick={retryPublish}>
												Retry
											</Button>
										</AlertDescription>
									)}
							</Alert>
						</div>
					)}
					<Controller
						name="platforms"
						control={control}
						render={({ field, fieldState }) => (
							<div className="space-y-2">
								<Label>Select platform(s)</Label>

								<PlatformSelector
									value={field.value || []}
									onChange={field.onChange}
								/>

								{fieldState.error && (
									<p className="text-sm text-destructive">
										{fieldState.error.message}
									</p>
								)}
							</div>
						)}
					/>
					<Label>Publish Mode</Label>
					<Select
						defaultValue="now"
						onValueChange={(v: "now" | "schedule") =>
							setValue("publishMode", v)
						}>
						<SelectTrigger>
							<SelectValue placeholder="Select publish option" />
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="now">Publish now</SelectItem>

							<SelectItem value="schedule">Schedule</SelectItem>
						</SelectContent>
					</Select>

					{publishMode === "schedule" && (
						<Controller
							name="scheduledAt"
							control={control}
							render={({ field, fieldState }) => (
								<div className="space-y-2">
									<Label>Schedule date & time</Label>

									<DateTimePicker
										value={field.value}
										onChange={field.onChange}
									/>

									{fieldState.error && (
										<p className="text-sm text-destructive">
											{fieldState.error.message}
										</p>
									)}
								</div>
							)}
						/>
					)}

					<Button
						onClick={handleSubmit(onSubmit)}
						disabled={isSubmitting || isRetrying}
						className="w-full">
						Continue
					</Button>
				</CardContent>
			</Card>
		</main>
	);
}
