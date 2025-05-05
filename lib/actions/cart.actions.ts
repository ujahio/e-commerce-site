"use server";

import { cookies } from "next/headers";
import { CartItem } from "@/types";
import {
	convertToPlainObject,
	formatError,
	roundToTwoDecimalPlaces,
} from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "../generated/prisma";

const calcPrice = (items: CartItem[]) => {
	const itemsPrice = roundToTwoDecimalPlaces(
		items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
	);
	const shippingPrice = roundToTwoDecimalPlaces(itemsPrice > 100 ? 0 : 10);
	const taxPrice = roundToTwoDecimalPlaces(itemsPrice * 0.15);
	const totalPrice = roundToTwoDecimalPlaces(
		itemsPrice + shippingPrice + taxPrice
	);

	return {
		itemsPrice: itemsPrice.toFixed(2),
		shippingPrice: shippingPrice.toFixed(2),
		taxPrice: taxPrice.toFixed(2),
		totalPrice: totalPrice.toFixed(2),
	};
};

export const getMyCart = async () => {
	const session = await auth();

	const sessionCartId = (await cookies()).get("sessionCartId")?.value;

	if (!sessionCartId) {
		throw new Error("Cart session not found");
	}

	const userId = session?.user?.id ? session.user.id : undefined;

	const cart = await prisma.cart.findFirst({
		where: userId ? { userId } : { sessionCartId },
	});

	if (!cart) return undefined;

	return convertToPlainObject({
		...cart,
		items: cart.items as CartItem[],
		itemsPrice: cart.itemsPrice.toString(),
		totalPrice: cart.totalPrice.toString(),
		shippingPrice: cart.shippingPrice.toString(),
		taxPrice: cart.taxPrice.toString(),
	});
};

export const addItemToCart = async (data: CartItem) => {
	try {
		const sessionCartId = (await cookies()).get("sessionCartId")?.value;

		if (!sessionCartId) {
			throw new Error("Cart session not found");
		}

		const session = await auth();
		const userId = session?.user?.id ? (session.user.id as string) : undefined;
		const cart = await getMyCart();

		const item = cartItemSchema.parse(data);

		const product = await prisma.product.findFirst({
			where: {
				id: item.productId,
			},
		});

		if (!product) {
			throw new Error("Product not found");
		}

		if (!cart) {
			const newCart = insertCartSchema.parse({
				userId,
				items: [item],
				sessionCartId,
				...calcPrice([item]),
			});

			await prisma.cart.create({
				data: {
					...newCart,
					userId: newCart.userId ?? undefined,
				},
			});

			revalidatePath(`/product/${product.slug}`);

			return {
				success: true,
				message: `${product.name} added to cart`,
			};
		} else {
			const existingItem = (cart.items as CartItem[]).find(
				(x) => x.productId === item.productId
			);

			if (existingItem) {
				// check the stock
				if (product.stock < existingItem.qty + 1) {
					throw new Error("Not enough stock");
				}

				// increase the quantity
				(cart.items as CartItem[]).find(
					(x) => x.productId === item.productId
				)!.qty = existingItem.qty + 1;
			} else {
				// check the stock

				if (product.stock < 1) {
					throw new Error("Not enough stock");
				}

				cart.items.push(item);
			}

			await prisma.cart.update({
				where: {
					id: cart.id,
				},
				data: {
					items: cart.items as Prisma.CartUpdateitemsInput[],
					...calcPrice(cart.items as CartItem[]),
				},
			});

			revalidatePath(`/product/${product.slug}`);

			return {
				success: true,
				message: `${product.name} ${
					existingItem ? "updated in" : "added to"
				} cart`,
			};
		}
	} catch (err) {
		return {
			success: false,
			message: formatError(err),
		};
	}
};

export const removeItemFromCart = async (productId: string) => {
	try {
		const sessionCartId = (await cookies()).get("sessionCartId")?.value;

		if (!sessionCartId) {
			throw new Error("Cart session not found");
		}

		const product = await prisma.product.findFirst({
			where: {
				id: productId,
			},
		});

		if (!product) {
			throw new Error("Product not found");
		}

		const cart = await getMyCart();
		if (!cart) {
			throw new Error("Cart not found");
		}

		const existingItem = (cart.items as CartItem[]).find(
			(x) => x.productId === productId
		);

		if (!existingItem) {
			throw new Error("Item not found in cart");
		}

		// check if item is only one
		if (existingItem.qty === 1) {
			cart.items = (cart.items as CartItem[]).filter(
				(x) => x.productId !== existingItem.productId
			);
		} else {
			(cart.items as CartItem[]).find(
				(x) => x.productId === existingItem.productId
			)!.qty = existingItem.qty - 1;
		}

		await prisma.cart.update({
			where: {
				id: cart.id,
			},
			data: {
				items: cart.items as Prisma.CartUpdateitemsInput[],
				...calcPrice(cart.items as CartItem[]),
			},
		});

		revalidatePath(`/product/${product.slug}`);

		return {
			success: true,
			message: `${product.name} was removed from cart`,
		};
	} catch (err) {
		return {
			success: false,
			message: formatError(err),
		};
	}
};
