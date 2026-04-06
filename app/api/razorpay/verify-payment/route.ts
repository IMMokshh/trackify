import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Never fall back to a hardcoded secret
    if (!keySecret) {
      return NextResponse.json({ success: false, error: "Payment service not configured" }, { status: 503 });
    }

    const { orderId, paymentId, signature } = await request.json();

    // Validate all fields are present and are strings
    if (
      typeof orderId !== "string" || !orderId.trim() ||
      typeof paymentId !== "string" || !paymentId.trim() ||
      typeof signature !== "string" || !signature.trim()
    ) {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }

    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    // Use timing-safe comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature, "hex"),
      Buffer.from(signature.padEnd(generatedSignature.length, "0").substring(0, generatedSignature.length), "hex")
    );

    return NextResponse.json({ success: true, isValid });
  } catch {
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}
