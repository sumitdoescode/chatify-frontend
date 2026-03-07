import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isAuthPage = pathname === "/login" || pathname === "/register";
    const isProtectedPage = pathname === "/" || pathname === "/chat";

    if (!isAuthPage && !isProtectedPage) {
        return NextResponse.next();
    }

    let isLoggedIn = false;

    try {
        const res = await fetch(`${process.env.BACKEND_URL}/api/users/me`, {
            headers: {
                cookie: request.headers.get("cookie") ?? "",
            },
            cache: "no-store",
        });

        isLoggedIn = res.status === 200;
    } catch {
        isLoggedIn = false;
    }

    console.log({ isProtectedPage, isLoggedIn });

    if (isProtectedPage && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/:path*", "/chat/:path*", "/login/:path*", "/register/:path*"],
};
