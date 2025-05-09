import { requireAdmin } from "@/lib/constants/auth-guard";

const AdminSingleProductPage = async () => {
	await requireAdmin();
	return (
		<div>
			<h1>Admin Single Products Page</h1>
		</div>
	);
};

export default AdminSingleProductPage;
