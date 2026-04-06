// Input sanitization utilities
// Used across forms to prevent XSS and injection

// Strip HTML tags and dangerous characters
export function sanitizeText(input: string, maxLength = 1000): string {
  return input
    .replace(/<[^>]*>/g, "")           // strip HTML tags
    .replace(/[<>"'`]/g, "")           // strip dangerous chars
    .replace(/javascript:/gi, "")      // strip JS protocol
    .replace(/on\w+\s*=/gi, "")        // strip event handlers
    .trim()
    .substring(0, maxLength);
}

// Validate and sanitize a number within bounds
export function sanitizeAmount(value: unknown, min = 1, max = 100000): number | null {
  const num = Number(value);
  if (isNaN(num) || num < min || num > max) return null;
  return Math.round(num * 100) / 100; // 2 decimal places
}

// Validate email format
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

// Validate Indian phone number
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-+]/g, "").replace(/^91/, "");
  return /^[6-9]\d{9}$/.test(cleaned);
}
