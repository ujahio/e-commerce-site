"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Cart, CartItem } from "@/types";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Minus, Plus, Loader } from "lucide-react";

const AddToCart = ({ cart, item }: { item: CartItem; cart?: Cart }) => {
	const router = useRouter();

	const [isPending, startTransition] = useTransition();

	const handleAddToCart = async () => {
		startTransition(async () => {
			const res = await addItemToCart(item);

			if (!res.success) {
				toast.error(res.message);
				return;
			}

			toast(res.message, {
				action: {
					label: "Go To Cart",
					onClick: () => {
						router.push("/cart");
					},
				},
			});
		});
	};

	const existingItem = cart?.items.find(
		(x: CartItem) => x.productId === item.productId
	);

	const handleRemoveFromCart = async () => {
		startTransition(async () => {
			const res = await removeItemFromCart(item.productId);
			if (!res.success) {
				toast.error(res.message);
				return;
			}

			toast.success(res.message);
		});
	};

	return (
		<div className="flex items-center">
			{existingItem ? (
				<>
					<Button
						type="button"
						variant="outline"
						onClick={handleRemoveFromCart}
					>
						{isPending ? (
							<Loader className="h-4 w-4 animate-spin" />
						) : (
							<Minus className="h-4 w-4" />
						)}
					</Button>
					<span className="px-2">{existingItem.qty}</span>
					<Button type="button" variant="outline" onClick={handleAddToCart}>
						{isPending ? (
							<Loader className="h-4 w-4 animate-spin" />
						) : (
							<Plus className="h-4 w-4" />
						)}
					</Button>
				</>
			) : (
				<Button className="w-full" type="button" onClick={handleAddToCart}>
					{isPending ? (
						<Loader className="h-4 w-4 animate-spin" />
					) : (
						<Plus className="h-4 w-4" />
					)}{" "}
					Add To Cart
				</Button>
			)}
		</div>
	);
};

export default AddToCart;
