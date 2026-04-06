import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Guard portal uses this endpoint with a guard PIN header (not user auth)
// Server-side only — service role key never exposed to client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const GUARD_PIN = process.env.GUARD_PIN || "1234";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { otp, guard_pin, guard_note } = body;

    // Validate guard PIN
    if (guard_pin !== GUARD_PIN) {
      return NextResponse.json({ error: "Invalid guard PIN" }, { status: 403 });
    }

    if (!otp || !/^[0-9]{6}$/.test(otp)) {
      return NextResponse.json({ error: "OTP must be 6 digits" }, { status: 400 });
    }

    // Look up the pass
    const { data: pass, error } = await supabaseAdmin
      .from("visitor_passes")
      .select("*")
      .eq("otp", otp)
      .maybeSingle();

    if (error) throw error;

    if (!pass) {
      return NextResponse.json({ error: "Invalid OTP. No pass found." }, { status: 404 });
    }

    // Check status
    if (pass.status === "used") {
      return NextResponse.json({ error: "This pass has already been used.", pass }, { status: 409 });
    }
    if (pass.status === "cancelled") {
      return NextResponse.json({ error: "This pass was cancelled by the resident.", pass }, { status: 410 });
    }
    if (pass.status === "expired" || new Date(pass.valid_until) < new Date()) {
      // Mark expired if not already
      await supabaseAdmin
        .from("visitor_passes")
        .update({ status: "expired" })
        .eq("id", pass.id);
      return NextResponse.json({ error: "This pass has expired.", pass }, { status: 410 });
    }

    // Valid — mark as used, record entry time
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("visitor_passes")
      .update({
        status:     "used",
        entry_time: new Date().toISOString(),
        guard_note: guard_note || null,
      })
      .eq("id", pass.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: `Entry approved for ${pass.visitor_name}`,
      pass: updated,
    });
  } catch (err: any) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
