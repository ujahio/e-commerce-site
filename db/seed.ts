import { PrismaClient } from "../lib/generated/prisma/client";
import sampleData from "./sample-data";

const prisma = new PrismaClient();

async function main() {
	const { products } = sampleData;

	await prisma.product.deleteMany();

	await prisma.product.createMany({
		data: products,
	});

	console.log("Sample data seeded successfully!");
}
main();
