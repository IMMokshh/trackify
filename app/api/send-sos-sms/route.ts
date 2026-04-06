import { NextRequest, NextResponse } from 'next/server';

function isValidIndianNumber(num: string): boolean {
  return /^[6-9]\d{9}$/.test(num);
}

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").replace(/[<>"'`]/g, "").trim().substring(0, 500);
}

export async function POST(request: NextRequest) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json({ success: false, error: 'SMS service not configured' }, { status: 503 });
    }

    const body = await request.json();
    const { to, message } = body;

    if (typeof to !== "string" || typeof message !== "string") {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }

    const number = to.replace(/^\+91|^91/, '').replace(/\s/g, '');
    if (!isValidIndianNumber(number)) {
      return NextResponse.json({ success: false, error: 'Invalid phone number' }, { status: 400 });
    }

    const safeMessage = sanitize(message);
    const toNumber = `+91${number}`;

    // Twilio REST API
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: toNumber,
          Body: safeMessage,
        }).toString(),
      }
    );

    const data = await response.json();
    console.log('[SMS] Twilio response:', JSON.stringify(data));

    if (data.sid) {
      return NextResponse.json({ success: true, messageId: data.sid });
    }

    return NextResponse.json({
      success: false,
      error: data.message || 'SMS delivery failed'
    }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
