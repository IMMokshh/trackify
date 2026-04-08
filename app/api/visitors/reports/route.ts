import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALLOWED_BADGES = ["Guard", "Chairwoman", "Chairman", "Secretary", "Committee", "Treasurer"];

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Role check
    const { data: member } = await supabaseAdmin
      .from("society_members")
      .select("badge")
      .eq("email", user.email)
      .single();

    if (!member || !ALLOWED_BADGES.includes(member.badge)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const search = searchParams.get("search") || "";

    let query = supabaseAdmin
      .from("visitor_passes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (from) query = query.gte("created_at", new Date(from).toISOString());
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      query = query.lte("created_at", toDate.toISOString());
    }
    if (search) {
      query = query.or(`visitor_name.ilike.%${search}%,visitor_phone.ilike.%${search}%,flat_number.ilike.%${search}%`);
    }

    const { data: passes, error } = await query;
    if (error) throw error;

    return NextResponse.json({ passes });
  } catch (err: any) {
    console.error("Reports error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
