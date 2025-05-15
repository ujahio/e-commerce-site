import { loadStripe } from "@stripe/stripe-js";
import {
	PaymentElement,
	Elements,
	useStripe,
	useElements,
	LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { SERVER_URL } from "@/lib/constants";

const StripePayment = ({
	priceInCents,
	orderId,
	clientSecret,
}: {
	priceInCents: number;
	orderId: string;
	clientSecret: string;
}) => {
	const stripePromise = loadStripe(
		process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
	);
	const { theme, systemTheme } = useTheme();

	const StripeForm = () => {
		const stripe = useStripe();
		const elements = useElements();

		const [isLoading, setIsLoading] = useState(false);
		const [errorMessage, setErrorMessage] = useState<string | null>("");
		const [email, setEmail] = useState<string | null>("");

		const handleSubmit = async (e: React.FormEvent) => {
			e.preventDefault();
			if (!stripe || !elements || !email) {
				return;
			}

			setIsLoading(true);
			const { error } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`,
				},
			});

			if (error) {
				setErrorMessage(error.message || "An unknown error occurred");
				setIsLoading(false);
			}
		};

		return (
			<form className="space-y-4" onSubmit={handleSubmit}>
				<div className="text-xl">Stripe Checkout</div>
				{errorMessage && <div className="text-destructive">{errorMessage}</div>}
				<PaymentElement />
				<div>
					<LinkAuthenticationElement
						onChange={(e) => setEmail(e.value.email)}
					/>
				</div>
				<Button
					className="w-full"
					size="lg"
					disabled={stripe == null || elements == null || isLoading}
				>
					{isLoading
						? "Purchasing..."
						: `Purchase ${formatCurrency(priceInCents / 100)}`}
				</Button>
			</form>
		);
	};

	return (
		<Elements
			stripe={stripePromise}
			options={{
				clientSecret,
				appearance: {
					theme:
						theme === "dark"
							? "night"
							: theme === "light"
							? "stripe"
							: systemTheme === "light"
							? "stripe"
							: "night",
				},
			}}
		>
			<StripeForm />
		</Elements>
	);
};
export default StripePayment;
