import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// Routes that require authentication
const PROTECTED_PREFIXES = ["/dashboard", "/api/razorpay", "/api/send-sos-sms", "/api/aria", "/api/classify-issue", "/api/clean-description", "/api/smart-service-match", "/api/payment-notification"];

// Routes only admins can access
const ADMIN_ONLY = ["/dashboard/admin"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // Check if route needs protection
  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!needsAuth) return res;

  try {
    const supabase = createMiddlewareClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();

    // Not logged in → redirect to login
    if (!session) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Admin-only route check
    const isAdminRoute = ADMIN_ONLY.some((p) => pathname.startsWith(p));
    if (isAdminRoute) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role !== "admin") {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return res;
  } catch {
    // On any auth error, fail safe
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/razorpay/:path*",
    "/api/send-sos-sms",
    "/api/aria",
    "/api/classify-issue",
    "/api/clean-description",
    "/api/smart-service-match",
    "/api/payment-notification",
  ],
};
