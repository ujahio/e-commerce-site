"use server";

import { signIn, signOut } from "@/auth";
import { signInFormSchema, signUpFormSchema } from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";

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

export async function signUpUser(prevState: unknown, formData: FormData) {
	try {
		const user = signUpFormSchema.parse({
			name: formData.get("name"),
			email: formData.get("email"),
			password: formData.get("password"),
			confirmPassword: formData.get("confirmPassword"),
		});

		const plainPassword = user.password;

		user.password = hashSync(user.password, 10);

		await prisma.user.create({
			data: {
				name: user.name,
				email: user.email,
				password: user.password,
			},
		});

		await signIn("credentials", {
			email: user.email,
			password: plainPassword,
		});

		return {
			success: true,
			message: "User registered successful",
		};
	} catch (err) {
		if (isRedirectError(err)) throw err;

		return {
			success: false,
			message: "User is not registered",
		};
	}
}
