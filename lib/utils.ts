import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function convertToPlainObject<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

export function formatNumberWithDecimal(num: number): string {
	const [int, decimal] = num.toString().split(".");
	return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
	if (error.name === "ZodError") {
		const fieldErrors = Object.keys(error.errors)
			.map((field) => error.errors[field].message)
			.join(". ");
		return fieldErrors;
	} else if (
		error.name === "PrismaClientKnownRequestError" &&
		error.code === "P2002"
	) {
		const field = error.meta?.target ? error.meta.target[0] : "Field";
		return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
	} else {
		return typeof error.message === "string"
			? error.message
			: JSON.stringify(error.message);
	}
}

export function roundToTwoDecimalPlaces(value: number | string) {
	if (typeof value !== "number" && typeof value !== "string") {
		throw new Error("Value must be a number or string");
	}
	if (typeof value === "string") {
		return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
	}
	return Math.round((value + Number.EPSILON) * 100) / 100;
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
	currency: "USD",
	style: "currency",
	minimumFractionDigits: 2,
});

export function formatCurrency(amount: number | string | null) {
	if (typeof amount === "number") {
		return CURRENCY_FORMATTER.format(amount);
	} else if (typeof amount === "string") {
		return CURRENCY_FORMATTER.format(Number(amount));
	} else return "NaN";
}
