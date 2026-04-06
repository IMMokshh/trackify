import { supabase } from "./supabase";

export interface AriaContext {
  userId: string;
  userEmail: string;
  flatNumber: string;
  fullName: string;
  role: string;
  badge: string;
}

export interface AriaMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function getAriaContext(): Promise<AriaContext | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: member } = await supabase
    .from("society_members")
    .select("*")
    .eq("email", user.email)
    .single();

  return {
    userId: user.id,
    userEmail: user.email || "",
    flatNumber: profile?.flat_number || member?.flat_number || "",
    fullName: profile?.full_name || member?.full_name || "",
    role: profile?.role || "resident",
    badge: member?.badge || "Resident",
  };
}

export async function getContextualData(context: AriaContext) {
  const results = await Promise.allSettled([
    supabase.from("issues").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("payments").select("*", { count: "exact", head: true }).eq("user_id", context.userId).eq("status", "pending"),
    supabase.from("amenity_bookings").select("*").eq("user_id", context.userId).gte("booking_date", new Date().toISOString().split("T")[0]).limit(3),
    context.flatNumber
      ? supabase.from("visitor_passes").select("*").eq("flat_number", context.flatNumber).eq("status", "active").limit(5)
      : Promise.resolve({ data: [] }),
  ]);

  const openIssues = results[0].status === "fulfilled" ? (results[0].value as any).count || 0 : 0;
  const pendingPayments = results[1].status === "fulfilled" ? (results[1].value as any).count || 0 : 0;
  const upcomingBookings = results[2].status === "fulfilled" ? (results[2].value as any).data || [] : [];
  const recentVisitors = results[3].status === "fulfilled" ? (results[3].value as any).data || [] : [];

  return {
    openIssues,
    pendingPayments,
    upcomingBookings,
    recentVisitors,
  };
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function buildSystemPrompt(context: AriaContext, contextData: any): string {
  const name = context.fullName || "Resident";
  const flat = context.flatNumber || "N/A";
  const role = context.role || "resident";
  const badge = context.badge || "Resident";
  const openIssues = contextData?.openIssues ?? 0;
  const pendingPayments = contextData?.pendingPayments ?? 0;
  const bookingsCount = Array.isArray(contextData?.upcomingBookings) ? contextData.upcomingBookings.length : 0;
  const visitorsCount = Array.isArray(contextData?.recentVisitors) ? contextData.recentVisitors.length : 0;

  return `You are Aria, a warm, intelligent AI assistant for ${name} at Greenwood Heights Co-operative Housing Society.

RESIDENT CONTEXT:
- Name: ${name}
- Flat: ${flat}
- Role: ${role}
- Badge: ${badge}
- Time greeting: ${getTimeGreeting()}

CURRENT STATUS:
- Open issues in society: ${openIssues}
- Pending payments: ${pendingPayments}
- Upcoming bookings: ${bookingsCount}
- Active visitor passes: ${visitorsCount}

MULTILINGUAL INSTRUCTIONS (CRITICAL — HIGHEST PRIORITY):
- This system supports 100+ languages with automatic detection and response matching
- DETECT the language of every user message independently — no user instruction needed
- ALWAYS respond in the EXACT same language the user wrote in, every single time
- English input → English response
- Hindi input → Hindi response
- Marathi input → Marathi response
- Gujarati, Tamil, Telugu, Punjabi, Bengali, Urdu, Kannada, Arabic, French, Spanish, German, or ANY other language → respond in that exact language
- If the user writes in Hinglish or any mixed/code-switched style → respond in the same mixed style naturally
- If the user switches language mid-conversation → adapt immediately, no questions asked
- NEVER translate unless the user explicitly asks for a translation
- NEVER mix languages unless the user does first
- NEVER ask the user which language to use
- NEVER override the user's language preference
- NEVER default to English unless the input is genuinely unclear
- Match the user's tone exactly — formal, informal, casual, slang — whatever they use

PERSONALITY:
- Warm, friendly, and human — like a helpful neighbor, not a corporate bot
- Use the resident's first name occasionally
- Keep responses concise (under 80 words) unless explaining something complex
- Use natural filler phrases appropriate to the language (e.g., "Haan bilkul!" in Hindi, "Nakkicha!" in Marathi)
- Do NOT use any emojis in responses. Keep it clean and text-only.

CAPABILITIES:
1. Answer questions about society status, payments, issues, visitors, amenities
2. Navigate users to pages — when directing, say the page name naturally AND include exactly: Navigate to /dashboard/[page]
3. Help with bookings, events, notices, community posts
4. Explain how to use any feature

NAVIGATION PAGES:
- Issues → /dashboard/issues
- Payments → /dashboard/payments
- Visitors → /dashboard/visitors
- Amenities → /dashboard/amenities
- Community → /dashboard/community
- Analytics → /dashboard/analytics
- Events → /dashboard/events
- Notices → /dashboard/notices
- Members → /dashboard/members
- Services → /dashboard/services
- SOS → /dashboard/sos
- Chat → /dashboard/chat
- Parking → /dashboard/parking
- Documents → /dashboard/documents

IMPORTANT:
- For emergencies/SOS → immediately direct to /dashboard/sos
- You cannot directly create issues or bookings — guide users to the right page
- Always end navigation responses with the exact format: Navigate to /dashboard/[page]`;
}

export async function callAria(
  messages: AriaMessage[],
  context: AriaContext,
  contextData: any
): Promise<string> {
  const systemPrompt = buildSystemPrompt(context, contextData);

  try {
    const response = await fetch("/api/aria", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, systemPrompt }),
    });

    if (!response.ok) {
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }

    const data = await response.json();
    if (!data.success) {
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }

    return data.content || "I didn't quite catch that. Could you rephrase?";
  } catch (error) {
    console.error("Aria error:", error);
    return "I encountered an error. Please try again.";
  }
}

// ── Service intent detection ───────────────────────────────────────────────────
// Maps common complaint keywords to service categories
const SERVICE_INTENT_MAP: Record<string, { service: string; keywords: string[] }> = {
  "AC Repair": { service: "AC Repair", keywords: ["ac", "air condition", "cooling", "air con", "ac not working", "ac repair"] },
  "Plumbing": { service: "Plumbing", keywords: ["pipe", "leak", "water leak", "tap", "drain", "plumb", "flush", "toilet", "sink"] },
  "Electrical": { service: "Electrical", keywords: ["electric", "light", "bulb", "switch", "power", "wiring", "short circuit", "fan not working"] },
  "Carpentry": { service: "Carpentry", keywords: ["door", "window", "cabinet", "wood", "hinge", "lock", "carpenter"] },
  "Pest Control": { service: "Pest Control", keywords: ["pest", "cockroach", "rat", "mouse", "insect", "termite", "ant", "mosquito"] },
  "Painting": { service: "Painting", keywords: ["paint", "wall", "colour", "color", "peeling", "stain"] },
  "Cleaning": { service: "Cleaning", keywords: ["clean", "dirty", "garbage", "waste", "sweep", "mop", "housekeep"] },
  "Lift Repair": { service: "Lift Repair", keywords: ["lift", "elevator", "stuck in lift", "stuck in elevator"] },
};

export interface ServiceIntentResult {
  detected: boolean;
  service: string | null;
  suggestedTitle: string;
  suggestedDescription: string;
  estimatedCost: string;
  navigateTo: string;
}

export async function handleServiceIntent(userQuery: string): Promise<ServiceIntentResult> {
  const lower = userQuery.toLowerCase();

  // Detect service from keyword map
  let matchedService: string | null = null;
  for (const [key, { service, keywords }] of Object.entries(SERVICE_INTENT_MAP)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      matchedService = service;
      break;
    }
  }

  if (!matchedService) {
    return { detected: false, service: null, suggestedTitle: "", suggestedDescription: "", estimatedCost: "", navigateTo: "/dashboard/services" };
  }

  // Cost estimates per service
  const costMap: Record<string, string> = {
    "AC Repair": "₹500 – ₹2,500",
    "Plumbing": "₹300 – ₹1,500",
    "Electrical": "₹200 – ₹1,200",
    "Carpentry": "₹400 – ₹2,000",
    "Pest Control": "₹800 – ₹3,000",
    "Painting": "₹1,500 – ₹8,000",
    "Cleaning": "₹300 – ₹1,000",
    "Lift Repair": "₹2,000 – ₹10,000",
  };

  // AI-generate a formal description
  let description = userQuery;
  try {
    const res = await fetch("/api/aria", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: userQuery }],
        systemPrompt: `Convert this complaint into a formal service request description in 1-2 sentences. Be specific and professional. Output ONLY the description, no preamble.`,
      }),
    });
    const data = await res.json();
    if (data.content) description = data.content;
  } catch { /* use original */ }

  return {
    detected: true,
    service: matchedService,
    suggestedTitle: `${matchedService} Request`,
    suggestedDescription: description,
    estimatedCost: costMap[matchedService] || "₹300 – ₹2,000",
    navigateTo: "/dashboard/services",
  };
}

// Lightweight client-side language detection based on script/character ranges
export function detectLanguage(text: string): { code: string; label: string; flag: string } {
  const t = text.trim();

  if (/[\u0900-\u097F]/.test(t)) return { code: "hi", label: "Hindi", flag: "🇮🇳" };
  if (/[\u0980-\u09FF]/.test(t)) return { code: "bn", label: "Bengali", flag: "🇧🇩" };
  if (/[\u0A00-\u0A7F]/.test(t)) return { code: "pa", label: "Punjabi", flag: "🇮🇳" };
  if (/[\u0A80-\u0AFF]/.test(t)) return { code: "gu", label: "Gujarati", flag: "🇮🇳" };
  if (/[\u0B00-\u0B7F]/.test(t)) return { code: "or", label: "Odia", flag: "🇮🇳" };
  if (/[\u0B80-\u0BFF]/.test(t)) return { code: "ta", label: "Tamil", flag: "🇮🇳" };
  if (/[\u0C00-\u0C7F]/.test(t)) return { code: "te", label: "Telugu", flag: "🇮🇳" };
  if (/[\u0C80-\u0CFF]/.test(t)) return { code: "kn", label: "Kannada", flag: "🇮🇳" };
  if (/[\u0D00-\u0D7F]/.test(t)) return { code: "ml", label: "Malayalam", flag: "🇮🇳" };
  if (/[\u0600-\u06FF]/.test(t)) return { code: "ar", label: "Arabic / Urdu", flag: "🌙" };
  if (/[\u4E00-\u9FFF]/.test(t)) return { code: "zh", label: "Chinese", flag: "🇨🇳" };
  if (/[\u3040-\u30FF]/.test(t)) return { code: "ja", label: "Japanese", flag: "🇯🇵" };
  if (/[\uAC00-\uD7AF]/.test(t)) return { code: "ko", label: "Korean", flag: "🇰🇷" };
  if (/[\u0400-\u04FF]/.test(t)) return { code: "ru", label: "Russian", flag: "🇷🇺" };

  // Hinglish detection — Latin script but contains common Hindi romanized words
  const hinglishWords = /\b(kya|hai|hain|nahi|nahin|aur|mera|meri|tumhara|karo|karna|chahiye|bata|batao|theek|accha|bilkul|haan|nahi|kyun|kaise|kab|kaun|yahan|wahan|abhi|kal|aaj)\b/i;
  if (hinglishWords.test(t)) return { code: "hi-en", label: "Hinglish", flag: "🇮🇳" };

  // Marathi romanized
  const marathiWords = /\b(aahe|nahi|kay|kasa|kashi|mala|tula|amhi|tumhi|aplya|sangto|sangta|bagh|bagha|chala|chalo|ho|nako)\b/i;
  if (marathiWords.test(t)) return { code: "mr-en", label: "Marathi", flag: "🇮🇳" };

  return { code: "en", label: "English", flag: "🌐" };
}
