import { requireAdmin } from "@/lib/constants/auth-guard";

const AdminOrdersPage = async () => {
	await requireAdmin();
	return (
		<div>
			<h1>Admin Orders Page</h1>
			<p>This is the admin orders page.</p>
		</div>
	);
};

export default AdminOrdersPage;
