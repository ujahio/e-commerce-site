"use client";
import Link from "next/link";
import { useTransition } from "react";
import { ArrowRight, Loader, MinusIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { removeItemFromCart, addItemToCart } from "@/lib/actions/cart.actions";
import { formatCurrency } from "@/lib/utils";
import { Cart } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

const CartTable = ({ cart }: { cart?: Cart }) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	return (
		<>
			<h1 className="py-4 h2-bold">Shopping Cart</h1>
			{!cart || cart.items.length === 0 ? (
				<div className="">
					Cart is empty <Link href="/">Go Shopping</Link>
				</div>
			) : (
				<div className="grid md:grid-cols-4 md:gap-5">
					<div className="overflow-x-auto md:col-span-3">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Items</TableHead>
									<TableHead className="text-center">Quantity</TableHead>
									<TableHead className="text-right">Price</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{cart.items.map((item) => (
									<TableRow key={item.slug}>
										<TableCell>
											<Link
												href={`/product/${item.slug}`}
												className="flex items-center"
											>
												<Image
													src={item.image}
													alt={item.name}
													width="50"
													height="50"
												/>
												<span className="px-2">{item.name}</span>
											</Link>
										</TableCell>
										<TableCell className="flex-center gap-2 mt-2.5">
											<Button
												disabled={isPending}
												variant="outline"
												type="button"
												onClick={() =>
													startTransition(async () => {
														const res = await removeItemFromCart(
															item.productId
														);
														if (!res.success) {
															toast.error(res.message);
														}
													})
												}
											>
												{isPending ? (
													<Loader className="w-4 h-4 animate-spin" />
												) : (
													<MinusIcon className="w-4 h-4" />
												)}
											</Button>
											<span className="">{item.qty}</span>
											<Button
												disabled={isPending}
												variant="outline"
												type="button"
												onClick={() =>
													startTransition(async () => {
														const res = await addItemToCart(item);
														if (!res.success) {
															toast.error(res.message);
														}
													})
												}
											>
												{isPending ? (
													<Loader className="w-4 h-4 animate-spin" />
												) : (
													<PlusIcon className="w-4 h-4" />
												)}
											</Button>
										</TableCell>
										<TableCell className="text-right">${item.price}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<Card>
						<CardContent className="p-4 gap-4">
							<div className="pb-3 text-xl">
								Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)}):{" "}
								<span className="font-bold">
									{formatCurrency(cart.itemsPrice)}
								</span>
							</div>
							<Button
								className="w-full"
								disabled={isPending}
								onClick={() =>
									startTransition(() => router.push("/shipping-address"))
								}
							>
								{isPending ? (
									<Loader className="w-4 h-4 animate-spin" />
								) : (
									<ArrowRight className="w-4 h-4" />
								)}{" "}
								Proceed to Checkout
							</Button>
						</CardContent>
					</Card>
				</div>
			)}
		</>
	);
};

export default CartTable;
