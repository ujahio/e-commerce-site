import { requireAdmin } from "@/lib/constants/auth-guard";

const AdminProductsPage = async () => {
	await requireAdmin();
	return (
		<div>
			<h1>Admin Products Page</h1>
			<p>This is the admin Products page.</p>
		</div>
	);
};

export default AdminProductsPage;
