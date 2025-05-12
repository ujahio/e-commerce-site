import { Metadata } from "next";
import CreateProductForm from "@/components/admin/create-product-form";
import { requireAdmin } from "@/lib/constants/auth-guard";

export const metadata: Metadata = {
	title: "Create Product",
};

const CreateProductPage = async () => {
	await requireAdmin();
	return (
		<>
			<h2 className="h2-bold">Create Product</h2>
			<div className="my-8">
				<CreateProductForm />
			</div>
		</>
	);
};

export default CreateProductPage;
