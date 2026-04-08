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
    const { exit_otp, guard_pin } = body;

    if (guard_pin !== GUARD_PIN) {
      return NextResponse.json({ error: "Invalid guard PIN" }, { status: 403 });
    }

    if (!exit_otp || !/^[0-9]{6}$/.test(exit_otp)) {
      return NextResponse.json({ error: "Exit OTP must be 6 digits" }, { status: 400 });
    }

    // Look up pass by exit OTP — MUST be status 'inside'
    const { data: pass, error } = await supabaseAdmin
      .from("visitor_passes")
      .select("*")
      .eq("exit_otp", exit_otp)
      .maybeSingle();

    if (error) throw error;

    if (!pass) {
      return NextResponse.json({ error: "Invalid Exit OTP. No matching pass found." }, { status: 404 });
    }

    // Critical: exit only works if visitor is currently inside
    if (pass.status !== "inside") {
      if (pass.status === "exited") {
        return NextResponse.json({ error: "Visitor has already exited." }, { status: 409 });
      }
      if (pass.status === "active") {
        return NextResponse.json({ error: "Visitor has not entered yet. Entry OTP must be verified first." }, { status: 409 });
      }
      return NextResponse.json({ error: "Exit not allowed for this pass status." }, { status: 409 });
    }

    // Check exit OTP expiry
    if (pass.exit_otp_expires_at && new Date(pass.exit_otp_expires_at) < new Date()) {
      return NextResponse.json({ error: "Exit OTP has expired. Contact resident for a new pass." }, { status: 410 });
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("visitor_passes")
      .update({
        status:    "exited",
        exit_time: new Date().toISOString(),
        exit_otp:  null, // invalidate after use
      })
      .eq("id", pass.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: `Exit recorded for ${pass.visitor_name}`,
      pass: updated,
    });
  } catch (err: any) {
    console.error("Verify exit OTP error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
