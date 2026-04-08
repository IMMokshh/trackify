import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const GUARD_PIN = process.env.GUARD_PIN || "1234";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { otp, guard_pin, guard_note } = body;

    if (guard_pin !== GUARD_PIN) {
      return NextResponse.json({ error: "Invalid guard PIN" }, { status: 403 });
    }

    if (!otp || !/^[0-9]{6}$/.test(otp)) {
      return NextResponse.json({ error: "OTP must be 6 digits" }, { status: 400 });
    }

    const { data: pass, error } = await supabaseAdmin
      .from("visitor_passes")
      .select("*")
      .eq("otp", otp)
      .maybeSingle();

    if (error) throw error;
    if (!pass) return NextResponse.json({ error: "Invalid OTP. No pass found." }, { status: 404 });

    if (pass.status === "inside") return NextResponse.json({ error: "Visitor already inside. Use Exit OTP to record exit." }, { status: 409 });
    if (pass.status === "exited") return NextResponse.json({ error: "Visitor has already exited." }, { status: 409 });
    if (pass.status === "used")   return NextResponse.json({ error: "This pass has already been used." }, { status: 409 });
    if (pass.status === "cancelled") return NextResponse.json({ error: "This pass was cancelled by the resident." }, { status: 410 });
    if (pass.status === "expired" || new Date(pass.valid_until) < new Date()) {
      await supabaseAdmin.from("visitor_passes").update({ status: "expired" }).eq("id", pass.id);
      return NextResponse.json({ error: "This pass has expired." }, { status: 410 });
    }

    // Exit OTP was already generated at pass creation — just mark as inside
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("visitor_passes")
      .update({
        status:     "inside",
        entry_time: new Date().toISOString(),
        guard_note: guard_note || null,
      })
      .eq("id", pass.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: `Entry verified for ${pass.visitor_name}`,
      pass: updated,
    });
  } catch (err: any) {
    console.error("Verify entry OTP error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
