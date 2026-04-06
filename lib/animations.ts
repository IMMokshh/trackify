// Consistent animation configurations for 60fps performance
// All animations use spring physics for natural feel

export const springConfig = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

export const smoothSpring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 25,
};

export const bouncySpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 20,
};

// Fade animations
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: smoothSpring,
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: smoothSpring,
};

export const fadeInScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: smoothSpring,
};

// Slide animations
export const slideInRight = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },
  transition: springConfig,
};

export const slideInLeft = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
  transition: springConfig,
};

// Hover animations
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.15 },
};

export const hoverLift = {
  whileHover: { y: -8, scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: smoothSpring,
};

export const hoverGlow = {
  whileHover: { 
    boxShadow: "0 20px 60px rgba(99, 102, 241, 0.3)",
    scale: 1.03,
  },
  whileTap: { scale: 0.97 },
  transition: { duration: 0.2 },
};

// Stagger animations for lists
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: smoothSpring,
};

// Loading animations
export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const spin = {
  animate: { rotate: 360 },
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: "linear",
  },
};

// Modal animations
export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 20 },
  transition: springConfig,
};

// Card animations
export const cardHover = {
  whileHover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
  },
  whileTap: { scale: 0.98 },
  transition: smoothSpring,
};

// Button animations
export const buttonPress = {
  whileHover: { scale: 1.05, boxShadow: "0 8px 20px rgba(99, 102, 241, 0.3)" },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.15 },
};

// Notification animations
export const notificationSlide = {
  initial: { x: 400, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 400, opacity: 0 },
  transition: springConfig,
};

// Page transition
export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25, ease: "easeOut" },
};
