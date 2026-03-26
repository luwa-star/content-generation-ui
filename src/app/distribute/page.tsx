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

import { formatISO } from "date-fns";
import { distributionSchema } from "@/lib/schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, InfoIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import DateTimePicker from "@/components/DateTimePicker";

export default function DistributionPage() {
	const [data, setData] = useState<any>(null);
	const [resError, setResError] = useState<string | null>(null);

	const [successRes, setSuccessRes] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	useEffect(() => {
		const stored = localStorage.getItem("previewContent");

		if (stored) {
			setData(JSON.parse(stored));
		}
	}, []);
	// console.log("preview==string", JSON.stringify(data, null, 2));

	const { handleSubmit, watch, setValue, control } = useForm({
		resolver: zodResolver(distributionSchema),

		defaultValues: {
			publishMode: "now",
		},
	});

	const publishMode = watch("publishMode");

	const onSubmit = async ({
		publishMode,
		scheduledAt,
	}: {
		publishMode: string;
		scheduledAt?: Date;
	}) => {
		setResError(null);
		let payload = {
			draft: data.draft,
			recordID: data.airtableId,
		};
		setIsSubmitting(true);
		if (publishMode === "now") {
			console.log(payload);
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

			setIsSubmitting(false);
			setSuccessRes(res.message);
			return;
		}

		if (publishMode === "schedule") {
			payload = Object.assign(payload, {
				scheduledAt: scheduledAt?.toISOString(),
			});
			console.log("payload", payload);
			const res = await scheduleContent(payload);
			setIsSubmitting(false);
			if (!res) {
				setResError("Something went wrong");
				return;
			}
			if (res.code && res.code !== 200) {
				setResError(res.message);

				return;
			}
			setIsSubmitting(false);
			setSuccessRes(res.message);
		}
	};

	if (!data) return <p>No draft found</p>;

	const reConstructTweet = JSON.parse(data.draft.x).tweets.join("\n");
	return (
		<main className="p-10 space-y-6 min-h-screen bg-muted/40">
			<h1 className="text-xl font-semibold">Distribution</h1>

			<div className="grid md:grid-cols-3 gap-6">
				<ChannelPreview
					title="LinkedIn"
					content={JSON.parse(data.draft.linkedIn).post}
					emailProps={{}}
				/>

				<ChannelPreview
					title="X(Twitter)"
					content={reConstructTweet}
					emailProps={{}}
				/>

				<ChannelPreview
					title="Email"
					content={JSON.parse(data.draft.email).body}
					emailProps={JSON.parse(data.draft.email)}
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
					<Select onValueChange={(v) => setValue("publishMode", v)}>
						<SelectTrigger>
							<SelectValue placeholder="Select publish option" />
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="now">Publish now</SelectItem>

							<SelectItem value="schedule">Schedule</SelectItem>
						</SelectContent>
					</Select>

					{/* {publishMode === "schedule" && (
						<Popover>
							<PopoverTrigger asChild>
								<Button variant="outline" className="w-full justify-start">
									<CalendarIcon className="mr-2" size={16} />
									Select date
								</Button>
							</PopoverTrigger>

							<PopoverContent>
								<Calendar
									mode="single"
									onSelect={(date) => setValue("scheduledAt", date)}
								/>
							</PopoverContent>
						</Popover>
					)} */}
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
						disabled={isSubmitting}
						className="w-full">
						Continue
					</Button>
				</CardContent>
			</Card>
		</main>
	);
}
