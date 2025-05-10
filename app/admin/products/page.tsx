import Link from "next/link";
import { requireAdmin } from "@/lib/constants/auth-guard";
import { getAllProducts, deleteProduct } from "@/lib/actions/product.actions";
import { formatCurrency, formatId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";
import DeleteDialog from "@/components/shared/delete-dialog";

const AdminProductsPage = async (props: {
	searchParams: { [key: string]: string };
}) => {
	await requireAdmin();

	const searchParams = await props.searchParams;
	const page = Number(searchParams.page) || 1;
	const searchText = searchParams.query || "";
	const category = searchParams.category || "";

	const products = await getAllProducts({
		query: searchText,
		page,
		category,
	});

	console.log(products);
	return (
		<div className="space-y-2">
			<div className="flex justify-between">
				<h1 className="h2-bold">Products</h1>
				<Button asChild variant="default">
					<Link href={`/admin/products/create`}>Create Product</Link>
				</Button>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>NAME</TableHead>
						<TableHead className="text-right">PRICE</TableHead>
						<TableHead>CATEGORY</TableHead>
						<TableHead>STOCK</TableHead>
						<TableHead>RATING</TableHead>
						<TableHead className="w-[100px]">ACTIONS</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{products.data.map((product) => (
						<TableRow key={product.id}>
							<TableCell className="font-medium">
								{formatId(product.id)}
							</TableCell>
							<TableCell>{product.name}</TableCell>
							<TableCell className="text-right">
								{formatCurrency(product.price)}
							</TableCell>
							<TableCell>{product.category}</TableCell>
							<TableCell>{product.stock}</TableCell>
							<TableCell>{product.rating}</TableCell>
							<TableCell className="flex gap-1">
								<Button asChild variant="outline">
									<Link
										href={`/admin/products/${product.id}`}
										className="text-blue-500 hover:underline"
									>
										Edit
									</Link>
								</Button>
								<DeleteDialog id={product.id} action={deleteProduct} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{products.totalPages && products.totalPages > 1 && (
				<Pagination page={Number(page) || 1} totalPages={products.totalPages} />
			)}
		</div>
	);
};

export default AdminProductsPage;
