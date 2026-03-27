export const targetAudienceOptions = [
	"Founders & Entrepreneurs",

	"Startup Teams",

	"Product Managers",

	"Marketing Managers",

	"Growth Marketers",

	"Content Marketers",

	"SEO Specialists",

	"Social Media Managers",

	"Brand Strategists",

	"Business Executives",

	"B2B Decision Makers",

	"Consultants",

	"Agency Owners",

	"Freelancers",

	"Developers",

	"Tech Leads",

	"SaaS Companies",

	"Ecommerce Businesses",

	"Small Business Owners",

	"Enterprise Teams",

	"Investors",

	"General Business Audience",
];

export const platformOptions = [
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
export interface GenerateDraftRes {
	success: boolean;
	message: string;
	type?: "new" | "duplicate" | "error" | string;
	code?: number;
	status?: number;
	data?: {
		drafts: DraftAngle[];
		airtableId: string;
		tone: string;
		audience: string;
		topic: string;
	};
}
export interface DraftAngle {
	angle: string;
	title: string;
	metaDescription: string;
	outline: string[];
	article_markdown: string;
	cta?: string;
	keywords: string[];
}

export interface SelectDraftRes {
	success: boolean;
	message: string;
	type?: "new" | "duplicate" | "error" | string;
	code?: number;
	status?: number;
	data?: SelectDraftData;
}
export interface SelectDraftData {
	draft: PlatformPreview;
	airtableId: string;
	topic: string;
}
export interface PlatformPreview {
	x: string;
	linkedIn: string;
	email: string;
}

export type TweetData = {
	tweets: string[];
};

export type LinkedInData = {
	post_text: string;
	post_markdown: string;
};

export type EmailData = {
	subject: string;
	previewText: string;
	html: string;
	markdown: string;
};

export interface PublishRes {
	success: boolean;
	message: string;
	type?: "new" | "duplicate" | "error" | string;
	code?: number;
	status?: number;
	platforms?: string[];
	hasError?: boolean;
	errors?: string[] | string;
	recordID?: string;
}
