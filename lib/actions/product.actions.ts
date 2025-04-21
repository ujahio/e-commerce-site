"use server";

import { PrismaClient } from "@/lib/generated/prisma/client";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

export const getLatestProducts = async () => {
	const prisma = new PrismaClient();
	const data = await prisma.product.findMany({
		take: LATEST_PRODUCTS_LIMIT,
		orderBy: {
			createdAt: "desc",
		},
	});

	console.log("products", data);
	return convertToPlainObject(data);
};
