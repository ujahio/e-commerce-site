export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "PRO STORE";
export const APP_DESCRIPTION =
	process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
	"Modern ecommerce store generated using Next.js";
export const SERVER_URL =
	process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT =
	Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const shippingAddressDefaultValues = {
	fullName: "",
	streetAddress: "",
	city: "",
	postalCode: "",
	country: "",
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
	? process.env.PAYMENT_METHODS.split(", ")
	: ["PayPal", "Stripe", "CashOnDelivery"];

export const DEFAULT_PAYMENT_METHOD =
	process.env.DEFAULT_PAYMENT_METHOD || "PayPal";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

export const productDefaultValues = {
	name: "",
	slug: "",
	images: [],
	brand: "",
	price: "0",
	description: "",
	stock: 0,
	rating: "0",
	category: "",
	numReviews: "0",
	isFeatured: false,
	banner: null,
};

export const USER_ROLES = process.env.USER_ROLES
	? process.env.USER_ROLES.split(", ")
	: ["user", "admin"];

export const reviewFormDefaultValues = {
	title: "",
	rating: 0,
	comment: "",
};

export const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev";
