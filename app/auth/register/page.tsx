"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, User, Home, Phone, ArrowRight, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    flatNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // Create profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: authData.user.id,
            email: formData.email,
            full_name: formData.fullName,
            phone: formData.phone,
            flat_number: formData.flatNumber,
            role: 'resident',
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          throw profileError;
        }

        router.push("/dashboard");
      }
    } catch (error: any) {
      setError(error.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { icon: User, label: "Full Name", type: "text", value: formData.fullName, key: "fullName", placeholder: "John Doe" },
    { icon: Mail, label: "Email Address", type: "email", value: formData.email, key: "email", placeholder: "you@example.com" },
    { icon: Phone, label: "Phone Number", type: "tel", value: formData.phone, key: "phone", placeholder: "+91 98765 43210", required: false },
    { icon: Home, label: "Flat Number", type: "text", value: formData.flatNumber, key: "flatNumber", placeholder: "A-101" },
    { icon: Lock, label: "Password", type: "password", value: formData.password, key: "password", placeholder: "••••••••", minLength: 6 },
  ];

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="glass rounded-3xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <img src="/logo.png" alt="Trackify" className="w-16 h-16 mx-auto mb-4 object-contain drop-shadow-lg" />
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              Join Society Hub
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </h1>
            <p className="text-white/80">Create your account to get started</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/20 border border-red-400/50 text-white p-3 rounded-lg text-sm backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}

            {inputFields.map((field, index) => (
              <motion.div
                key={field.key}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <label className="block text-white mb-2 text-sm font-medium">
                  {field.label}
                </label>
                <div className="relative group">
                  <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 group-focus-within:text-white transition-colors" />
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40 transition-all"
                    placeholder={field.placeholder}
                    required={field.required !== false}
                    minLength={field.minLength}
                  />
                </div>
              </motion.div>
            ))}

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-white text-blue-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
                />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center text-white/80 text-sm"
          >
            Already have an account?{" "}
            <Link href="/auth/login" className="text-white font-semibold hover:text-blue-200 transition-colors">
              Login here
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <Link href="/" className="text-white/80 hover:text-white text-sm transition-colors">
            ← Back to home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
