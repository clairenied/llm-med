import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Public routes that don't require authentication
  const publicRoutes = [
    "/auth/signin",
    "/auth/signup", 
    "/auth/error",
    "/auth/unauthorized",
    "/api/auth",
  ]

  // Admin-only routes
  const adminRoutes = [
    "/admin"
  ]

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route) || pathname === route
  )

  // Allow access to public routes and API auth routes
  if (isPublicRoute || pathname.startsWith("/api/auth/")) {
    return NextResponse.next()
  }

  // Redirect to signin if not logged in
  if (!isLoggedIn) {
    const signInUrl = new URL("/auth/signin", req.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Check admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (req.auth?.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/unauthorized", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
