"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // If already logged in, redirect to dashboard — prevents back button access
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/dashboard");
    });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        router.replace("/dashboard"); // replace instead of push — removes login from history
      }
    } catch (error: any) {
      setError(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const [particles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
    }))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -180, -360],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-400 to-blue-300 rounded-full blur-3xl"
      />

      {/* Static particles - CSS only for performance */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white/20 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
        />
      ))}

      <div className="w-full max-w-6xl flex items-center justify-center gap-12 relative z-10">
        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="w-full max-w-md"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
          >
            <div className="text-center mb-8">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="inline-block"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden bg-white">
                <img src="/logo.png" alt="Trackify" className="w-14 h-14 object-contain" />
              </div>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-3"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </motion.div>
              Welcome Back
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </motion.div>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600"
            >
              Login to your Society Hub account
            </motion.p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <label className="block text-gray-700 mb-2 text-sm font-semibold">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-12 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <label className="block text-gray-700 mb-2 text-sm font-semibold">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  ref={passwordInputRef}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsTypingPassword(true)}
                  onBlur={() => setIsTypingPassword(false)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-12 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-between text-sm"
            >
              <label className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <input
                  type="checkbox"
                  className="mr-2 rounded accent-blue-500 w-4 h-4"
                />
                Remember me
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </motion.div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    Login
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-center text-gray-600 text-sm"
          >
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
              Register here
            </Link>
          </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-6"
          >
            <Link href="/" className="text-white/90 hover:text-white text-sm font-medium transition-colors inline-flex items-center gap-2">
              ← Back to home
            </Link>
          </motion.div>
        </motion.div>

      {/* Animated Panda - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="hidden lg:block relative"
      >
        <div className="w-80 h-96 bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 flex items-center justify-center">
          {/* Panda Character */}
          <div className="relative">
            {/* Panda Body */}
            <motion.div
              animate={{ 
                y: isTypingPassword ? [0, -5, 0] : [0, -3, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              {/* Head */}
              <div className="w-40 h-40 bg-white rounded-full relative shadow-lg">
                {/* Ears */}
                <div className="absolute -top-4 left-8 w-12 h-12 bg-gray-900 rounded-full" />
                <div className="absolute -top-4 right-8 w-12 h-12 bg-gray-900 rounded-full" />
                
                {/* Eyes */}
                <motion.div
                  animate={{
                    scaleY: isTypingPassword ? 0.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-12 left-8 w-8 h-10 bg-gray-900 rounded-full overflow-hidden"
                >
                  {!isTypingPassword && (
                    <motion.div
                      animate={{
                        x: [0, 3, 0, -3, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-4 h-4 bg-white rounded-full mt-3 ml-2"
                    />
                  )}
                </motion.div>
                
                <motion.div
                  animate={{
                    scaleY: isTypingPassword ? 0.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-12 right-8 w-8 h-10 bg-gray-900 rounded-full overflow-hidden"
                >
                  {!isTypingPassword && (
                    <motion.div
                      animate={{
                        x: [0, 3, 0, -3, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-4 h-4 bg-white rounded-full mt-3 ml-2"
                    />
                  )}
                </motion.div>

                {/* Hands covering eyes when typing password */}
                {isTypingPassword && (
                  <>
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -50, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-10 left-4 w-12 h-12 bg-gray-900 rounded-full"
                    />
                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 50, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-10 right-4 w-12 h-12 bg-gray-900 rounded-full"
                    />
                  </>
                )}
                
                {/* Nose */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-6 h-5 bg-gray-900 rounded-full" />
                
                {/* Mouth */}
                <motion.div
                  animate={{
                    scaleY: isTypingPassword ? 0.8 : 1,
                  }}
                  className="absolute top-24 left-1/2 -translate-x-1/2 w-8 h-4 border-b-4 border-gray-900 rounded-b-full"
                />
              </div>

              {/* Body */}
              <div className="w-32 h-24 bg-white rounded-t-full mx-auto -mt-4 shadow-lg relative">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-gray-100 rounded-full" />
              </div>
            </motion.div>

            {/* Speech bubble - I won't peek */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isTypingPassword ? 1 : 0,
                scale: isTypingPassword ? 1 : 0.8,
              }}
              transition={{ duration: 0.3 }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap shadow-lg"
            >
              I won't peek! 🙈
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-500" />
            </motion.div>

            {/* Watching message */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: !isTypingPassword && (email.length > 0 || password.length === 0) ? 1 : 0,
                scale: !isTypingPassword && (email.length > 0 || password.length === 0) ? 1 : 0.8,
              }}
              transition={{ duration: 0.3 }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap shadow-lg"
            >
              I'm watching! 👀
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-green-500" />
            </motion.div>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
