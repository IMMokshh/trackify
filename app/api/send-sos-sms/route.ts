import { NextRequest, NextResponse } from 'next/server';

// Validate 10-digit Indian mobile number
function isValidIndianNumber(num: string): boolean {
  return /^[6-9]\d{9}$/.test(num);
}

// Sanitize message — strip HTML/script tags
function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").replace(/[<>"'`]/g, "").trim().substring(0, 500);
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.FAST2SMS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'SMS service not configured' }, { status: 503 });
    }

    const body = await request.json();
    const { to, message } = body;

    if (typeof to !== "string" || typeof message !== "string") {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }

    // Strip +91 / 91 prefix
    const number = to.replace(/^\+91|^91/, '').replace(/\s/g, '');

    if (!isValidIndianNumber(number)) {
      return NextResponse.json({ success: false, error: 'Invalid phone number' }, { status: 400 });
    }

    const safeMessage = sanitize(message);
    if (!safeMessage) {
      return NextResponse.json({ success: false, error: 'Empty message' }, { status: 400 });
    }

    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json',
        'cache-control': 'no-cache',
      },
      body: JSON.stringify({ 
        route: 'q',
        message: safeMessage, 
        numbers: number, 
        flash: 0 
      }),
    });

    let data: any = {};
    try { data = await response.json(); } catch { /* empty */ }

    // Log for debugging
    console.log('[SMS] Fast2SMS response:', JSON.stringify(data));

    if (data.return === true) {
      return NextResponse.json({ success: true, messageId: data.request_id });
    }

    return NextResponse.json({ 
      success: false, 
      error: data.message ? JSON.stringify(data.message) : 'SMS delivery failed' 
    }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
