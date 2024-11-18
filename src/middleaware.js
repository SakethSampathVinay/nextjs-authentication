// middleware.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Get token from cookies
  const getCookies = cookies();
  const token = getCookies.get("token")?.value || "";

  // Check if the user is logged in (token exists)
  const isUserLoggedIn = token !== "";

  // If user is logged in, redirect them from sign-in or sign-up pages to the home page
  if ((path === "/sign-in" || path === "/sign-up") && isUserLoggedIn) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // If user is not logged in, redirect them to sign-in for any other routes (protected pages)
  if (!isUserLoggedIn && path !== "/sign-in" && path !== "/sign-up") {
    return NextResponse.redirect(new URL("/sign-in", request.nextUrl));
  }

  // Allow the request to continue if no redirect is needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in", "/sign-up", "/", "/profile", "/dashboard", "/protected/*", 
  ],
};
