"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { Plus } from "lucide-react";

const AddToCart = ({ item }: { item: CartItem }) => {
	const router = useRouter();

	const handleAddToCart = async () => {
		const res = await addItemToCart(item);

		if (!res.success) {
			toast.error(res.message);
			return;
		}

		toast(`${item.name} added to cart`, {
			action: {
				label: "Go To Cart",
				onClick: () => {
					router.push("/cart");
				},
			},
		});
	};
	return (
		<>
			<Button className="w-full" type="button" onClick={handleAddToCart}>
				<Plus /> Add To Cart
			</Button>
		</>
	);
};

export default AddToCart;
