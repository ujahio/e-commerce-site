const BASE = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

const handleResponse = async (res: Response) => {
	if (res.ok) {
		return res.json();
	} else {
		const errorMessage = await res.text();
		throw new Error(errorMessage);
	}
};

const generarteAccessToken = async () => {
	const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;
	const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString(
		"base64"
	);

	const res = await fetch(`${BASE}/v1/oauth2/token`, {
		method: "POST",
		body: "grant_type=client_credentials",
		headers: {
			Authorization: `Basic ${auth}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});

	const responseData = await handleResponse(res);

	return responseData.access_token;
};

export const paypal = {
	createOrder: async (price: number) => {
		const accessToken = await generarteAccessToken();
		const res = await fetch(`${BASE}/v2/checkout/orders`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				intent: "CAPTURE",
				purchase_units: [
					{
						amount: {
							currency_code: "USD",
							value: price,
						},
					},
				],
			}),
		});
		return await handleResponse(res);
	},
	capturePayment: async (orderId: string) => {
		const accessToken = await generarteAccessToken();
		const res = await fetch(`${BASE}/v2/checkout/orders/${orderId}/capture`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});
		return await handleResponse(res);
	},
};

export { generarteAccessToken };
