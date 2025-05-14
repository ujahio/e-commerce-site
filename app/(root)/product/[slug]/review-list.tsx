"use client";
import { Review } from "@/types";
import Link from "next/link";
import { useState, useEffect } from "react";
import ReviewForm from "./review-form";
import { getAllReviews } from "@/lib/actions/review.actions";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Rating from "@/components/shared/product/rating";

const ReviewList = ({
	userId,
	productId,
	productSlug,
}: {
	userId: string;
	productId: string;
	productSlug: string;
}) => {
	const [reviews, setReviews] = useState<Review[]>([]);
	useEffect(() => {
		const loadReviews = async () => {
			const res = await getAllReviews(productId);
			setReviews(res.data);
		};

		loadReviews();
	}, [productId]);

	const reload = async () => {
		const res = await getAllReviews(productId);
		setReviews([...res.data]);
	};
	return (
		<div className="space-y-4">
			{reviews.length === 0 && <div>No reviews yet</div>}
			{userId ? (
				<ReviewForm
					userId={userId}
					productId={productId}
					onReviewSubmitted={reload}
				/>
			) : (
				<div>
					Please
					<Link
						className="text-blue-700 px-2"
						href={`/sign-in?callbackUrl=/product/${productSlug}`}
					>
						sign In
					</Link>
					to write a review
				</div>
			)}
			<div className="flex flex-col gap-3">
				{reviews.map((re) => (
					<Card key={re.id}>
						<CardHeader>
							<div className="flex justify-between">
								<CardTitle>{re.title}</CardTitle>
							</div>
							<CardDescription>{re.description}</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="text-muted-foreground flex space-x-4 text-sm">
								<Rating value={re.rating} />
								<div className="flex items-center">
									<User className="mr-1 h-3 w-3" />
									{re.user ? re.user.name : "User"}
								</div>
								<div className="flex items-center">
									<Calendar className="mr-1 h-3 w-3" />
									{formatDateTime(re.createdAt).dateTime}
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
};
export default ReviewList;
