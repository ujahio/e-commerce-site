import IconBoxes from "@/components/icon-boxes";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/productList";
import ViewAllProductsButton from "@/components/view-all-products-button";
import {
	getFeaturedProducts,
	getLatestProducts,
} from "@/lib/actions/product.actions";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";

export const metadata = {
	title: "Home",
};

export default async function Home() {
	const latestProducts = await getLatestProducts();
	const featuredProducts = await getFeaturedProducts();

	return (
		<>
			{featuredProducts.length > 0 && (
				<ProductCarousel products={featuredProducts} />
			)}
			<ProductList
				data={latestProducts}
				title="Newest Arrivals"
				limit={LATEST_PRODUCTS_LIMIT}
			/>
			<ViewAllProductsButton />
			<IconBoxes />
		</>
	);
}
