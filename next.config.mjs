/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security headers applied to every response
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Stop MIME sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // XSS protection for older browsers
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Don't send referrer to external sites
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Force HTTPS
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // Permissions policy — disable unused browser features
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com",
              "style-src 'self' 'unsafe-inline' https://unpkg.com",
              "img-src 'self' data: blob: https: http:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.groq.com https://nominatim.openstreetmap.org https://www.fast2sms.com https://api.razorpay.com",
              "frame-src https://checkout.razorpay.com https://api.razorpay.com",
              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // Restrict image domains
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "unpkg.com" },
    ],
  },
};

export default nextConfig;
