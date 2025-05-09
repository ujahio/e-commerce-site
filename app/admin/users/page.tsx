import { requireAdmin } from "@/lib/constants/auth-guard";

const AdminUsersPage = async () => {
	await requireAdmin();
	return (
		<div>
			<h1>Admin Users Page</h1>
			<p>This is the admin users page.</p>
		</div>
	);
};

export default AdminUsersPage;
