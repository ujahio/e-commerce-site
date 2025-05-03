import ProductList from "@/components/shared/product/productList";
import { getLatestProducts } from "@/lib/actions/product.actions";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";

export const metadata = {
	title: "Home",
};

export default async function Home() {
	const latestProducts = await getLatestProducts();
	return (
		<>
			<ProductList
				data={latestProducts}
				title="Newest Arrivals"
				limit={LATEST_PRODUCTS_LIMIT}
			/>
		</>
	);
}
