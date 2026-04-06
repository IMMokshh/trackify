import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { rawInput, category } = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Groq API key not configured" }, { status: 500 });
    }

    const prompt = `You are a service request writer for a housing society app. A resident typed a rough note. Rewrite it as a clean, natural, one-sentence service request description.

Rules:
- Fix spelling and grammar automatically
- Write in third person but naturally — avoid robotic prefixes like "User needs assistance with" or "User is requesting"
- Match the intent: if they want to buy something, say "Wants to purchase..."; if something is broken, say what is broken and that it needs repair; if they need a service, describe the service naturally
- Keep it short — one sentence only
- Do NOT add filler phrases like "professional assessment needed" or "skilled labour required"
- Examples:
  - "I wanna renovote my 2 bhk with marbel tiling and false ceiling" → "Wants to renovate a 2 BHK home with marble flooring and false ceiling work."
  - "ac not cooling" → "AC is not cooling and needs a repair visit."
  - "need house cleaning" → "Looking for a home deep-cleaning service."
  - "I want cat litter" → "Wants to purchase cat litter for home use."
  - "laptop stopped working" → "Laptop has stopped working and needs repair."
  - "need yoga trainer" → "Looking for a personal yoga trainer at home."

Resident's input: "${rawInput}"
Service category: ${category || "general"}

Respond with ONLY the rewritten description — no quotes, no extra text, no JSON.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 80,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, error: "Groq error" }, { status: 500 });
    }

    const data = await response.json();
    const description = data.choices?.[0]?.message?.content?.trim();

    if (!description) {
      return NextResponse.json({ success: false, error: "No response" }, { status: 500 });
    }

    return NextResponse.json({ success: true, description });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
