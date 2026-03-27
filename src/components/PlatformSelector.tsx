"use client";

import { Checkbox } from "@/components/ui/checkbox";

import { Label } from "@/components/ui/label";

type Props = {
	value: string[];

	onChange: (value: string[]) => void;
};

const options = [
	{
		label: "LinkedIn",
		value: "linkedin",
	},

	{
		label: "X (Twitter)",
		value: "twitter",
	},

	{
		label: "Email Newsletter",
		value: "email",
	},
];

export default function PlatformSelector({
	value,

	onChange,
}: Props) {
	const toggle = (platform: string) => {
		if (value.includes(platform)) {
			onChange(value.filter((p) => p !== platform));
		} else {
			onChange([...value, platform]);
		}
	};

	return (
		<div className="space-x-3 flex justify-start items-center">
			{options.map((option) => (
				<div key={option.value} className="flex items-center gap-2">
					<Checkbox
						checked={value.includes(option.value)}
						onCheckedChange={() => toggle(option.value)}
					/>

					<Label>{option.label}</Label>
				</div>
			))}
		</div>
	);
}
