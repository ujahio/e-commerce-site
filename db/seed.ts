import { prisma } from "./prisma";
import sampleData from "./sample-data";

async function main() {
	const { products } = sampleData;

	await prisma.product.deleteMany();

	await prisma.product.createMany({
		data: products,
	});

	console.log("Sample data seeded successfully!");
}
main();
