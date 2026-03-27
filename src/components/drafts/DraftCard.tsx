"use client";

import { useRouter } from "next/navigation";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { CircleXIcon, FileText } from "lucide-react";
import { useState } from "react";
import { selectDraft } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, InfoIcon } from "lucide-react";
import MarkdownViewer from "../markdown/MarkdownViewer";
import { DraftAngle, SelectDraftRes } from "@/lib/interface";
import { Badge } from "@/components/ui/badge";

interface Props {
	draft: DraftAngle;
	isSubmitting: boolean;
	setIsSubmitting: (value: boolean) => void;
}
export default function DraftCard({
	draft,
	isSubmitting,
	setIsSubmitting,
}: Props) {
	const router = useRouter();
	const [resError, setResError] = useState<string | null>(null);
	const [errorType, setErrorType] = useState<"duplicate" | "error" | null>(
		null,
	);

	const draftAirtable = localStorage.getItem("draftAirtableData");
	const handleSelect = async () => {
		setResError(null);
		setErrorType(null);
		setIsSubmitting(true);
		const { airtableId, ...rest } = JSON.parse(draftAirtable || "{}");
		const payload = {
			...rest,
			recordID: airtableId,
			draft,
		};

		const res = await selectDraft(payload);

		setIsSubmitting(false);
		if (res.code && res.code !== 200) {
			setResError(res.message);

			return;
		}
		if (!res.success) {
			setResError(res.message);
			return;
		}
		if (res.type === "duplicate") {
			setResError(res.message);
			return;
		}

		localStorage.setItem("previewContent", JSON.stringify(res.data));
		router.push("/distribute");
	};

	return (
		<Card className="flex flex-col">
			<CardContent className="space-y-3">
				<div className="flex gap-2 items-center">
					<FileText size={24} />
					<p className="font-medium">{draft.title}</p>
					<Badge className="bg-blue-200 font-semibold" variant="secondary">
						{draft.angle.toUpperCase()}
					</Badge>
				</div>

				<MarkdownViewer content={draft.article_markdown} />
			</CardContent>
			{resError && (
				<div className="grid w-full items-start gap-4">
					<Alert variant="destructive">
						<CircleXIcon />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{resError}</AlertDescription>
					</Alert>
				</div>
			)}
			<CardFooter>
				<Button
					onClick={handleSelect}
					disabled={isSubmitting}
					className="w-full">
					{isSubmitting ? "Selecting..." : "Select"}
				</Button>
			</CardFooter>
		</Card>
	);
}
