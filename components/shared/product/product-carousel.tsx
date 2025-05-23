"use client";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

const ProductCarousel = ({ products }: { products: Product[] }) => {
	return (
		<Carousel
			className="w-full mb-12"
			opts={{
				loop: true,
			}}
			plugins={[
				Autoplay({
					delay: 9000,
					stopOnInteraction: true,
					stopOnMouseEnter: true,
				}),
			]}
		>
			<CarouselContent>
				{products.map((p) => (
					<CarouselItem key={p.id}>
						<Link href={`/product/${p.slug}`}>
							<div className="relative mx-auto">
								<Image
									src={p.banner!}
									alt={p.name}
									width="0"
									height="0"
									sizes="100vw"
									className="w-full h-auto"
								/>
								<div className="absolute inset-9 flex items-end justify-center">
									<h2 className="bg-gray-900 bg-opacity-50 text-2xl font-bold px-2 text-white">
										{p.name}
									</h2>
								</div>
							</div>
						</Link>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
};

export default ProductCarousel;
