import { getOrderById } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { ShippingAddress } from "@/types";

export const metadata: Metadata = {
	title: "Order Details",
	description: "Details of the order will be displayed here.",
};

const OrderDetailsPage = async (props: {
	params: Promise<{
		id: string;
	}>;
}) => {
	const { id } = await props.params;

	const order = await getOrderById(id);

	if (!order) notFound();
	return (
		<div>
			<OrderDetailsTable
				order={{
					...order,
					shippingAddress: order.shippingAddress as ShippingAddress,
				}}
			/>
		</div>
	);
};

export default OrderDetailsPage;
