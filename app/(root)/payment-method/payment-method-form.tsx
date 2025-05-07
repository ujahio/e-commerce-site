"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { paymentMethodSchema } from "@/lib/validators";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { useTransition } from "react";
import { toast } from "sonner";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Button } from "@/components/ui/button";
import { ArrowRight, Loader, Radio } from "lucide-react";
import { Input } from "@/components/ui/input";
import { updateUserPaymentMethod } from "@/lib/actions/user.action";

const PreferredPaymentMethodForm = ({
	preferredPaymentMethod,
}: {
	preferredPaymentMethod: string | null;
}) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	// 1. Define your form.
	const form = useForm<z.infer<typeof paymentMethodSchema>>({
		resolver: zodResolver(paymentMethodSchema),
		defaultValues: {
			type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
		},
	});

	const onSubmit: SubmitHandler<z.infer<typeof paymentMethodSchema>> = async (
		values
	) => {
		startTransition(async () => {
			const res = await updateUserPaymentMethod(values);
			if (!res.success) {
				toast.error(res.message);
				return;
			}

			router.push("/place-order");
		});
	};

	return (
		<>
			<div className="max-w-md mx-auto space-y-4">
				<h1 className="h2-bold mt-4">Payment Method</h1>
				<p className="text-sm text-muted-foreground">
					Please select a payment method.
				</p>
				<Form {...form}>
					<form
						method="post"
						className="space-y-4"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<div className="flex flex-col gap-5">
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem className="space-y-3">
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												defaultValue={field.value}
												className="flex flex-col space-y-2"
											>
												{PAYMENT_METHODS.map((paymentMethod) => {
													return (
														<FormItem
															key={paymentMethod}
															className="flex items-center space-x-3 space-y-0"
														>
															<FormControl>
																<RadioGroupItem
																	value={paymentMethod}
																	checked={field.value === paymentMethod}
																/>
															</FormControl>
															<FormLabel className="font-normal">
																{paymentMethod}
															</FormLabel>
														</FormItem>
													);
												})}
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex gap-2">
							<Button type="submit" disabled={isPending}>
								{isPending ? (
									<Loader className="w-4 h-4 animate-spin" />
								) : (
									<ArrowRight className="w-4 h-4" />
								)}{" "}
								Continue
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
};

export default PreferredPaymentMethodForm;
