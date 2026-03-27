"use client";

import DraftCard from "@/components/drafts/DraftCard";
import { responseData } from "@/lib/data";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

export default function DuplicatesPage() {
	const router = useRouter();
	const [data, setData] = useState<any | null>(null);

	useEffect(() => {
		const stored = localStorage.getItem("duplicateData");
		if (stored) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setData(JSON.parse(stored));
		}
	}, []);

	return (
		<main className="p-10 bg-muted/40 min-h-screen">
			<main className="p-10 space-y-8 bg-muted/40 min-h-screen">
				<h1 className="text-2xl font-semibold">
					Possible Duplicate Content Found
				</h1>
				<p className="text-muted-foreground">
					We found similar content already published. Review before continuing.
				</p>
				<div className="grid lg:grid-cols-2 gap-6">
					{/* NEW DRAFT */}

					<Card>
						<CardHeader>
							<CardTitle>New Draft</CardTitle>
						</CardHeader>

						<CardContent className="space-y-3">
							<h3 className="font-medium">
								{data?.newDraft?.topic || "Unknown"}
							</h3>

							<p className="text-sm whitespace-pre-wrap">
								{data?.newDraft?.idea || data?.newDraft?.url || "Unknown"}
							</p>
						</CardContent>
					</Card>

					{/* MATCHES */}

					<div className="space-y-4">
						{Array.isArray(data?.matches) &&
							data?.matches.map((match) => (
								<Card key={match.id}>
									<CardHeader>
										<div className="flex justify-between items-center">
											<CardTitle className="text-base">
												Existing Content
											</CardTitle>
										</div>
									</CardHeader>

									<CardContent>
										<h4 className="font-medium">{match?.topic || "Unknown"}</h4>

										<p className="text-sm text-muted-foreground">
											Created {match?.createdAt || "Unknown"}
										</p>

										<p className="text-sm mt-2 line-clamp-6">
											{match?.content || "Unknown"}
										</p>
									</CardContent>

									<div className="grid md:grid-cols-3 gap-6">
										{/* {Array.isArray(match.drafts) &&
										match.drafts.map((draft, i) => (
											<DraftCard key={i} draft={draft} />
										))} */}
									</div>
								</Card>
							))}
					</div>
				</div>
				{/* ACTIONS */}
				{/* dispatch old draft to memory */}
				<div className="flex gap-3">
					<Button onClick={() => router.push("/drafts")}>
						Continue Anyway
					</Button>
					{/* call webhook to regenerate */}
					<Button onClick={() => router.push("/drafts")}>Regenerate</Button>
					{/*delete new entry*/}
					<Button variant="outline" onClick={() => router.back()}>
						Cancel
					</Button>
				</div>
			</main>
		</main>
	);
}
