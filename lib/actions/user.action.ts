"use server";

import { signIn, signOut } from "@/auth";
import { signInFormSchema } from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function signInWithCredentials(
	prevState: unknown,
	formData: FormData
) {
	try {
		const user = signInFormSchema.parse({
			email: formData.get("email"),
			password: formData.get("password"),
		});

		await signIn("credentials", user);

		return {
			success: true,
			message: "Login successful",
		};
	} catch (err) {
		if (isRedirectError(err)) throw err;

		return {
			success: false,
			message: "Invalid credentials",
		};
	}
}

export async function signOutUser() {
	await signOut();
}
