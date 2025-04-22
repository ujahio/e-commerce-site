import { prisma } from "./prisma";
import sampleData from "./sample-data";

async function main() {
	const { products, users } = sampleData;

	await prisma.product.deleteMany();
	await prisma.account.deleteMany();
	await prisma.session.deleteMany();
	await prisma.verificationToken.deleteMany();
	await prisma.user.deleteMany();

	await prisma.product.createMany({
		data: products,
	});
	await prisma.user.createMany({
		data: users,
	});

	console.log("Sample data seeded successfully!");
}
main();
