"use client";

import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<Image
				src="/images/logo.svg"
				width={48}
				height={48}
				alt={`${APP_NAME} logo`}
				priority={true}
			/>
			<p className="mt-4 text-lg text-destructive">
				Sorry, the page you are looking for does not exist.
			</p>
			<Button
				variant="outline"
				className="mt-4 ml-2"
				onClick={() => (window.location.href = "/")}
			>
				Home
			</Button>
		</div>
	);
};

export default NotFoundPage;
