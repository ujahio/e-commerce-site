"use server";

import { CartItem } from "@/types";

export const addItemToCart = async (item: CartItem) => {
	console.log("Adding item to cart:", item);
	return {
		success: true,
		message: "Item added to cart",
	};
};
