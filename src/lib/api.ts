import axios from "axios";
import {
	ContentInput,
	PublishPayload,
	SchedulePayload,
	SelectDraftPayload,
} from "./schema";
import { GenerateDraftRes, PublishRes, SelectDraftRes } from "./interface";

export const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_WEBHOOK_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const generateDrafts = async (data: ContentInput) => {
	try {
		const response = await axiosInstance.post("?content=generate", data);

		return response.data as GenerateDraftRes;
	} catch (error: any) {
		console.error("generation failed", error.response?.data);
		return error.response?.data as GenerateDraftRes;
	}
};

export const selectDraft = async (data: SelectDraftPayload) => {
	try {
		const response = await axiosInstance.post("?content=select_draft", data);

		return response.data as SelectDraftRes;
	} catch (error: any) {
		console.error("generation failed", error.response?.data);
		return error.response?.data as SelectDraftRes;
	}
};

export const publishContent = async (data: PublishPayload) => {
	try {
		const response = await axiosInstance.post(
			"?content=publish&time=now",
			data,
		);
		return response.data as PublishRes;
	} catch (error: any) {
		console.error("publish failed", error.response?.data);
		return error.response?.data as PublishRes;
	}
};

export const scheduleContent = async (data: SchedulePayload) => {
	try {
		const response = await axiosInstance.post(
			"?content=publish&time=later",
			data,
		);
		return response.data as PublishRes;
	} catch (error: any) {
		console.error("schedule failed", error.response?.data);
		return error.response?.data as PublishRes;
	}
};
