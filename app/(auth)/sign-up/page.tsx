import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { auth } from "@/auth";
import SignupForm from "./sign-up-form";

export const metadata: Metadata = {
	title: "Sign Up",
};

const SignUpPage = async (props: {
	searchParams: Promise<{
		callbackUrl: string;
	}>;
}) => {
	const { callbackUrl } = await props.searchParams;
	const session = await auth();
	if (session) return redirect(callbackUrl || "/");
	return (
		<div className=" w-full max-w-md mx-auto">
			<Card>
				<CardHeader className="space-y-4">
					<Link href="/" className="flex-center">
						<Image
							src="/images/logo.svg"
							height={100}
							width={100}
							alt={`${APP_NAME} Logo`}
							priority={true}
						/>
					</Link>
					<CardTitle className="text-center">Sign Up</CardTitle>
					<CardDescription className="text-center">
						Enter your information to create an account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<SignupForm />
				</CardContent>
			</Card>
		</div>
	);
};
export default SignUpPage;
