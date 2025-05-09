import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const requireAdmin = async () => {
	const session = await auth();
	if (!session || !session.user.role || session.user.role !== "admin") {
		redirect("/unauthorized");
	}

	return session;
};
