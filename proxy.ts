import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isAuthPage = pathname === "/login" || pathname === "/register";
    const isProtectedPage = pathname === "/" || pathname.startsWith("/chat");

    // if both are false
    if (!isAuthPage && !isProtectedPage) {
        return NextResponse.next();
    }

    const isLoggedIn = request.cookies.get("chatify_logged_in")?.value === "true";

    if (isProtectedPage && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/chat/:path*", "/login/:path*", "/register/:path*"],
};
