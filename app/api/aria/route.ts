import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter — max 30 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 30) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "AI service not configured" }, { status: 503 });
    }

    const body = await request.json();
    const { messages, systemPrompt } = body;

    // Validate input
    if (!Array.isArray(messages)) {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }

    // Sanitize and filter messages
    const filteredMessages = messages
      .filter((m: any) => m.role === "user" || m.role === "assistant")
      .map((m: any) => ({
        role: m.role,
        // Strip HTML and limit length
        content: String(m.content || "")
          .replace(/<[^>]*>/g, "")
          .replace(/\bundefined\b/g, "")
          .replace(/\s{2,}/g, " ")
          .trim()
          .substring(0, 2000),
      }))
      .filter((m: any) => m.content.length > 0)
      .slice(-20); // max 20 messages in history

    const safeSystemPrompt = String(systemPrompt || "").substring(0, 4000);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: safeSystemPrompt },
          ...filteredMessages,
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error("[aria] Groq error:", response.status);
      return NextResponse.json({ success: false, error: "AI service error" }, { status: 500 });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content?.trim() || "";
    const content = raw
      .replace(/\bundefined\b/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    return NextResponse.json({ success: true, content });
  } catch {
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}
