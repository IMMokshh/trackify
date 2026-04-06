import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

const ADMIN_ONLY = ["/dashboard/admin"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  try {
    const supabase = createMiddlewareClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();

    // Admin-only route check
    const isAdminRoute = ADMIN_ONLY.some((p) => pathname.startsWith(p));
    if (isAdminRoute && session) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return res;
  } catch {
    return res;
  }
}

export const config = {
  matcher: ["/dashboard/admin/:path*"],
};
