import { Metadata } from "next";
import { deleteOrder, getAllOrders } from "@/lib/actions/order.actions";
import { requireAdmin } from "@/lib/constants/auth-guard";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import Link from "next/link";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/shared/delete-dialog";

export const metadata: Metadata = {
	title: "Admin Orders",
	description: "Admin Orders Page",
};

const AdminOrdersPage = async (props: {
	searchParams: Promise<{ page: string }>;
}) => {
	await requireAdmin();
	const { page = "1" } = await props.searchParams;
	const allOrders = await getAllOrders({
		page: Number(page),
	});
	return (
		<div className="space-y-2">
			<h2 className="h2-bold">Orders</h2>
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>DATE</TableHead>
							<TableHead>TOTAL</TableHead>
							<TableHead>PAID</TableHead>
							<TableHead>DELIVERED</TableHead>
							<TableHead>ACTIONS</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{allOrders.data.map((order) => (
							<TableRow key={order.id}>
								<TableCell>{formatId(order.id)}</TableCell>
								<TableCell>
									{formatDateTime(order.createdAt).dateTime}
								</TableCell>
								<TableCell>{formatCurrency(order.totalPrice)}</TableCell>
								<TableCell>
									{order.isPaid && order.paidAt
										? formatDateTime(order.paidAt).dateTime
										: "Not Paid"}
								</TableCell>
								<TableCell>
									{order.isDelivered && order.deliveredAt
										? formatDateTime(order.deliveredAt).dateTime
										: "Not Delivered"}
								</TableCell>
								<TableCell>
									<Button asChild variant="outline" size="sm">
										<Link href={`/order/${order.id}`}>Details</Link>
									</Button>
									<DeleteDialog id={order.id} action={deleteOrder} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{allOrders.totalPages > 1 && (
					<Pagination
						page={Number(page) || 1}
						totalPages={allOrders.totalPages}
					/>
				)}
			</div>
		</div>
	);
};

export default AdminOrdersPage;
