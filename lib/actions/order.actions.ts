"use server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getUserById } from "./user.action";
import { getMyCart } from "./cart.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem, PaymentResult } from "@/types";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";

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

export const getOrderById = async (orderId: string) => {
	const data = await prisma.order.findFirst({
		where: {
			id: orderId,
		},
		include: {
			orderitems: true,
			user: { select: { name: true, email: true } },
		},
	});

	return convertToPlainObject(data);
};

export const createPayPalOrder = async (orderId: string) => {
	try {
		const order = await prisma.order.findFirst({
			where: {
				id: orderId,
			},
		});

		if (!order) {
			throw new Error("Order not found");
		}

		// create paypal order
		const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

		await prisma.order.update({
			where: {
				id: orderId,
			},
			data: {
				paymentResult: {
					id: paypalOrder.id,
					email_address: "",
					status: "",
					pricePaid: 0,
				},
			},
		});

		return {
			success: true,
			message: "PayPal order created",
			data: paypalOrder.id,
		};
	} catch (err) {
		return {
			success: false,
			message: formatError(err),
		};
	}
};

export const approvePayPalOrder = async (
	orderId: string,
	orderData: { orderID: string }
) => {
	try {
		const order = await prisma.order.findFirst({
			where: {
				id: orderId,
			},
		});

		if (!order) {
			throw new Error("Order not found");
		}

		const capturedPaymentData = await paypal.capturePayment(orderData.orderID);

		if (
			!capturedPaymentData ||
			capturedPaymentData.id !== (order.paymentResult as PaymentResult)?.id ||
			capturedPaymentData.status !== "COMPLETED"
		) {
			throw new Error("Error in paypal payment");
		}

		// update order with payment result
		await updateOrderToPaid({
			orderId,
			paymentResult: {
				id: capturedPaymentData.id,
				status: capturedPaymentData.status,
				email_address: capturedPaymentData.payer.email_address,
				price_paid:
					capturedPaymentData.purchase_units[0]?.payments?.captures[0]?.amount
						?.value,
			},
		});

		revalidatePath(`/order/${orderId}`);

		return {
			success: true,
			message: "Your order has been paid",
		};
	} catch (err) {
		return {
			success: false,
			message: formatError(err),
		};
	}
};

const updateOrderToPaid = async ({
	orderId,
	paymentResult,
}: {
	orderId: string;
	paymentResult: PaymentResult;
}) => {
	try {
		const order = await prisma.order.findFirst({
			where: { id: orderId },
			include: { orderitems: true },
		});

		if (!order) {
			throw new Error("Order not found");
		}

		if (order.isPaid) {
			throw new Error("Order is already paid");
		}

		await prisma.$transaction(async (tx) => {
			for (const item of order.orderitems) {
				await tx.product.update({
					where: { id: item.productId },
					data: {
						stock: {
							increment: -item.qty,
						},
					},
				});
			}

			await tx.order.update({
				where: { id: orderId },
				data: {
					isPaid: true,
					paidAt: new Date(),
					paymentResult,
				},
			});
		});

		const updatedOrder = await prisma.order.findFirst({
			where: { id: orderId },
			include: {
				orderitems: true,
				user: { select: { name: true, email: true } },
			},
		});

		if (!updatedOrder) {
			throw new Error("Order not found");
		}
	} catch (err) {
		throw new Error("Error updating order to paid");
	}
};

export const getMyOrders = async ({
	limit = PAGE_SIZE,
	page,
}: {
	limit?: number;
	page: number;
}) => {
	const session = await auth();
	if (!session) throw new Error("User is not authenticated");
	const userId = session?.user?.id;
	if (!userId) throw new Error("User not found");
	const orders = await prisma.order.findMany({
		where: {
			userId: session.user?.id,
		},
		orderBy: {
			createdAt: "desc",
		},
		take: limit,
		skip: (page - 1) * limit,
	});

	const dataCount = await prisma.order.count({
		where: {
			userId: session.user?.id,
		},
	});

	return {
		data: orders,
		totalPages: Math.ceil(dataCount / limit),
	};
};
