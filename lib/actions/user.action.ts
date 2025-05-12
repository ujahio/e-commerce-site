"use server";

import { z } from "zod";
import { auth, signIn, signOut } from "@/auth";
import {
	paymentMethodSchema,
	shippingAddressSchema,
	signInFormSchema,
	signUpFormSchema,
	updateUserProfileSchema,
	updateUserSchema,
} from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";

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

export async function updateUserPaymentMethod(
	data: z.infer<typeof paymentMethodSchema>
) {
	try {
		const session = await auth();
		const currentUser = await prisma.user.findFirst({
			where: {
				id: session?.user?.id,
			},
		});

		if (!currentUser) throw new Error("User not found");

		const paymentMethod = paymentMethodSchema.parse(data);

		await prisma.user.update({
			where: { id: currentUser.id },
			data: { paymentMethod: paymentMethod.type },
		});

		return {
			success: true,
			message: "User Payment Method updated successfully",
		};
	} catch (err) {
		return {
			success: false,
			message: formatError(err),
		};
	}
}

export async function updateUserProfile(data: {
	name: string;
	email?: string;
}) {
	try {
		const session = await auth();
		const currentUser = await prisma.user.findFirst({
			where: {
				id: session?.user?.id,
			},
		});

		if (!currentUser) throw new Error("User not found");

		// where is the validation for the data?
		const user = updateUserProfileSchema.parse(data);

		await prisma.user.update({
			where: { id: currentUser.id },
			data: {
				name: user.name,
				email: user.email,
			},
		});

		return {
			success: true,
			message: "User Profile updated successfully",
		};
	} catch (err) {
		return {
			success: false,
			message: formatError(err),
		};
	}
}

export async function getAllUsers({
	limit = PAGE_SIZE,
	page,
}: {
	limit?: number;
	page: number;
}) {
	try {
		const data = await prisma.user.findMany({
			orderBy: { createdAt: "desc" },
			take: limit,
			skip: (page - 1) * limit,
		});

		if (!data) throw new Error("No users found");

		const dataCount = await prisma.user.count();

		return {
			data,
			totalPages: Math.ceil(dataCount / limit),
		};
	} catch (err) {
		return {
			success: false,
			message: formatError(err),
		};
	}
}

export async function deleteUser(id: string) {
	try {
		await prisma.user.delete({
			where: { id },
		});

		revalidatePath("/admin/users");

		return {
			success: true,
			message: "User deleted successfully",
		};
	} catch (err) {
		return {
			success: false,
			message: formatError(err),
		};
	}
}

export async function updateUser(user: z.infer<typeof updateUserSchema>) {
	try {
		await prisma.user.update({
			where: { id: user.id },
			data: {
				name: user.name,
				role: user.role,
			},
		});

		revalidatePath("/admin/users");

		return {
			success: true,
			message: "User updated successfully",
		};
	} catch (err) {
		return {
			success: false,
			message: formatError(err),
		};
	}
}
