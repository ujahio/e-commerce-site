"use server";

import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { prisma } from "@/db/prisma";

export const getLatestProducts = async () => {
	const data = await prisma.product.findMany({
		take: LATEST_PRODUCTS_LIMIT,
		orderBy: {
			createdAt: "desc",
		},
	});
	return convertToPlainObject(data);
};

export const getProductBySlug = async (slug: string) => {
	const data = await prisma.product.findFirst({
		where: {
			slug: slug,
		},
	});

	return data;
};
