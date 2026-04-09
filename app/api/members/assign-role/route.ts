import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALLOWED_BADGES = ["Chairwoman", "Chairman", "Secretary", "Committee", "Committee Member", "Treasurer"];
const VALID_ROLES = ["Resident", "Committee", "Committee Member", "Secretary", "Treasurer", "Guard", "Chairwoman", "Chairman"];

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check if requester has permission
    const { data: requester } = await supabaseAdmin
      .from("society_members")
      .select("badge, email")
      .eq("email", user.email)
      .single();

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = profile?.role === "admin";
    const isAuthorized = isAdmin || ALLOWED_BADGES.includes(requester?.badge || "");

    if (!isAuthorized) {
      return NextResponse.json({ error: "You do not have permission to assign roles" }, { status: 403 });
    }

    const { memberId, newRole } = await req.json();

    if (!memberId || !newRole) {
      return NextResponse.json({ error: "memberId and newRole are required" }, { status: 400 });
    }

    if (!VALID_ROLES.includes(newRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Update badge in society_members
    const { error: updateError } = await supabaseAdmin
      .from("society_members")
      .update({ badge: newRole })
      .eq("id", memberId);

    if (updateError) throw updateError;

    // Also sync role in profiles table if member has an account
    const { data: member } = await supabaseAdmin
      .from("society_members")
      .select("email")
      .eq("id", memberId)
      .single();

    if (member?.email) {
      const profileRole = ["Chairwoman", "Chairman", "Secretary", "Committee", "Committee Member", "Treasurer"].includes(newRole)
        ? "admin"
        : newRole === "Guard"
          ? "guard"
          : "resident";

      // Look up profile by email via profiles table directly
      const { data: targetProfile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", member.email)
        .maybeSingle();

      if (targetProfile?.id) {
        await supabaseAdmin
          .from("profiles")
          .update({ role: profileRole })
          .eq("id", targetProfile.id);
      }
    }

    return NextResponse.json({ success: true, message: `Role updated to ${newRole}` });
  } catch (err: any) {
    console.error("Assign role error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
