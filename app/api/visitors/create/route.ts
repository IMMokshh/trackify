import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service role client - bypasses RLS for server-side ops
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    // Get auth token from request header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");

    // Verify the user via their JWT
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { visitor_name, visitor_phone, purpose, valid_from, valid_until } = body;

    // Basic validation
    if (!visitor_name || visitor_name.trim().length < 2) {
      return NextResponse.json({ error: "Visitor name must be at least 2 characters" }, { status: 400 });
    }
    if (visitor_phone && !/^[0-9]{10}$/.test(visitor_phone)) {
      return NextResponse.json({ error: "Phone must be 10 digits" }, { status: 400 });
    }

    // Get resident's flat number from society_members
    const { data: member } = await supabaseAdmin
      .from("society_members")
      .select("flat_number")
      .eq("email", user.email)
      .single();

    if (!member) return NextResponse.json({ error: "Resident not found" }, { status: 404 });

    // Lazy expire: mark any overdue active passes as expired before creating new one
    await supabaseAdmin
      .from("visitor_passes")
      .update({ status: "expired" })
      .eq("resident_id", user.id)
      .eq("status", "active")
      .lt("valid_until", new Date().toISOString());

    // Generate unique OTP (retry if collision on active passes)
    let otp = generateOTP();
    let attempts = 0;
    while (attempts < 5) {
      const { data: existing } = await supabaseAdmin
        .from("visitor_passes")
        .select("id")
        .eq("otp", otp)
        .eq("status", "active")
        .maybeSingle();
      if (!existing) break;
      otp = generateOTP();
      attempts++;
    }

    const fromTime = valid_from ? new Date(valid_from).toISOString() : new Date().toISOString();
    const untilTime = valid_until
      ? new Date(valid_until).toISOString()
      : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const { data: pass, error: insertError } = await supabaseAdmin
      .from("visitor_passes")
      .insert({
        resident_id:   user.id,
        flat_number:   member.flat_number,
        visitor_name:  visitor_name.trim(),
        visitor_phone: visitor_phone || null,
        purpose:       purpose || "Guest",
        otp,
        valid_from:    fromTime,
        valid_until:   untilTime,
        status:        "active",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ success: true, pass }, { status: 201 });
  } catch (err: any) {
    console.error("Create visitor pass error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
