import { requireAdmin } from "@/lib/constants/auth-guard";

const AdminCreateProductPage = async () => {
	await requireAdmin();
	return (
		<div>
			<h1>Admin Create Products Page</h1>
		</div>
	);
};

export default AdminCreateProductPage;
