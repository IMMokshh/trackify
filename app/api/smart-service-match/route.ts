import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query, categories } = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Groq API key not configured" }, { status: 500 });
    }

    const categoryList = categories.map((c: any) => `${c.id}: ${c.name}`).join(", ");

    const prompt = `You are a precise service-matching assistant for a residential housing society app in India.

A resident submitted this query: "${query}"

STEP 1 — Detect intent. Classify the query as exactly ONE of:
- "purchase": user wants to buy a product (e.g. cat litter, groceries, furniture)
- "repair": user reports something broken or not working (e.g. AC not cooling, tap leaking)
- "service": user needs a service performed (e.g. cleaning, installation, grooming, tutoring)
- "inquiry": user is asking a general question or is unclear

STEP 2 — Write a short, natural description of the request in one sentence.
Rules:
- Write it like a clean service request, not a template
- DO NOT use phrases like "User needs assistance with", "User is requesting", "User requires"
- DO NOT add generic filler like "professional assessment needed" or "skilled labour required"
- DO NOT assume repair unless the user explicitly says something is broken or not working
- Use natural, direct language — as if a human wrote the request clearly
- Examples:
  - "I want cat litter" → "Wants to purchase cat litter for home use."
  - "AC not cooling" → "AC is not cooling and needs a repair visit."
  - "Need house cleaning" → "Looking for a home deep-cleaning service."
  - "I wanna renovate my 2 bhk with false ceiling" → "Wants to renovate a 2 BHK home with false ceiling work."
  - "laptop not working" → "Laptop has stopped working and needs repair."
  - "need yoga classes" → "Looking for home yoga sessions."

STEP 3 — Match to 3–5 relevant categories from this list ONLY: ${categoryList}
Rules:
- DO NOT mismatch intent to category (e.g. pet purchase → do NOT suggest repair categories)
- Use exact category IDs from the list
- Order by relevance, most relevant first
- If intent is "purchase", prefer categories like courier, food, pet, etc.
- If intent is "repair", prefer categories like plumbing, electrical, appliance, ac, vehicle, etc.
- If intent is "service", prefer categories like cleaning, gardening, beauty, fitness, laundry, etc.

STEP 4 — Estimate cost based on intent and category (Indian market, INR):
- purchase: Rs. 100 – Rs. 2,000 (unless high-value item)
- repair: Rs. 300 – Rs. 5,000 (depends on complexity)
- service: Rs. 200 – Rs. 3,000 (depends on scope)
- If unclear: use category default range

Respond ONLY with valid JSON, no markdown, no extra text:
{
  "intent": "purchase|repair|service|inquiry",
  "description": "One clear sentence matching the intent",
  "estimatedCost": "Rs. X – Rs. Y",
  "matches": [
    {"categoryId": "exact_id", "reason": "one short sentence why this matches", "confidence": "high|medium"}
  ],
  "summary": "one sentence describing what the user needs"
}

CRITICAL: Return 3–5 matches. Use exact category IDs. Do not hallucinate categories not in the list. Do not assume intent not stated.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ success: false, error: err }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    const jsonMatch = content?.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ success: false, error: "Could not parse response" }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);

    // Validate matches exist and have required fields
    if (!Array.isArray(result.matches) || result.matches.length === 0) {
      return NextResponse.json({ success: false, error: "No matches returned" }, { status: 500 });
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
