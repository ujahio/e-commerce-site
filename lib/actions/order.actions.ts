"use server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { getUserById } from "./user.action";
import { getMyCart } from "./cart.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";

export const createOrder = async () => {
	try {
		const session = await auth();
		if (!session) throw new Error("User is not authenticated");
		const userId = session?.user?.id;
		if (!userId) throw new Error("User not found");
		const user = await getUserById(userId);

		const cart = await getMyCart();
		if (!cart || cart.items.length === 0) {
			return {
				success: false,
				message: "Your Cart is empty",
				redirectTo: "/cart",
			};
		}

		if (!user.address) {
			return {
				success: false,
				message: "No shipping address found",
				redirectTo: "/shipping-address",
			};
		}

		if (!user.paymentMethod) {
			return {
				success: false,
				message: "No payment method found",
				redirectTo: "/payment-method",
			};
		}

		const order = insertOrderSchema.parse({
			userId: user.id,
			shippingAddress: user.address,
			paymentMethod: user.paymentMethod,
			itemsPrice: cart.itemsPrice,
			shippingPrice: cart.shippingPrice,
			taxPrice: cart.taxPrice,
			totalPrice: cart.totalPrice,
		});

		const insertedOrderId = await prisma.$transaction(async (tx) => {
			// create the order
			const insertedOrder = await tx.order.create({
				data: order,
			});

			// create order items
			for (const item of cart.items as CartItem[]) {
				await tx.orderItem.create({
					data: {
						...item,
						orderId: insertedOrder.id,
						price: item.price,
					},
				});
			}

			// clear cart
			await tx.cart.update({
				where: { id: cart.id },
				data: {
					items: [],
					itemsPrice: 0,
					shippingPrice: 0,
					taxPrice: 0,
					totalPrice: 0,
				},
			});
			return insertedOrder.id;
		});

		if (!insertedOrderId) throw new Error("Order not created");

		return {
			success: true,
			message: "Order created successfully",
			redirectTo: `/order/${insertedOrderId}`,
		};
	} catch (err) {
		if (isRedirectError(err)) throw err;
		return {
			success: false,
			message: formatError(err),
		};
	}
};
