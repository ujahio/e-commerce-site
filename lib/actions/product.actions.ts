"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { prisma } from "@/db/prisma";
import { insertProductSchema, updateProductSchema } from "../validators";
import { Prisma } from "../generated/prisma";

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

export const getProductById = async (productId: string) => {
	const data = await prisma.product.findFirst({
		where: {
			id: productId,
		},
	});

	return convertToPlainObject(data);
};

export const getAllProducts = async ({
	query,
	limit = PAGE_SIZE,
	page,
	category,
	price,
	rating,
}: // sort,
{
	query: string;
	limit?: number;
	page: number;
	category?: string;
	price?: string;
	rating?: string;
	sort?: string;
}) => {
	// Query filter
	const queryFilter: Prisma.ProductWhereInput =
		query && query !== "all"
			? {
					name: {
						contains: query,
						mode: "insensitive",
					} as Prisma.StringFilter,
			  }
			: {};

	const categoryFilter: Prisma.ProductWhereInput =
		category && category !== "all" ? { category } : {};

	const priceFilter: Prisma.ProductWhereInput =
		price && price !== "all"
			? {
					price: {
						gte: Number(price.split("-")[0]),
						lte: Number(price.split("-")[1]),
					},
			  }
			: {};

	const ratingFilter: Prisma.ProductWhereInput =
		rating && rating !== "all"
			? {
					rating: {
						gte: Number(rating),
					},
			  }
			: {};

	const data = await prisma.product.findMany({
		where: {
			...queryFilter,
			...categoryFilter,
			...priceFilter,
			...ratingFilter,
		},
		orderBy: {
			createdAt: "desc",
		},
		skip: (page - 1) * limit,
		take: limit,
	});

	const dataCount = await prisma.product.count();

	return {
		data,
		totalPages: Math.ceil(dataCount / limit),
	};
};

export const deleteProduct = async (id: string) => {
	try {
		const productExists = await prisma.product.findFirst({
			where: {
				id,
			},
		});

		if (!productExists) throw new Error("Product not found");

		await prisma.product.delete({
			where: {
				id,
			},
		});

		revalidatePath("/admin/products");

		return {
			message: "Product deleted successfully",
			success: true,
		};
	} catch (error) {
		return {
			message: formatError(error),
			success: false,
		};
	}
};

export const createProduct = async (
	data: z.infer<typeof insertProductSchema>
) => {
	try {
		const product = insertProductSchema.parse(data);
		await prisma.product.create({
			data: product,
		});
		revalidatePath("/admin/products");

		return {
			success: true,
			message: "Product created successfully",
		};
	} catch (error) {
		return {
			message: formatError(error),
			success: false,
		};
	}
};

export const updateProduct = async (
	data: z.infer<typeof updateProductSchema>
) => {
	try {
		const product = updateProductSchema.parse(data);

		const productExists = await prisma.product.findFirst({
			where: {
				id: product.id,
			},
		});

		if (!productExists) throw new Error("Product not found");

		await prisma.product.update({
			where: {
				id: product.id,
			},
			data: product,
		});
		revalidatePath("/admin/products");

		return {
			success: true,
			message: "Product updated successfully",
		};
	} catch (error) {
		return {
			message: formatError(error),
			success: false,
		};
	}
};

export const getFeaturedProducts = async () => {
	const data = await prisma.product.findMany({
		where: { isFeatured: true },
		orderBy: { createdAt: "desc" },
		take: 4,
	});

	return convertToPlainObject(data);
};

export const getAllCategories = async () => {
	const data = await prisma.product.groupBy({
		by: ["category"],
		_count: true,
	});

	return data;
};
