"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { prisma } from "@/db/prisma";
import { insertProductSchema, updateProductSchema } from "../validators";

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

export const getAllProducts = async ({
	query,
	limit = PAGE_SIZE,
	page,
	category,
}: {
	query: string;
	limit?: number;
	page: number;
	category?: string;
}) => {
	const data = await prisma.product.findMany({
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
