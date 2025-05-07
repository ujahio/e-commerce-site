import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	// Set the sessionCartId if it doesn't exist
	if (!request.cookies.get("sessionCartId")) {
		const sessionCartId = crypto.randomUUID();

		const newRequestHeaders = new Headers(request.headers); // clone request headers maintaining its previous state

		const response = NextResponse.next({
			request: {
				headers: newRequestHeaders,
			},
		});
		response.cookies.set("sessionCartId", sessionCartId);
		return response;
	}

	const { pathname } = request.nextUrl;
	const protectedRoutes = [
		/\/shipping-address/,
		/\/payment-method/,
		/\/place-order/,
		/\/profile/,
		/\/admin/,
		/\/order\/(.*)/,
		/\/user\/(.*)/,
	];

	// Check if the current path matches any protected route
	const isProtectedRoute = protectedRoutes.some((pattern) =>
		pattern.test(pathname)
	);

	// If this is a protected route, verify authentication
	if (isProtectedRoute) {
		// Check for NextAuth.js session token in cookies
		const sessionToken = request.cookies.get("authjs.session-token")?.value;

		// For secure environments, check for the secure cookie
		const secureSessionToken = request.cookies.get(
			"__Secure-authjs.session-token"
		)?.value;

		// If no session token exists, redirect to login
		if (!sessionToken && !secureSessionToken) {
			const url = new URL("/sign-in", request.url);
			// Add the original path as a redirect parameter
			url.searchParams.set("callbackUrl", pathname);
			return NextResponse.redirect(url);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		// Apply this middleware to all routes except static files, images, etc.
		"/((?!api|_next/static|_next/image|favicon.ico|images).*)",
	],
};
