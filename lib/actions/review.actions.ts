"use server";

import { z } from "zod";
import { insertReviewSchema } from "../validators";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

export const getAllReviews = async (productId: string) => {
	const data = await prisma.review.findMany({
		where: {
			productId,
		},
		include: {
			user: {
				select: {
					name: true,
				},
			},
		},
	});

	return { data };
};

export const getReviewByProductId = async (productId: string) => {
	const session = await auth();
	if (!session) throw new Error("User not authenticated");
	const userId = session.user?.id;
	return await prisma.review.findFirst({
		where: {
			userId,
			productId,
		},
	});
};

// create and update review
export const createUpdateReview = async (
	data: z.infer<typeof insertReviewSchema>
) => {
	try {
		const session = await auth();
		if (!session) throw new Error("Use not authenticated");

		const review = insertReviewSchema.parse({
			...data,
			userId: session.user.id,
		});

		const product = await prisma.product.findFirst({
			where: {
				id: review.productId,
			},
		});

		if (!product) throw new Error("Product not found");

		// check if user already has a review
		const existingReview = await prisma.review.findFirst({
			where: {
				userId: review.userId,
				productId: review.productId,
			},
		});

		await prisma.$transaction(async (tx) => {
			if (existingReview) {
				await tx.review.update({
					where: {
						id: existingReview.id,
					},
					data: {
						title: review.title,
						description: review.description,
						rating: review.rating,
					},
				});
			} else {
				await tx.review.create({
					data: review,
				});
			}

			const avgRating = await tx.review.aggregate({
				_avg: {
					rating: true,
				},
				where: {
					productId: review.productId,
				},
			});

			const numReviews = await tx.review.count({
				where: {
					productId: review.productId,
				},
			});

			// update reviews in product table
			await tx.product.update({
				where: {
					id: review.productId,
				},
				data: {
					numReviews,
					rating: avgRating._avg.rating || 0,
				},
			});
		});

		revalidatePath(`/product/${product.slug}`);
		return {
			success: true,
			message: "Review Updated successfully",
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
};
