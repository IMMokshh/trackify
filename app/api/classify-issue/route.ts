import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { roughNote } = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Groq API key not configured' }, { status: 500 });
    }

    const prompt = `You are a society management assistant. A resident typed a rough note about an issue. Generate a proper complaint report.

Resident's note: "${roughNote}"

Respond ONLY with valid JSON, no markdown, no code blocks, no extra text:
{"title":"Clear professional issue title max 8 words","description":"Detailed 2-3 sentence description of the problem its impact and urgency","category":"Plumbing","priority":"high","department":"Maintenance Team"}

category must be exactly one of: Plumbing, Electrical, Maintenance, Security, Parking, Amenities, Housekeeping, Noise, Other
priority must be exactly one of: low, medium, high, critical
department must be exactly one of: Maintenance Team, Security Team, Admin Office, Housekeeping, Management Committee`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.2,
      }),
    });

    const rawText = await response.text();
    console.log('Groq status:', response.status);
    console.log('Groq response:', rawText);

    if (!response.ok) {
      return NextResponse.json({ success: false, error: `Groq ${response.status}: ${rawText}` }, { status: 500 });
    }

    const data = JSON.parse(rawText);
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return NextResponse.json({ success: false, error: 'No content from Groq' }, { status: 500 });
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ success: false, error: 'Could not parse response', content }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ success: true, ...result });

  } catch (error: any) {
    console.error('classify-issue error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
