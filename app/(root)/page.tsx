import ProductList from "@/components/shared/product/productList";
import sampleData from "@/db/sample-data";

export const metadata = {
	title: "Home",
};

export default function Home() {
	return (
		<>
			<ProductList
				data={sampleData.products}
				title="Newest Arrrivals"
				limit={4}
			/>
		</>
	);
}
