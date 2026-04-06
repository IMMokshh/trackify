import { NextRequest, NextResponse } from "next/server";

// Payment email notification — amount is stored in DB as rupees (NOT paise)
// This fixes the ₹3500 → ₹35 bug caused by accidentally dividing by 100
export async function POST(request: NextRequest) {
  try {
    const { email, name, amount, title, paymentId, paidDate } = await request.json();

    // amount here is in RUPEES (from DB) — never divide by 100
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount)); // e.g. ₹3,500

    // Log for debugging — remove in production
    console.log(`Payment notification: ${name} paid ${formattedAmount} for ${title}`);

    // TODO: integrate with Resend / Nodemailer / SendGrid
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "noreply@societyhub.in",
    //   to: email,
    //   subject: `Payment Confirmed: ${formattedAmount} for ${title}`,
    //   html: `<p>Dear ${name},</p><p>Your payment of <strong>${formattedAmount}</strong> for <strong>${title}</strong> has been received.</p><p>Transaction ID: ${paymentId}</p><p>Date: ${paidDate}</p>`,
    // });

    return NextResponse.json({ success: true, formattedAmount });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
