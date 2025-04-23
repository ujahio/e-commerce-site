"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpUser } from "@/lib/actions/user.action";
import { useSearchParams } from "next/navigation";

const SignupForm = () => {
	const [data, action] = useActionState(signUpUser, {
		success: false,
		message: "",
	});

	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";

	const SignUpButton = () => {
		const { pending } = useFormStatus();
		return (
			<Button variant="default" className="w-full" disabled={pending}>
				{pending ? "Submitting..." : "Sign Up"}
			</Button>
		);
	};

	return (
		<form action={action}>
			<input type="hidden" name="callbackUrl" value={callbackUrl} />
			<div className="space-y-6">
				<div>
					<Label htmlFor="name">Name</Label>
					<Input
						id="name"
						name="name"
						type="text"
						required
						autoComplete="name"
						defaultValue=""
					/>
				</div>
				<div>
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						required
						autoComplete="email"
						defaultValue=""
					/>
				</div>
				<div>
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						name="password"
						type="password"
						required
						autoComplete="password"
						defaultValue=""
					/>
				</div>
				<div>
					<Label htmlFor="confirmPassword">Confirm Password</Label>
					<Input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						required
						autoComplete="confirmPassword"
						defaultValue=""
					/>
				</div>
				<div>
					<SignUpButton />
				</div>

				{data && !data.success && (
					<div className="text-center text-destructive">{data.message}</div>
				)}

				<div className="text-sm text-center text-muted-foreground">
					Already have an account?{" "}
					<Link href="/sign-in" target="_self" className="link">
						Sign in
					</Link>
				</div>
			</div>
		</form>
	);
};

export default SignupForm;
