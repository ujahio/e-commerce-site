import NotFound from "@/app/not-found";
import AddToCart from "@/components/shared/product/add-to-cart";
import ProductImages from "@/components/shared/product/product-image";
import ProductPrice from "@/components/shared/product/product-price";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { getMyCart } from "@/lib/actions/cart.actions";
import { auth } from "@/auth";
import ReviewList from "./review-list";
import Rating from "@/components/shared/product/rating";

const ProductDetails = async (props: {
	params: Promise<{
		slug: string;
	}>;
}) => {
	const { slug } = await props.params;
	const product = await getProductBySlug(slug);
	if (!product) {
		return <NotFound />;
	}
	const session = await auth();
	const userId = session?.user?.id;

	const cart = await getMyCart();

	return (
		<>
			<section>
				<div className="grid grid-cols-1 md:grid-cols-5">
					<div className="col-span-2">
						<ProductImages images={product.images} />
					</div>

					<div className="col-span-2 p-5">
						<div className="flex flex-col gap-6">
							<p className="">
								{product.brand} {product.category}
							</p>
							<h1 className="h3-bold">{product.name}</h1>
							<Rating value={Number(product.rating)} />
							<p>{product.numReviews} reviews</p>
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
								<ProductPrice
									value={Number(product.price)}
									className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
								/>
							</div>
						</div>

						<div className="mt-10">
							<p className="font-semibold">Description</p>
							<p className="font-semibold">{product.description}</p>
						</div>
					</div>

					{/* Action Column*/}
					<div>
						<Card>
							<CardContent className="p-4">
								<div className="mb-2 flex justify-between">
									<div>Price</div>
									<div>
										<ProductPrice value={Number(product.price)} />
									</div>
								</div>
								<div className="mb-2 flex justify-between">
									<div>Status</div>
									{product.stock > 0 ? (
										<Badge variant="outline">In Stock</Badge>
									) : (
										<Badge variant="destructive">Out Of Stock</Badge>
									)}
								</div>
								{product.stock > 0 && (
									<AddToCart
										cart={cart}
										item={{
											productId: product.id,
											price: product.price,
											name: product.name,
											slug: product.slug,
											image: product.images[0],
											qty: 1,
										}}
									/>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
			<section className="mt-10">
				<h2 className="h2-bold mb-2">Customer Review</h2>
				<ReviewList
					userId={userId || ""}
					productId={product.id}
					productSlug={product.slug}
				/>
			</section>
		</>
	);
};

export default ProductDetails;
