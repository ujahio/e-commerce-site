import { expect, test, describe, jest } from "bun:test";
import { generarteAccessToken, paypal } from "./paypal";

describe("Paypal", () => {
	test("should generate access token", async () => {
		const token = await generarteAccessToken();
		expect(token).toBeDefined();
		expect(typeof token).toBe("string");
		expect(token.length).toBeGreaterThan(0);
	});

	test("creates a paypal order", async () => {
		const price = 10;
		const order = await paypal.createOrder(price);
		expect(order.id).toBeDefined();
		expect(order.status).toBeDefined();
		expect(order.status).toBe("CREATED");
	});

	test("simulates a payment with mock order", async () => {
		const orderId = "10";
		const mockCapturePayment = jest
			.spyOn(paypal, "capturePayment")
			.mockResolvedValue({
				status: "COMPLETED",
			});
		const capturePaymentResponse = await paypal.capturePayment(orderId);

		expect(capturePaymentResponse.status).toBe("COMPLETED");
		mockCapturePayment.mockRestore();
	});
});
