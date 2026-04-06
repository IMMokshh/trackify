// Consistent color system for the entire app
// Ensures visual consistency and easy theme management

export const colors = {
  // Primary brand colors
  primary: {
    50: "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    300: "#A5B4FC",
    400: "#818CF8",
    500: "#6366F1", // Main brand color
    600: "#4F46E5",
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81",
  },

  // Gradients
  gradients: {
    primary: "from-blue-600 via-blue-700 to-cyan-600",
    secondary: "from-indigo-600 to-violet-600",
    success: "from-green-600 to-emerald-600",
    warning: "from-yellow-500 to-orange-600",
    danger: "from-red-600 to-rose-600",
    purple: "from-purple-600 to-pink-600",
    ocean: "from-cyan-500 to-blue-600",
    sunset: "from-orange-500 to-red-600",
  },

  // Status colors
  status: {
    success: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      gradient: "from-green-400 to-green-600",
    },
    warning: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      gradient: "from-yellow-400 to-yellow-600",
    },
    error: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      gradient: "from-red-400 to-red-600",
    },
    info: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      gradient: "from-blue-400 to-blue-600",
    },
  },

  // Category colors (for services, etc.)
  categories: {
    plumbing: "from-blue-500 to-blue-600",
    electrical: "from-yellow-500 to-yellow-600",
    carpentry: "from-amber-600 to-amber-700",
    furniture: "from-purple-500 to-purple-600",
    construction: "from-gray-600 to-gray-700",
    painting: "from-pink-500 to-pink-600",
    cleaning: "from-cyan-500 to-cyan-600",
    pest: "from-red-500 to-red-600",
    appliance: "from-indigo-500 to-indigo-600",
    ac: "from-blue-400 to-blue-500",
    internet: "from-green-500 to-green-600",
    security: "from-slate-600 to-slate-700",
    gardening: "from-green-600 to-green-700",
    movers: "from-orange-500 to-orange-600",
    vehicle: "from-red-600 to-red-700",
  },

  // Role badge colors
  roles: {
    chairwoman: {
      gradient: "from-amber-400 to-yellow-600",
      glow: "shadow-amber-200",
    },
    chairman: {
      gradient: "from-amber-400 to-yellow-600",
      glow: "shadow-amber-200",
    },
    secretary: {
      gradient: "from-indigo-500 to-blue-600",
      glow: "shadow-indigo-200",
    },
    committee: {
      gradient: "from-rose-500 to-pink-600",
      glow: "shadow-rose-200",
    },
    treasurer: {
      gradient: "from-emerald-500 to-teal-600",
      glow: "shadow-emerald-200",
    },
    guard: {
      gradient: "from-slate-500 to-slate-700",
      glow: "shadow-slate-200",
    },
    resident: {
      gradient: "from-gray-400 to-gray-600",
      glow: "shadow-gray-200",
    },
  },

  // Background patterns
  backgrounds: {
    light: "bg-gradient-to-br from-gray-50 to-blue-50",
    dark: "bg-gradient-to-br from-gray-900 to-blue-900",
    primary: "bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600",
    card: "bg-white",
    hover: "hover:bg-gray-50",
  },

  // Shadow utilities
  shadows: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
    glow: "shadow-lg shadow-indigo-200",
    glowHover: "hover:shadow-2xl hover:shadow-indigo-300",
  },
};

// Helper function to get gradient class
export const getGradient = (type: keyof typeof colors.gradients) => {
  return `bg-gradient-to-r ${colors.gradients[type]}`;
};

// Helper function to get status colors
export const getStatusColor = (status: keyof typeof colors.status) => {
  return colors.status[status];
};

// Helper function to get role colors
export const getRoleColor = (role: string) => {
  const normalizedRole = role.toLowerCase() as keyof typeof colors.roles;
  return colors.roles[normalizedRole] || colors.roles.resident;
};
