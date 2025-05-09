import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	TableHeader,
	Table,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import { getOrderSummary } from "@/lib/actions/order.actions";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";
import { BadgeDollarSign, Barcode, CreditCard, Users } from "lucide-react";
import Link from "next/link";
import Charts from "./charts";
import { Metadata } from "next";
import { requireAdmin } from "@/lib/constants/auth-guard";

export const metadata: Metadata = {
	title: "Admin Overview",
	description: "Overview page for the admin panel.",
};
const AdminOverviewPage = async () => {
	await requireAdmin();
	const session = await auth();
	if (!session || !session.user.role || session.user.role !== "admin") {
		throw new Error("Unauthorized");
	}

	const summary = await getOrderSummary();

	return (
		<div className="space-y-2">
			<h1 className="h2-bold">Dashboard</h1>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<BadgeDollarSign />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatCurrency(
								summary.totalSales._sum.totalPrice?.toString() || 0
							)}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Sales</CardTitle>
						<CreditCard />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(summary.ordersCount)}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Customers</CardTitle>
						<Users />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(summary.usersCount)}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Products</CardTitle>
						<Barcode />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(summary.productsCount)}
						</div>
					</CardContent>
				</Card>
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Overview</CardTitle>
					</CardHeader>
					<CardContent>
						<Charts
							data={{
								salesData: summary.salesData,
							}}
						/>
					</CardContent>
				</Card>
				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Recent Sales</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>BUYER</TableHead>
									<TableHead>DATE</TableHead>
									<TableHead>TOTAL</TableHead>
									<TableHead>ACTIONS</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{summary.latestSales.map((sale) => (
									<TableRow key={sale.id}>
										<TableCell>
											{sale.user?.name ? sale.user.name : "Deleted User"}
										</TableCell>
										<TableCell>
											{formatDateTime(sale.createdAt).dateOnly}
										</TableCell>
										<TableCell>{formatCurrency(sale.totalPrice)}</TableCell>
										<TableCell>
											<Link href={`/order/${sale.id}`}>
												<span className="px-2">Details</span>
											</Link>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default AdminOverviewPage;
