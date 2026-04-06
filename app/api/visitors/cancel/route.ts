import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Pass ID required" }, { status: 400 });

    // Ensure resident owns this pass
    const { data: pass } = await supabaseAdmin
      .from("visitor_passes")
      .select("id, status, resident_id")
      .eq("id", id)
      .single();

    if (!pass) return NextResponse.json({ error: "Pass not found" }, { status: 404 });
    if (pass.resident_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (pass.status !== "active") {
      return NextResponse.json({ error: `Cannot cancel a pass with status: ${pass.status}` }, { status: 409 });
    }

    await supabaseAdmin
      .from("visitor_passes")
      .update({ status: "cancelled" })
      .eq("id", id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Cancel pass error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
