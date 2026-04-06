import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Lazy expire before fetching
    await supabaseAdmin
      .from("visitor_passes")
      .update({ status: "expired" })
      .eq("resident_id", user.id)
      .eq("status", "active")
      .lt("valid_until", new Date().toISOString());

    const { data: passes, error } = await supabaseAdmin
      .from("visitor_passes")
      .select("*")
      .eq("resident_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ passes });
  } catch (err: any) {
    console.error("Fetch passes error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
