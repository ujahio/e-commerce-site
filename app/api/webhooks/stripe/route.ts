import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { updateOrderToPaid } from "@/lib/actions/order.actions";

export async function POST(req: NextRequest) {
	const event = await Stripe.webhooks.constructEvent(
		await req.text(),
		req.headers.get("stripe-signature") as string,
		process.env.STRIPE_WEBHOOK_SECRET as string
	);

	if (event.type === "charge.succeeded") {
		const charge = event.data.object as Stripe.Charge;
		const orderId = charge.metadata.orderId;

		if (orderId) {
			await updateOrderToPaid({
				orderId,
				paymentResult: {
					id: charge.id,
					status: "COMPLETED",
					email_address: charge.billing_details.email!,
					price_paid: (charge.amount / 100).toFixed(),
				},
			});

			return NextResponse.json({
				message: "updateOrderToPaid was successful",
			});
		}
	}

	return NextResponse.json({
		message: "event is not charge.succeeded",
	});
}
