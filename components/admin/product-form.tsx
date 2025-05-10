"use client";

import slugify from "slugify";
import { productDefaultValues } from "@/lib/constants";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { toast } from "sonner";

const ProductForm = ({
	type,
	product,
	productId,
}: {
	type: "Create" | "Update";
	product?: Product;
	productId?: string;
}) => {
	const router = useRouter();

	const form = useForm<z.infer<typeof insertProductSchema>>({
		resolver:
			type === "Update"
				? zodResolver(updateProductSchema)
				: zodResolver(insertProductSchema),
		defaultValues:
			product && type === "Update" ? product : productDefaultValues,
	});

	const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
		values
	) => {
		console.log("Form Values", values);
		if (type === "Create") {
			const res = await createProduct(values);
			if (!res.success) toast.error(res.message);
			toast.success(res.message);
			router.push("/admin/products");
		}

		if (type === "Update") {
			if (!productId) {
				router.push("/admin/products");
				return;
			}
			const res = await updateProduct({ ...values, id: productId });
			if (!res.success) toast.error(res.message);
			toast.success(res.message);
			router.push("/admin/products");
		}
	};

	return (
		<Form {...form}>
			<form
				className="space-y-8"
				method="POST"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className="flex flex-col md:flex-row gap-5">
					{/* Name */}
					<FormField
						control={form.control}
						name="name"
						render={({
							field,
						}: {
							field: ControllerRenderProps<
								z.infer<typeof insertProductSchema>,
								"name"
							>;
						}) => (
							<FormItem className="w-full">
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder="Product Name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* Slug */}
					<FormField
						control={form.control}
						name="slug"
						render={({
							field,
						}: {
							field: ControllerRenderProps<
								z.infer<typeof insertProductSchema>,
								"slug"
							>;
						}) => (
							<FormItem className="w-full">
								<FormLabel>Slug</FormLabel>
								<FormControl>
									<div className="relative">
										<Input placeholder="Enter slug" {...field} />
										<Button
											type="button"
											className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2"
											onClick={() => {
												form.setValue(
													"slug",
													slugify(form.getValues("name"), {
														lower: true,
													})
												);
											}}
										>
											Generate
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex flex-col md:flex-row gap-5">
					{/* Category */}
					<FormField
						control={form.control}
						name="category"
						render={({
							field,
						}: {
							field: ControllerRenderProps<
								z.infer<typeof insertProductSchema>,
								"category"
							>;
						}) => (
							<FormItem className="w-full">
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder="Enter category" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* Brand */}
					<FormField
						control={form.control}
						name="brand"
						render={({
							field,
						}: {
							field: ControllerRenderProps<
								z.infer<typeof insertProductSchema>,
								"brand"
							>;
						}) => (
							<FormItem className="w-full">
								<FormLabel>Brand</FormLabel>
								<FormControl>
									<Input placeholder="Enter brand" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex flex-col md:flex-row gap-5">
					{/* Price */}
					<FormField
						control={form.control}
						name="price"
						render={({
							field,
						}: {
							field: ControllerRenderProps<
								z.infer<typeof insertProductSchema>,
								"price"
							>;
						}) => (
							<FormItem className="w-full">
								<FormLabel>Price</FormLabel>
								<FormControl>
									<Input placeholder="Enter product price" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* Stock */}
					<FormField
						control={form.control}
						name="stock"
						render={({
							field,
						}: {
							field: ControllerRenderProps<
								z.infer<typeof insertProductSchema>,
								"stock"
							>;
						}) => (
							<FormItem className="w-full">
								<FormLabel>Stock</FormLabel>
								<FormControl>
									<Input placeholder="Enter Stock" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex flex-col md:flex-row gap-5">{/* Images */}</div>
				<div className="upload-field">{/* isFeatured */}</div>
				<div className="">
					{/* Description */}
					<FormField
						control={form.control}
						name="description"
						render={({
							field,
						}: {
							field: ControllerRenderProps<
								z.infer<typeof insertProductSchema>,
								"description"
							>;
						}) => (
							<FormItem className="w-full">
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Enter product description"
										{...field}
										className="resize-none"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div>
					<Button
						type="submit"
						size="lg"
						disabled={form.formState.isSubmitting}
						className="button col-span-2 w-full"
					>
						{form.formState.isSubmitting ? "Submitting" : `${type} Product`}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default ProductForm;
