// 🎨 UNIFIED DESIGN SYSTEM - Society Hub SaaS
// Single source of truth for all styling across the application

export const designSystem = {
  // COLOR PALETTE - Indigo/Violet Theme
  colors: {
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1', // Main brand color
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
    },
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    },
    success: {
      light: '#d1fae5',
      main: '#10b981',
      dark: '#059669',
    },
    warning: {
      light: '#fef3c7',
      main: '#f59e0b',
      dark: '#d97706',
    },
    error: {
      light: '#fee2e2',
      main: '#ef4444',
      dark: '#dc2626',
    },
    info: {
      light: '#dbeafe',
      main: '#3b82f6',
      dark: '#2563eb',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },

  // SPACING SCALE (Tailwind-based)
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },

  // BORDER RADIUS
  radius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // SHADOWS
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    glow: '0 0 20px rgba(99, 102, 241, 0.3)',
    glowHover: '0 0 30px rgba(99, 102, 241, 0.4)',
  },

  // TYPOGRAPHY
  typography: {
    fontFamily: {
      sans: 'system-ui, -apple-system, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },

  // ANIMATION TIMINGS
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // COMPONENT STYLES
  components: {
    card: {
      base: 'bg-white rounded-2xl shadow-sm border border-gray-100',
      hover: 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300',
      padding: 'p-6',
    },
    button: {
      primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl px-6 py-3 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300',
      secondary: 'bg-white text-gray-700 font-semibold rounded-xl px-6 py-3 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300',
      ghost: 'text-gray-700 font-semibold rounded-xl px-6 py-3 hover:bg-gray-100 transition-all duration-300',
    },
    input: {
      base: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300',
    },
    badge: {
      primary: 'bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm font-semibold',
      success: 'bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold',
      warning: 'bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-sm font-semibold',
      error: 'bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-semibold',
    },
    modal: {
      overlay: 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4',
      content: 'bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto',
    },
  },

  // GRADIENTS
  gradients: {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600',
    primaryLight: 'bg-gradient-to-r from-indigo-50 to-purple-50',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500',
    warning: 'bg-gradient-to-r from-orange-500 to-amber-500',
    error: 'bg-gradient-to-r from-red-500 to-pink-500',
    info: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  },

  // LAYOUT
  layout: {
    maxWidth: '1400px',
    containerPadding: 'px-4 md:px-6 lg:px-8',
    sectionSpacing: 'space-y-6',
  },

  // TRANSITIONS
  transitions: {
    all: 'transition-all duration-300 ease-out',
    colors: 'transition-colors duration-300 ease-out',
    transform: 'transition-transform duration-300 ease-out',
    shadow: 'transition-shadow duration-300 ease-out',
  },
};

// UTILITY FUNCTIONS
export const getCardClasses = (hover = true) => {
  return `${designSystem.components.card.base} ${designSystem.components.card.padding} ${
    hover ? designSystem.components.card.hover : ''
  }`;
};

export const getButtonClasses = (variant: 'primary' | 'secondary' | 'ghost' = 'primary') => {
  return designSystem.components.button[variant];
};

export const getInputClasses = () => {
  return designSystem.components.input.base;
};

export const getBadgeClasses = (variant: 'primary' | 'success' | 'warning' | 'error' = 'primary') => {
  return designSystem.components.badge[variant];
};

// ANIMATION VARIANTS (for Framer Motion)
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

// STAGGER CHILDREN (for lists)
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};
