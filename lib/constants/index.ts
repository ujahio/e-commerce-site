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
