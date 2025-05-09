import { requireAdmin } from "@/lib/constants/auth-guard";

const AdminIndividualUsersPage = async () => {
	await requireAdmin();
	return (
		<div>
			<h1>Admin Individual Users Page</h1>
		</div>
	);
};

export default AdminIndividualUsersPage;
