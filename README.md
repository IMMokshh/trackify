# 🏢 Society Hub (Trackify)

A comprehensive residential society management platform built with Next.js 14, TypeScript, and Supabase.

## ✨ Features

### Core Features
- 🏠 **Dashboard** - Centralized overview of society activities
- 🚨 **Issues Management** - Report and track maintenance issues
- 🆘 **SOS Alerts** - Emergency alert system with real-time notifications
- 👥 **Visitor Management** - Digital visitor passes with QR codes
- 💳 **Payment System** - Integrated Razorpay for maintenance payments
- 📅 **Amenity Booking** - Book clubhouse, gym, and other facilities
- 🎉 **Events** - Society events calendar and management
- 🛠️ **Services & Partners** - 157+ service providers with AI-powered matching
- 💰 **Society Fund** - Transparent fund management
- 📄 **Documents** - Centralized document repository
- 💬 **Chat** - Community communication
- 🗳️ **Polls & Voting** - Democratic decision making
- 🛒 **Marketplace** - Buy/sell within community
- 🔔 **Reminders** - Automated reminders and notifications
- 👨‍👩‍👧‍👦 **Members Directory** - Complete member database
- 🚗 **Parking Management** - Parking slot allocation
- 📞 **Help & Contacts** - Emergency contacts and helpdesk
- 📊 **Analytics** - Insights and reports
- 👮 **Guard Panel** - Security management interface
- 🔐 **Admin Panel** - Complete administrative control

### AI-Powered Features
- 🤖 **Smart Service Assistant** - AI chatbot for service recommendations
- 💡 **Cost Estimation** - Intelligent cost prediction
- 📝 **Description Cleanup** - Natural language processing

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Payments:** Razorpay
- **SMS:** Fast2SMS
- **AI:** Groq API (Llama 3.3)
- **Icons:** Lucide React
- **Charts:** Recharts
- **QR Codes:** qrcode library
- **PDF Generation:** jsPDF

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd society-hub

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

## 🔧 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Twilio (Optional - for SMS)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Groq AI (for Smart Assistant)
GROQ_API_KEY=your_groq_api_key
```

## 📁 Project Structure

```
society-hub/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # Dashboard pages
│   └── guard/                # Guard panel
├── components/               # Reusable components
│   ├── services/             # Service-specific components
│   ├── ui/                   # UI components
│   ├── ErrorBoundary.tsx     # Error handling
│   ├── LoadingSpinner.tsx    # Loading states
│   └── SkeletonLoader.tsx    # Skeleton screens
├── contexts/                 # React contexts
├── hooks/                    # Custom React hooks
│   ├── useDebounce.ts        # Debounce hook
│   ├── useLocalStorage.ts    # LocalStorage hook
│   └── useMediaQuery.ts      # Responsive hook
├── lib/                      # Utility libraries
│   ├── animations.ts         # Animation configs
│   ├── colors.ts             # Color system
│   ├── performance.ts        # Performance utils
│   ├── supabase.ts           # Supabase client
│   └── utils.ts              # Helper functions
└── public/                   # Static assets
```

## 🎨 Component Library

### UI Components
- `Button` - Consistent button styles with variants
- `Card` - Reusable card component
- `Badge` - Status badges
- `Modal` - Modal dialogs
- `Input` - Form inputs with validation
- `LoadingSpinner` - Loading indicators
- `SkeletonLoader` - Skeleton screens

### Hooks
- `useDebounce` - Debounce values
- `useLocalStorage` - Persist state
- `useMediaQuery` - Responsive design
- `useIsMobile` - Mobile detection
- `useIsTablet` - Tablet detection
- `useIsDesktop` - Desktop detection

## 🎯 Performance Optimizations

### Code Splitting
- Route-based code splitting
- Dynamic imports for heavy components
- Lazy loading with Suspense

### Memoization
- React.memo for expensive components
- useMemo for computed values
- useCallback for stable functions

### Bundle Optimization
- Tree-shaking enabled
- Optimized package imports
- Vendor chunk splitting

### Image Optimization
- Next.js Image component
- AVIF and WebP formats
- Responsive image sizes

## 📊 Performance Metrics

### Target Metrics
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.5s
- **Cumulative Layout Shift:** < 0.1
- **First Input Delay:** < 100ms

### Lighthouse Scores
- **Performance:** > 90
- **Accessibility:** > 95
- **Best Practices:** > 95
- **SEO:** > 90

## 🔒 Security

- Environment variables for sensitive data
- Supabase Row Level Security (RLS)
- Input validation and sanitization
- CSRF protection
- XSS prevention
- Secure headers

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npm run type-check

# Build for production
npm run build
```

## 📱 Mobile Support

- Fully responsive design
- Touch-optimized interactions
- Mobile-first approach
- PWA-ready

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📚 Documentation

- [Cleanup Progress](./CLEANUP-PROGRESS.md)
- [Optimization Guide](./OPTIMIZATION-GUIDE.md)
- [Final Summary](./FINAL-CLEANUP-SUMMARY.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for Greenwood Heights CHS.

## 👥 Team

Built with ❤️ for residential society management.

## 🆘 Support

For issues or questions, contact the development team.

---

**Version:** 2.0.0  
**Last Updated:** March 27, 2026  
**Status:** Production Ready ✅
