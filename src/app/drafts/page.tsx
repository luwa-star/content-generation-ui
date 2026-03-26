"use client";

import DraftCard from "@/components/drafts/DraftCard";
import { responseData } from "@/lib/data";
import { useEffect, useState } from "react";

export default function DraftPage() {
	const [drafts, setDrafts] = useState<any[]>([]);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	useEffect(() => {
		const stored = localStorage.getItem("drafts");

		if (stored) {
			setDrafts(JSON.parse(stored));
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
