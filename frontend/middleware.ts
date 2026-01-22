import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/projects", "/app"];

// Routes that should redirect to /projects if already authenticated
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for access token in cookies (we'll need to also store in cookies for middleware)
  // For now, we'll handle this client-side since localStorage isn't available in middleware
  // This middleware will handle basic route structure

  // For protected routes, we'll let the client-side auth handle the redirect
  // This is a common pattern with JWT stored in localStorage

  // If user tries to access auth routes while having a token cookie, redirect to projects
  const token = request.cookies.get("lorely_access_token")?.value;

  if (token && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\..*|_next).*)",
  ],
};
