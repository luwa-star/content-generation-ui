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

import { useState, useEffect } from "react";

type Props = {
	value?: Date;

	onChange: (date?: Date) => void;
};

export default function DateTimePicker({
	value,

	onChange,
}: Props) {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);

	const [time, setTime] = useState(value ? format(value, "HH:mm") : "");

	// combine date + time only when both exist

	useEffect(() => {
		if (!selectedDate) {
			onChange(undefined);

			return;
		}

		if (!time) {
			onChange(undefined);

			return;
		}

		const [hours, minutes] = time.split(":");

		const combined = new Date(selectedDate);

		combined.setHours(Number(hours));

		combined.setMinutes(Number(minutes));

		combined.setSeconds(0);

		onChange(combined);
	}, [selectedDate, time]);

	return (
		<div className="flex gap-3">
			{/* DATE */}

			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className={`
       w-[200px]
       justify-start
       ${!selectedDate ? "text-muted-foreground" : ""}
      `}>
						<CalendarIcon size={16} className="mr-2" />

						{selectedDate ? format(selectedDate, "PPP") : "Pick date"}
					</Button>
				</PopoverTrigger>

				<PopoverContent>
					<Calendar
						mode="single"
						selected={selectedDate}
						onSelect={setSelectedDate}
						disabled={{
							before: new Date(),
						}}
					/>
				</PopoverContent>
			</Popover>

			{/* TIME */}

			<Input
				type="time"
				value={time}
				onChange={(e) => setTime(e.target.value)}
				className={`
     w-[120px]

     ${!time ? "text-muted-foreground" : ""}
    `}
			/>
		</div>
	);
}
