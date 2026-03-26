import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MarkdownViewer from "../markdown/MarkdownViewer";

export default function ChannelPreview({ title, content, emailProps }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>

			<CardContent>
				{/* <p className="text-sm whitespace-pre-wrap">

          {content}

        </p> */}
				{title.toLowerCase() === "email" && (
					<div>
						<p className="font-extrabold">Subject: {emailProps.subject}</p>
						<p className="font-extrabold">
							Preview Text: {emailProps.previewText}
						</p>
						<p className="text-sm font-extrabold">Body:</p>
					</div>
				)}

				<MarkdownViewer content={content} />
			</CardContent>
		</Card>
	);
}
