"use client";
import { z } from "zod";
import { toast } from "sonner";
import { updateUserProfileSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateUserProfile } from "@/lib/actions/user.action";

const ProfileForm = () => {
	const { data: session, update } = useSession();

	const form = useForm<z.infer<typeof updateUserProfileSchema>>({
		resolver: zodResolver(updateUserProfileSchema),
		defaultValues: {
			name: session?.user?.name ?? "",
			email: session?.user?.email ?? "",
		},
	});

	const onSubmit = async (values: z.infer<typeof updateUserProfileSchema>) => {
		const res = await updateUserProfile(values);
		if (!res.success) {
			toast.error(res.message);
			return;
		}
		const newSession = {
			...session,
			user: {
				...session?.user,
				name: values.name,
			},
		};

		await update(newSession);
		toast.success("Profile updated successfully");
	};
	return (
		<Form {...form}>
			<form
				className="flex flex-col gap-5"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className="flex flex-col gap-5">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => {
							return (
								<FormItem className="w-full">
									<FormControl>
										<Input
											disabled
											placeholder="Email"
											className="input-field "
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => {
							return (
								<FormItem className="w-full">
									<FormControl>
										<Input
											placeholder="Name"
											className="input-field "
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
				</div>
				<Button
					type="submit"
					size="lg"
					className="w-full"
					disabled={form.formState.isSubmitting}
				>
					{form.formState.isSubmitting ? "Submitting" : "Update Profile"}
				</Button>
			</form>
		</Form>
	);
};

export default ProfileForm;
