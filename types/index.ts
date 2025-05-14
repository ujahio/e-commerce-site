import { z } from "zod";
import {
	insertProductSchema,
	cartItemSchema,
	insertCartSchema,
	shippingAddressSchema,
	insertOrderItemSchema,
	insertOrderSchema,
	paymentResultSchema,
	insertReviewSchema,
} from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
	id: string;
	rating: string;
	createdAt: Date;
	numReviews: number;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
	id: string;
	createdAt: Date;
	isDelivered: boolean;
	deliveredAt: Date | null;
	orderitems: OrderItem[];
	isPaid: boolean;
	paidAt: Date | null;
	user: {
		name: string;
		email: string;
	};
};

export type PaymentResult = z.infer<typeof paymentResultSchema>;

export type Review = z.infer<typeof insertReviewSchema> & {
	id: string;
	createdAt: Date;
	user: {
		name?: string;
	};
};
