import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import {
	getAllProducts,
	getAllCategories,
} from "@/lib/actions/product.actions";
import Link from "next/link";

const prices = [
	{
		name: "$1 to $50",
		value: "1-50",
	},
	{
		name: "$51 to $100",
		value: "51-100",
	},
	{
		name: "$101 to $200",
		value: "101-200",
	},
	{
		name: "$201 to $500",
		value: "201-500",
	},
];

const ratings = [4, 3, 2, 1];

const sortOrders = ["newest", "lowest", "highest", "rating"];

export async function generateMetadata(props: {
	searchParams: Promise<{
		q: string;
		category: string;
		price: string;
		rating: string;
	}>;
}) {
	const {
		q = "all",
		category = "all",
		price = "all",
		rating = "all",
	} = await props.searchParams;

	const isQuerySet = q && q !== "all" && q.trim() !== "";
	const isCategorySet =
		category && category !== "all" && category.trim() !== "";
	const isPriceSet = price && price !== "all" && price.trim() !== "";
	const isRatingSet = rating && rating !== "all" && rating.trim() !== "";

	if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
		return {
			title: `Search 
      ${isQuerySet ? q : ""} 
      ${isCategorySet ? `: Category ${category}` : ""} 
      ${isPriceSet ? `: Price ${price}` : ""} 
      ${isRatingSet ? `: Rating ${rating}` : ""}`,
		};
	} else {
		return {
			title: "Search Products",
		};
	}
}

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
		sort = "newest",
		rating = "all",
	} = await props.searchParams;

	// construct filter urls
	const getFilterUrl = ({
		c,
		s,
		p,
		r,
		pg,
	}: {
		c?: string;
		s?: string;
		p?: string;
		r?: string;
		pg?: string;
	}) => {
		const params = { q, page, category, price, rating, sort };

		if (c) params.category = c;
		if (p) params.price = p;
		if (r) params.rating = r;
		if (pg) params.page = pg;
		if (s) params.sort = s;

		return `/search?${new URLSearchParams(params).toString()}`;
	};

	const products = await getAllProducts({
		query: q,
		page: Number(page),
		category,
		price,
		rating,
		sort,
	});

	const categories = await getAllCategories();
	return (
		<div className="grid md:grid-cols-5 md:gap-5">
			<div className="filter-links">
				{/*CATEGORIES LINKS*/}
				<div className="text-ml mb-2 mt-3">Department</div>
				<div className="">
					<ul className="space-y-1">
						<li>
							<Link
								className={`${
									(category === "all" || category === "") && "font-bold"
								}`}
								href={getFilterUrl({ c: "all" })}
							>
								Any
							</Link>
						</li>
						{categories.map((x) => {
							return (
								<li key={x.category}>
									<Link
										className={`${category === x.category && "font-bold"}`}
										href={getFilterUrl({ c: x.category })}
									>
										{x.category}
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
				<div className="text-ml mb-2 mt-8">Price</div>
				<div className="">
					<ul className="space-y-1">
						<li>
							<Link
								className={`${
									(price === "all" || price === "") && "font-bold"
								}`}
								href={getFilterUrl({ p: "all" })}
							>
								Any
							</Link>
						</li>
						{prices.map((p) => {
							return (
								<li key={p.value}>
									<Link
										className={`${price === p.value && "font-bold"}`}
										href={getFilterUrl({ p: p.value })}
									>
										{p.name}
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
				<div className="text-ml mb-2 mt-8">Customer Ratings</div>
				<div className="">
					<ul className="space-y-1">
						<li>
							<Link
								className={`${rating === "all" && "font-bold"}`}
								href={getFilterUrl({ r: "all" })}
							>
								Any
							</Link>
						</li>
						{ratings.map((r) => {
							return (
								<li key={r}>
									<Link
										className={`${rating === r.toString() && "font-bold"}`}
										href={getFilterUrl({ r: `${r}` })}
									>
										{`${r} stars & up`}
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
			<div className="md:col-span-4 space-y-4">
				<div className="flex justify-between flex-col md:flex-row my-4">
					<div className="flex items-center">
						{q !== "all" && q !== "" && "Query: " + q}
						{category !== "all" && category !== "" && " Category: " + category}
						{price !== "all" && " Price: " + price}
						{rating !== "all" && " Rating: " + rating + " stars & up"}
						&nbsp;
						{(q !== "all" && q !== "") ||
						(category !== "all" && category !== "") ||
						rating !== "all" ||
						price !== "all" ? (
							<Button variant="link" asChild>
								<Link href="/search">Clear</Link>
							</Button>
						) : null}
					</div>
					<div>
						Sort by{" "}
						{sortOrders.map((s) => (
							<Link
								key={s}
								className={`${sort === s && "font-bold"} mx-2`}
								href={getFilterUrl({ s })}
							>
								{s}
							</Link>
						))}
					</div>
				</div>
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
