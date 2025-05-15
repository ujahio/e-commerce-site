import notFound from "@/app/not-found";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/order.actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const SuccessPage = async (props: {
	params: Promise<{
		id: string;
	}>;
	searchParams: Promise<{
		payment_intent: string;
	}>;
}) => {
	const { id } = await props.params;
	const { payment_intent: paymentIntentId } = await props.searchParams;

	const order = await getOrderById(id);
	if (!order) return notFound();

	const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

	if (
		paymentIntent.metadata.orderId == null ||
		paymentIntent.metadata.orderId !== order.id.toString()
	)
		return notFound();

	const isPaymentSuccess = paymentIntent.status === "succeeded";
	if (!isPaymentSuccess) redirect(`/order/${id}`);
	return (
		<div className="max-w-4xl w-full mx-auto space-y-8">
			<div className="flex flex-col gap-6 items-center">
				<h1 className="h1-bold">Thank you for your purchase</h1>
				<div className="text-center">
					We are processing your order and will send you an email confirmation
					shortly.
				</div>
				<Button asChild>
					<Link href={`/order/${id}`}>View Order</Link>
				</Button>
			</div>
		</div>
	);
};

export default SuccessPage;
