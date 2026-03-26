"use client";

import { format } from "date-fns";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { CalendarIcon } from "lucide-react";

import { useState } from "react";

type Props = {
	value?: Date;

	onChange: (date?: Date) => void;
};

export default function DateTimePicker({ value, onChange }: Props) {
	const [time, setTime] = useState(value ? format(value, "HH:mm") : "");

	const updateDate = (date?: Date) => {
		if (!date) return;

		const [hours, minutes] = time.split(":");

		const newDate = new Date(date);

		newDate.setHours(Number(hours || 0));

		newDate.setMinutes(Number(minutes || 0));

		onChange(newDate);
	};

	const updateTime = (timeValue: string) => {
		setTime(timeValue);

		if (!value) return;

		const [hours, minutes] = timeValue.split(":");

		const newDate = new Date(value);

		newDate.setHours(Number(hours));

		newDate.setMinutes(Number(minutes));

		onChange(newDate);
	};

	return (
		<div className="flex gap-3">
			{/* date */}

			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outline" className="w-[200px] justify-start">
						<CalendarIcon size={16} className="mr-2" />

						{value ? format(value, "PPP") : "Pick date"}
					</Button>
				</PopoverTrigger>

				<PopoverContent>
					<Calendar
						mode="single"
						selected={value}
						onSelect={updateDate}
						disabled={{
							before: new Date(),
						}}
					/>
				</PopoverContent>
			</Popover>

			{/* time */}

			<Input
				type="time"
				value={time}
				onChange={(e) => updateTime(e.target.value)}
				className="w-[120px]"
			/>
		</div>
	);
}
