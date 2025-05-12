import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

export const currency = z.string().refine((val) => {
	return /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(val)));
}, "Price must be a valid number with two decimal places");

// Schema for inserting products
export const insertProductSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters"),
	slug: z.string().min(3, "Slug must be at least 3 characters"),
	category: z.string().min(3, "Category must be at least 3 characters"),
	brand: z.string().min(3, "Brand must be at least 3 characters"),
	description: z.string().min(3, "Description must be at least 3 characters"),
	stock: z.coerce.number(),
	images: z.array(z.string()).min(1, "Product must have at least one image"),
	isFeatured: z.boolean(),
	banner: z.string().nullable(),
	price: currency,
});

// Schema for updating products
export const updateProductSchema = insertProductSchema.extend({
	id: z.string().min(1, "Id is required"),
});
export const signInFormSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpFormSchema = z
	.object({
		name: z.string().min(3, "Name must be at least 3 characters"),
		email: z.string().email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z
			.string()
			.min(6, "Confirm Password must be at least 6 characters"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const cartItemSchema = z.object({
	productId: z.string().min(1, "Product ID is required"),
	name: z.string().min(1, "Product name is required"),
	slug: z.string().min(1, "Product slug is required"),
	qty: z.number().nonnegative("Quantity must be a positive number"),
	image: z.string().min(1, "Product image is required"),
	price: currency,
});

export const insertCartSchema = z.object({
	items: z.array(cartItemSchema),
	itemsPrice: currency,
	totalPrice: currency,
	shippingPrice: currency,
	taxPrice: currency,
	sessionCartId: z.string().min(1, "Session cart ID is required"),
	userId: z.string().optional().nullable(),
});

export const shippingAddressSchema = z.object({
	fullName: z.string().min(3, "Full name must be at least 3 characters"),
	streetAddress: z
		.string()
		.min(3, "Street Addrerss should be at least 3 characters"),
	city: z.string().min(3, "City must be at least 3 characters"),
	postalCode: z.string().min(3, "Postal Code must be at least 3 characters"),
	country: z.string().min(3, "country must be at least 3 characters"),
	lat: z.number().optional(),
	lng: z.number().optional(),
});

export const paymentMethodSchema = z
	.object({
		type: z.string().min(1, "Payment method type is required"),
	})
	.refine((data) => {
		return (
			PAYMENT_METHODS.includes(data.type),
			{
				path: ["type"],
				message: "Invalid payment method type",
			}
		);
	});

export const insertOrderSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
	itemsPrice: currency,
	shippingPrice: currency,
	taxPrice: currency,
	totalPrice: currency,
	paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
		message: "Invalid payment method",
	}),
	shippingAddress: shippingAddressSchema,
});

export const insertOrderItemSchema = z.object({
	productId: z.string(),
	name: z.string(),
	slug: z.string(),
	image: z.string(),
	price: currency,
	qty: z.number(),
});

export const paymentResultSchema = z.object({
	id: z.string(),
	status: z.string(),
	price_paid: z.string(),
	email_address: z.string(),
});

export const updateUserProfileSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters"),
	email: z.string().email("Invalid email address").min(3),
});
