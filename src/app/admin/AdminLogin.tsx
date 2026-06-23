"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "./actions";
import { Lock, ArrowRight, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await loginAdmin(password);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4 font-[family-name:var(--font-body)] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-cta)]/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-2xl flex items-center justify-center border border-[rgba(212,175,55,0.2)] mb-6 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <LayoutDashboard className="text-[var(--color-cta)]" size={28} />
            </div>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl text-[var(--color-primary)] font-medium text-center">
              Admin Portal
            </h1>
            <p className="text-sm font-bold tracking-[0.2em] uppercase text-[var(--color-cta)] mt-2 opacity-80">
              Motherland Cafe
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2 ml-1">
                Access Token
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={16} className="text-[var(--color-secondary)] opacity-50" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  placeholder="Enter secure password"
                  className={`w-full pl-11 pr-4 py-3.5 bg-[rgba(0,0,0,0.3)] text-[var(--color-primary)] rounded-xl text-sm outline-none transition-all border ${
                    error 
                      ? "border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.15)]" 
                      : "border-[rgba(255,255,255,0.1)] focus:border-[var(--color-cta)] focus:shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                  }`}
                />
              </div>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-xs font-medium text-red-400 mt-2 ml-1"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[var(--color-cta)] text-[#1A1311] rounded-xl text-sm font-bold hover:bg-[#B8972E] transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-[#1A1311] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Authenticate
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.05)] text-center">
            <p className="text-xs text-[var(--color-secondary)] opacity-40 font-medium">
              Secure Environment • Motherland Cafe
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
