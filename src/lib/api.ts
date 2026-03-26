import axios from "axios";
import { ContentInput } from "./schema";

export const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_WEBHOOK_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const generateDrafts = async (data: ContentInput) => {
	try {
		const response = await axiosInstance.post("?content=generate", data);

		return response.data;
	} catch (error: any) {
		console.error("generation failed", error.response?.data);
		return error.response?.data;
	}
};

export const selectDraft = async (data: any) => {
	try {
		const response = await axiosInstance.post("?content=select_draft", data);

		return response.data;
	} catch (error: any) {
		console.error("generation failed", error.response?.data);
		return error.response?.data;
	}
};

export const publishContent = async (data: any) => {
	try {
		const response = await axiosInstance.post(
			"?content=publish&time=now",
			data,
		);
		return response.data;
	} catch (error: any) {
		console.error("publish failed", error.response?.data);
		return error.response?.data;
	}
};

export const scheduleContent = async (data: any) => {
	try {
		const response = await axiosInstance.post(
			"?content=publish&time=later",
			data,
		);
		return response.data;
	} catch (error: any) {
		console.error("schedule failed", error.response?.data);
		return error.response?.data;
	}
};
