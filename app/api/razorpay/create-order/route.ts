import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// Validate amount is a positive integer in paise (min ₹1 = 100 paise)
function isValidAmount(amount: unknown): amount is number {
  return typeof amount === "number" && Number.isInteger(amount) && amount >= 100 && amount <= 10_000_000;
}

export async function POST(request: NextRequest) {
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ success: false, error: "Payment service not configured" }, { status: 503 });
    }

    const body = await request.json();
    const { amount, currency, receipt } = body;

    // Server-side amount validation — prevents client-side tampering
    if (!isValidAmount(amount)) {
      return NextResponse.json({ success: false, error: "Invalid amount" }, { status: 400 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount,
      currency: currency === "INR" ? "INR" : "INR", // only INR allowed
      receipt: receipt ? String(receipt).substring(0, 40) : `rcpt_${Date.now()}`,
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    // Log internally but never expose raw error to client
    console.error("[razorpay/create-order]", error?.error?.description || error?.message);
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}
