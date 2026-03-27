"use client";

import DraftCard from "@/components/drafts/DraftCard";
import { DraftAngle } from "@/lib/interface";
import { useEffect, useState } from "react";

export default function DraftPage() {
	const [drafts, setDrafts] = useState<DraftAngle[]>([]);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	useEffect(() => {
		const stored = localStorage.getItem("drafts");

		if (stored) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setDrafts(JSON.parse(stored) as DraftAngle[]);
		}
	}, []);

	return (
		<main className="p-10 bg-muted/40 min-h-screen">
			<h1 className="text-xl font-semibold mb-6">Choose a draft</h1>

			<div className="grid md:grid-cols-3 gap-6">
				{Array.isArray(drafts) &&
					drafts.map((draft, i) => (
						<DraftCard
							key={i}
							draft={draft}
							isSubmitting={isSubmitting}
							setIsSubmitting={setIsSubmitting}
						/>
					))}
			</div>
		</main>
	);
}
