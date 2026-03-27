import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MarkdownViewer from "../markdown/MarkdownViewer";
import { EmailData } from "@/lib/interface";

interface Props {
	title: string;
	content: string | string[];
	type: "x" | "linkedIn" | "email";
	emailProps?: EmailData;
}
export default function ChannelPreview({
	title,
	content,
	emailProps,
	type,
}: Props) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>

			<CardContent className="space-y-2">
				{type === "linkedIn" && (
					<div className="whitespace-pre-wrap">{content}</div>
				)}
				{type === "x" &&
					Array.isArray(content) &&
					content.map((tweet, index) => (
						<div key={index} className="border rounded-xl p-3">
							{tweet}
						</div>
					))}
				{type === "email" && (
					<div>
						<p className="font-semibold text-xl">
							Subject: {emailProps?.subject}
						</p>
						<p className="font-semibold text-xl">Body:</p>

						<MarkdownViewer content={content as string} />
					</div>
				)}
			</CardContent>
		</Card>
	);
}
