import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

export const currency = z.string().refine((val) => {
	return /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(val)));
}, "Price must be a valid number with two decimal places");

// Schema for inserting products
export const insertProductSchema = z.object({
	name: z.string().min(3, { message: "Name must be at least 3 characters" }),
	slug: z.string().min(3, { message: "Slug must be at least 3 characters" }),
	category: z
		.string()
		.min(3, { message: "Category must be at least 3 characters" }),
	description: z
		.string()
		.min(3, { message: "Description must be at least 3 characters" }),
	stock: z.coerce.number(),
	images: z.array(z.string()).min(1, "Product must have at least one image"),
	isFeatured: z.boolean(),
	banner: z.string().nullable(),
	price: currency,
});
