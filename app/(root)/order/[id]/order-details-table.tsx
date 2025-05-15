"use client";

import { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
	PayPalButtons,
	PayPalScriptProvider,
	usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import {
	approvePayPalOrder,
	createPayPalOrder,
	deliverOrder,
	updateOrderToPaidCOD,
} from "@/lib/actions/order.actions";
import { Button } from "@/components/ui/button";
import StripePayment from "./stripe-payment";

const OrderDetailsTable = ({
	order,
	paypalClientId,
	stripeClientSecret,
	isAdmin,
}: {
	order: Omit<Order, "paymentResult">;
	paypalClientId: string;
	isAdmin: boolean;
	stripeClientSecret: string | null;
}) => {
	const {
		shippingAddress,
		paymentMethod,
		itemsPrice,
		shippingPrice,
		taxPrice,
		totalPrice,
		orderitems,
		isPaid,
		isDelivered,
		paidAt,
		deliveredAt,
		id,
	} = order;

	const PrintLoadingState = () => {
		const [{ isPending, isRejected }] = usePayPalScriptReducer();
		let status = "";

		if (isPending) {
			status = "Loading Paypal...";
		} else if (isRejected) {
			status = "Error loading Paypal";
		}

		return status;
	};

	const handleCreatePayPalOrder = async () => {
		const res = await createPayPalOrder(id);

		if (!res.success) {
			toast.error(res.message);
		}

		return res.data;
	};

	const handleApprovePayPalOrder = async (data: { orderID: string }) => {
		const res = await approvePayPalOrder(id, data);
		if (!res.success) {
			toast.error(res.message);
		} else {
			toast.success(res.message);
		}
	};

	const MarkAsPaidButton = () => {
		const [isPending, startTransition] = useTransition();
		return (
			<Button
				type="button"
				disabled={isPending}
				onClick={() => {
					return startTransition(async () => {
						const res = await updateOrderToPaidCOD(id);
						if (!res.success) {
							toast.error(res.message);
						} else {
							toast.success(res.message);
						}
					});
				}}
			>
				{isPending ? "Processing..." : "Mark as paid"}
			</Button>
		);
	};

	const MarkAsDeliveredButton = () => {
		const [isPending, startTransition] = useTransition();
		return (
			<Button
				type="button"
				disabled={isPending}
				onClick={() => {
					return startTransition(async () => {
						const res = await deliverOrder(id);
						if (!res.success) {
							toast.error(res.message);
						} else {
							toast.success(res.message);
						}
					});
				}}
			>
				{isPending ? "Processing..." : "Mark as Delivered"}
			</Button>
		);
	};

	return (
		<>
			<h1 className="py-4 text-2xl">Order {formatId(id)}</h1>
			<div className="grid md:grid-cols-3 md:gap-5">
				<div className="col-span-2 space-4-y overflow-x-auto">
					<Card>
						<CardContent className="p-4 gap-4">
							<h2 className="text-xl pb-4">Payment Method</h2>
							<p className="mb-2">{paymentMethod}</p>
							{isPaid ? (
								<Badge variant="secondary">
									Paid at {formatDateTime(paidAt!).dateTime}
								</Badge>
							) : (
								<Badge variant="destructive">Not Paid</Badge>
							)}
						</CardContent>
					</Card>
					<Card className="my-2">
						<CardContent className="p-4 gap-4">
							<h2 className="text-xl pb-4">Shipping Address</h2>
							<p>{shippingAddress.fullName}</p>
							<p className="mb-2">
								{shippingAddress.streetAddress}, {shippingAddress.city},{" "}
								{shippingAddress.postalCode}, {shippingAddress.country}
							</p>

							{isDelivered ? (
								<Badge variant="secondary">
									Delivered at {formatDateTime(deliveredAt!).dateTime}
								</Badge>
							) : (
								<Badge variant="destructive">Not Delivered</Badge>
							)}
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 gap-4">
							<h2 className="text-xl pb-4">Order Items</h2>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Item</TableHead>
										<TableHead className="text-center">Quantity</TableHead>
										<TableHead className="text-right">Price</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{orderitems.map((orderitem) => {
										return (
											<TableRow key={orderitem.slug}>
												<TableCell>
													<Link
														href={`/product/${orderitem.slug}`}
														className="flex items-center"
													>
														<Image
															src={orderitem.image}
															alt={orderitem.name}
															width={50}
															height={50}
														/>
														<span className="px-2">{orderitem.name}</span>
													</Link>
												</TableCell>
												<TableCell className="text-center">
													<span className="px-2">{orderitem.qty}</span>
												</TableCell>
												<TableCell className="text-right">
													<span className="px-2">{orderitem.price}</span>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>
				<div className="md:col-span-1">
					<Card>
						<CardContent className="p-4 gap-4 space-y-4">
							<div className="flex justify-between">
								<div>Items</div>
								<div>{formatCurrency(itemsPrice)}</div>
							</div>
							<div className="flex justify-between">
								<div>Tax</div>
								<div>{formatCurrency(taxPrice)}</div>
							</div>
							<div className="flex justify-between">
								<div>Shipping</div>
								<div>{formatCurrency(shippingPrice)}</div>
							</div>
							<div className="flex justify-between">
								<div>Total</div>
								<div>{formatCurrency(totalPrice)}</div>
							</div>
							{/* Paypal Payment*/}
							{!isPaid && paymentMethod === "PayPal" && (
								<>
									<PayPalScriptProvider
										options={{
											clientId: paypalClientId,
										}}
									>
										<PrintLoadingState />
										<PayPalButtons
											createOrder={handleCreatePayPalOrder}
											onApprove={handleApprovePayPalOrder}
										/>
									</PayPalScriptProvider>
								</>
							)}

							{/* Stripe Payment*/}
							{!isPaid && paymentMethod === "Stripe" && stripeClientSecret && (
								<StripePayment
									priceInCents={Number(order.totalPrice) * 100}
									orderId={order.id}
									clientSecret={stripeClientSecret}
								/>
							)}

							{/* COD Payment*/}
							{isAdmin && !isPaid && paymentMethod === "CashOnDelivery" && (
								<MarkAsPaidButton />
							)}
							{/* Deliver Order */}
							{isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
};

export default OrderDetailsTable;
