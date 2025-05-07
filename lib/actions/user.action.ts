"use server";

import { auth, signIn, signOut } from "@/auth";
import {
	shippingAddressSchema,
	signInFormSchema,
	signUpFormSchema,
} from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";

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
			message: formatError(err),
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
			message: formatError(err),
		};
	}
}

export async function getUserById(userId: string) {
	const user = await prisma.user.findFirst({
		where: {
			id: userId,
		},
	});
	if (!user) {
		throw new Error("User not found");
	}
	return user;
}

export async function updateUserAddress(data: ShippingAddress) {
	try {
		const session = await auth();

		const user = await prisma.user.findFirst({
			where: {
				id: session?.user?.id,
			},
		});

		if (!user) {
			throw new Error("User not found");
		}

		const address = shippingAddressSchema.parse(data);

		await prisma.user.update({
			where: { id: user.id },
			data: {
				address,
			},
		});

		return {
			success: true,
			message: "User Address updated successfully",
		};
	} catch (err) {
		return {
			success: false,
			message: formatError(err),
		};
	}
}
