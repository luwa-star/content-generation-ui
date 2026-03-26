"use client";

import { useRouter } from "next/navigation";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { CircleXIcon, FileText } from "lucide-react";
import { useState } from "react";
import { selectDraft } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, InfoIcon } from "lucide-react";
import { clonePageVaryPathWithNewSearchParams } from "next/dist/client/components/segment-cache/vary-path";
import MarkdownViewer from "../markdown/MarkdownViewer";

export default function DraftCard({ draft, isSubmitting, setIsSubmitting }) {
	const router = useRouter();
	const [resError, setResError] = useState<string | null>(null);
	const [errorType, setErrorType] = useState<"duplicate" | "error" | null>(
		null,
	);

	const draftAirtable = localStorage.getItem("draftAirtableData");
	console.log("other data", draftAirtable);

	const raw = {
		success: true,
		message: "Fetched successfully",
		data: {
			draft: {
				x: '{\n    "tweets": [\n        "AI is revolutionizing marketing strategies by enhancing productivity and refining workflows. 🚀 #AIMarketing",\n        "AI tools analyze customer preferences, helping craft data-driven content strategies, optimizing time and resources. 📊",\n        "Predictive insights from AI enhance creativity by suggesting trending topics, streamlining content creation. ✨",\n        "AI identifies optimal channels and timing, ensuring your content reaches the right audience for better engagement. 📈",\n        "Shift to AI-driven marketing for more efficient campaigns. Explore advanced AI tools to boost your content strategy today!"\n    ]\n}',
				linkedIn:
					'{\n    "post": "Explore how AI transforms marketing strategy through automation, productivity boosts, and decision-making enhancements. 🚀\\n\\n❓ Problem: Struggling to adapt your marketing strategy?\\n\\n🔥 Agitate: Traditional methods are time-consuming and inefficient. 😓\\n\\n✅ Solution: AI-driven processes revolutionize content strategy!\\n\\nLet\'s dive in:\\n\\n• AI crafts data-driven strategies by analyzing customer preferences.\\n• Predictive insights suggest trending topics, saving brainstorming time.⏱️\\n• Strategically distribute content for maximum engagement. 📊\\n\\nReady to upgrade your approach? Explore advanced AI tools to boost your content strategy today! 🤖"\n}',
				email:
					'{\n    "subject": "Transforming Marketing Strategy with AI",\n    "previewText": "Discover how AI reshapes marketing with automation and insights.",\n    "body": "Hi there,\\n\\nAs digital transformation accelerates, AI is revolutionizing how marketing teams approach content strategies. Let’s explore how:\\n\\n### Introduction to AI in Marketing\\nAI tools boost productivity and refine strategies, marking a shift in digital marketing.\\n\\n### Understanding AI\'s Role in Content Planning\\nAI develops data-driven strategies, analyzing customer preferences for tailored campaigns.\\n\\n### Automating Content Creation with AI\\nPredictive insights aid content creation, offering relevant topics and saving brainstorming time.\\n\\n### Enhancing Distribution with AI Tools\\nAI ensures precise content distribution, boosting engagement by reaching the right audience.\\n\\n### Conclusion: Future of AI in Marketing\\nAs marketing shifts towards AI-driven processes, efficiency and insight grow in strategic planning.\\n\\nExplore advanced AI tools to boost your content strategy today!\\n\\nBest regards,\\nYour Marketing Content Team"\n}',
			},
			airtableId: "rec6kwW1VJ2lgyMRF",
		},
	};
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
		console.log("payload", payload);

		// const res = await selectDraft(payload);
		const res = raw;
		console.log("select response", res);
		setIsSubmitting(false);
		if (res.code && res.code !== 200) {
			setResError(res.message);

			return;
		}
		if (res.type === "duplicate") {
			localStorage.setItem("duplicateData", JSON.stringify(res));
			router.push("/duplicate");
			return;
		}

		localStorage.setItem("previewContent", JSON.stringify(res.data));
		router.push("/distribute");
	};

	return (
		<Card className="flex flex-col">
			<CardContent className="space-y-3">
				<div className="flex gap-2 items-center">
					<FileText size={16} />

					<p className="font-medium">{draft.title}</p>
				</div>
				{/* 
				<p className="text-sm text-muted-foreground">{draft.article}</p> */}
				<MarkdownViewer content={draft.article} />
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
