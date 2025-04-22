import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "./product-price";
import { Product } from "@/types";

const ProductCard = ({ product }: { product: Product }) => {
	const renderProductStockInfo = (price: string, stock: number) => {
		if (stock > 0) {
			return <ProductPrice value={Number(price)} />;
		} else {
			return <p className="text-destructive">Out of Stock</p>;
		}
	};
	return (
		<Card className="w-full max-w-sm">
			<CardHeader className="p-0 items-center">
				<Link href={`/product/${product.slug}`}>
					<Image
						src={product.images[0]}
						alt={product.name}
						priority={true}
						height={480}
						width={480}
					/>
				</Link>

				<CardContent className="p-4 grid gap-4">
					<div className="text-xs">{product.brand}</div>
					<Link href={`/product/${product.slug}`}>
						<h2 className="text-sm font-medium">{product.name}</h2>
					</Link>
					<div className="flex-between gap-4">
						<p className="">{product.rating} Stars</p>
						{renderProductStockInfo(product.price, product.stock)}
					</div>
				</CardContent>
			</CardHeader>
		</Card>
	);
};

export default ProductCard;
