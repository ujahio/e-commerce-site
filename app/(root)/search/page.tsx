import ProductCard from "@/components/shared/product/product-card";
import { getAllProducts } from "@/lib/actions/product.actions";

const SearchPage = async (props: {
	searchParams: Promise<{
		category?: string;
		q?: string;
		price?: string;
		page?: string;
		rating?: string;
		sort?: string;
	}>;
}) => {
	const {
		q = "all",
		page = "1",
		category = "all",
		price = "all",
		sort = "all",
		rating,
	} = await props.searchParams;

	console.log({ q, page, category, price, rating });

	const products = await getAllProducts({
		query: q,
		page: Number(page),
		category,
		price,
		rating,
		sort,
	});
	return (
		<div className="grid md:grid-cols-5 md:gap-5">
			<div className="filter-links">{/*FILTER LINKS*/}</div>
			<div className="md:col-span-4 space-y-4">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{products.totalPages === 0 && <div>No products found</div>}
					{products.data.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</div>
	);
};
export default SearchPage;
