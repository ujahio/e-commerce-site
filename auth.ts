import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import { compareSync } from "bcrypt-ts-edge";

export const config: NextAuthConfig = {
	pages: {
		signIn: "/sign-in",
		error: "/sign-in",
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials) return null;

				const user = await prisma.user.findFirst({
					where: {
						email: credentials.email as string,
					},
				});

				if (!user) {
					throw new Error("No user found with the given email");
				}

				if (user && user.password) {
					const isMatch = compareSync(
						credentials.password as string,
						user.password
					);

					if (isMatch)
						return {
							id: user.id,
							name: user.name,
							email: user.email,
							role: user.role,
						};
				}

				return null;
			},
		}),
	],
	callbacks: {
		async session({ session, token, user, trigger }: any) {
			session.user.id = token.sub;
			session.user.role = token.role;
			session.user.name = token.name;

			if (trigger === "update") {
				session.user.name = user.name;
			}
			return session;
		},

		async jwt({ token, user }: any) {
			if (user) {
				token.role = user.role;

				if (user.name === "NO_NAME") {
					token.name = user.email!.split("@")[0];
				}

				await prisma.user.update({
					where: {
						id: user.id,
					},
					data: {
						name: token.name,
					},
				});
			}

			return token;
		},
	},
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
