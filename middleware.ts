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

	return NextResponse.next();
}

export const config = {
	matcher: [
		// Apply this middleware to all routes except static files, images, etc.
		"/((?!api|_next/static|_next/image|favicon.ico|images).*)",
	],
};
