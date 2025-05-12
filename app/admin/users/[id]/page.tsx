import { getUserById } from "@/lib/actions/user.action";
import { requireAdmin } from "@/lib/constants/auth-guard";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import UpdateUserForm from "./update-user-form";

export const metadata: Metadata = {
	title: "Admin Individual Users Page",
};

const AdminIndividualUsersPage = async (props: {
	params: Promise<{ id: string }>;
}) => {
	await requireAdmin();
	const { id } = await props.params;
	const user = await getUserById(id);
	if (!user) return notFound();

	return (
		<div className="space-y-8 max-w-lg mx-auto">
			<h1 className="h2-bold">Update User</h1>
			<UpdateUserForm user={user} />
		</div>
	);
};

export default AdminIndividualUsersPage;
