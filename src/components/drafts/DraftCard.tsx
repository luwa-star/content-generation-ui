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
	console.log("other data", draftAirtable);

	const raw = {
		success: true,
		message: "Fetched successfully",
		data: {
			draft: {
				x: '{\n    "tweets": [\n        "Strategic marketing in 2026: How to align your brand with growth trends. 💡",\n        "AI is transforming customer interactions! Embrace it to redefine experiences. 🤖",\n        "Personalized content boosts engagement. Are you creating what your audience craves?",\n        "Position your brand: Align strategies with expectations and use AI for loyalty.",\n        "Make data-driven decisions: Use analytics to adjust strategies and forecast trends.",\n        "Future-proof your brand by embracing strategic marketing trends. Ready for 2026? #MarketingTrends"\n    ]\n}',
				linkedIn:
					'{\n    "post_text": "Explore how strategic marketing trends can drive growth in 2026. Learn about opportunities and industry positioning.\\n\\nStrategic marketing helps you align with broader business goals. But how can you stand out in 2026?\\n\\n🔥 AI is revolutionizing how we interact with customers.\\n📈 Personalized content is key to audience engagement.\\n\\nHere\'s how to position your brand for success:\\n\\n• Align strategies with consumer expectations.\\n• Use AI tools to boost engagement and loyalty.\\n• Rely on analytics for data-driven decisions.\\n\\nEmbrace these trends to drive growth. What\'s your strategy for 2026? 🚀\\n\\nAlign your marketing strategies with emerging trends today and ensure your brand is positioned for success in the future.",\n    "post_markdown": "Explore how strategic marketing trends can drive growth in 2026. Learn about opportunities and industry positioning.\\n\\nStrategic marketing helps you align with broader business goals. But how can you stand out in 2026?\\n\\n🔥 AI is revolutionizing how we interact with customers.\\n📈 Personalized content is key to audience engagement.\\n\\nHere\'s how to position your brand for success:\\n\\n• Align strategies with consumer expectations.\\n• Use AI tools to boost engagement and loyalty.\\n• Rely on analytics for data-driven decisions.\\n\\nEmbrace these trends to drive growth. What\'s your strategy for 2026? 🚀\\n\\nAlign your marketing strategies with emerging trends today and ensure your brand is positioned for success in the future."\n}',
				email:
					'{\n    "subject": "Explore How Strategic Marketing Trends Can Drive Growth in 2026",\n    "previewText": "Discover strategic marketing trends to position your brand for growth.",\n    "html": "<h1>Explore How Strategic Marketing Trends Can Drive Growth in 2026</h1>\\n<h2>Introduction</h2>\\n<p>As businesses look towards 2026, leveraging strategic marketing trends becomes pivotal. By understanding and capitalizing on these opportunities, you can position your brand for substantial growth. This article explores key trends and strategic insights for the coming year.</p>\\n<h2>The Role of Strategic Marketing</h2>\\n<p>Strategic marketing involves aligning your marketing efforts with broader business goals. It helps in:</p>\\n<ul>\\n<li>Identifying growth opportunities</li>\\n<li>Differentiating from competitors</li>\\n<li>Enhancing brand visibility and market positioning</li>\\n</ul>\\n<h2>Emerging Trends and Opportunities</h2>\\n<p>2026 presents several emerging marketing trends:</p>\\n<ul>\\n<li><strong>AI Integration</strong>: Transforming customer interactions and service delivery, AI is set to redefine customer experiences.</li>\\n<li><strong>Content Personalization</strong>: Creating tailored content that resonates with specific audience segments, enhancing engagement.</li>\\n</ul>\\n<h2>Positioning Your Brand for Success</h2>\\n<p>Strategic positioning is crucial to maintain relevance:</p>\\n<ul>\\n<li>Align marketing strategies with consumer expectations and trends.</li>\\n<li>Utilize AI-powered tools to strengthen customer engagements and brand loyalty.</li>\\n</ul>\\n<h2>Analytics and Data-Driven Decisions</h2>\\n<p>Analytics play a fundamental role in strategic marketing:</p>\\n<ul>\\n<li>Use data to monitor campaign performance and adjust strategies dynamically.</li>\\n<li>Adopt a data-driven approach for predictive modeling and trend forecasting.</li>\\n</ul>\\n<h2>Conclusion</h2>\\n<p>Successful marketing in 2026 will depend on strategic positioning and data-driven insights. Embrace these trends to capitalize on opportunities and drive growth.</p>\\n<p><strong>Align your marketing strategies with emerging trends today and ensure your brand is positioned for success in the future.</strong></p>\\n<p>Best regards,<br>Your Marketing Team</p>",\n    "markdown": "## Explore How Strategic Marketing Trends Can Drive Growth in 2026\\n\\n### Introduction\\nAs businesses look towards 2026, leveraging strategic marketing trends becomes pivotal. By understanding and capitalizing on these opportunities, you can position your brand for substantial growth. This article explores key trends and strategic insights for the coming year.\\n\\n### The Role of Strategic Marketing\\nStrategic marketing involves aligning your marketing efforts with broader business goals. It helps in:\\n\\n- Identifying growth opportunities\\n- Differentiating from competitors\\n- Enhancing brand visibility and market positioning\\n\\n### Emerging Trends and Opportunities\\n2026 presents several emerging marketing trends:\\n\\n- **AI Integration**: Transforming customer interactions and service delivery, AI is set to redefine customer experiences.\\n- **Content Personalization**: Creating tailored content that resonates with specific audience segments, enhancing engagement.\\n\\n### Positioning Your Brand for Success\\nStrategic positioning is crucial to maintain relevance:\\n\\n- Align marketing strategies with consumer expectations and trends.\\n- Utilize AI-powered tools to strengthen customer engagements and brand loyalty.\\n\\n### Analytics and Data-Driven Decisions\\nAnalytics play a fundamental role in strategic marketing:\\n\\n- Use data to monitor campaign performance and adjust strategies dynamically.\\n- Adopt a data-driven approach for predictive modeling and trend forecasting.\\n\\n### Conclusion\\nSuccessful marketing in 2026 will depend on strategic positioning and data-driven insights. Embrace these trends to capitalize on opportunities and drive growth.\\n\\n**Align your marketing strategies with emerging trends today and ensure your brand is positioned for success in the future.**\\n\\nBest regards,\\nYour Marketing Team"\n}',
			},
			airtableId: "recBUctbtzWsa6idz",
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

		const res = await selectDraft(payload);
		// const res = raw;
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
