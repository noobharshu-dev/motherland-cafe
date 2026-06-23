"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "./actions";

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
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--color-bg)",
    }}>
      <div style={{
        width: "100%", maxWidth: "400px", padding: "0 1.5rem",
      }}>
        <div style={{
          background: "var(--color-surface)",
          border: "1px solid rgba(217,119,6,0.2)",
          borderRadius: "var(--radius-xl)",
          padding: "2.5rem",
          boxShadow: "var(--shadow-warm)",
        }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1 style={{
              fontFamily: "var(--font-heading)", fontSize: "1.75rem",
              color: "var(--color-primary)",
            }}>Motherland</h1>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "0.75rem",
              fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
              color: "var(--color-secondary)", opacity: 0.6, marginTop: "0.25rem",
            }}>Admin Panel</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{
                display: "block", fontFamily: "var(--font-body)", fontSize: "0.72rem",
                fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--color-secondary)", marginBottom: "0.4rem",
              }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                placeholder="Enter admin password"
                style={{
                  width: "100%", padding: "0.75rem 1rem",
                  border: `1.5px solid ${error ? "#DC2626" : "rgba(120,53,15,0.25)"}`,
                  borderRadius: "var(--radius-sm)", background: "white",
                  fontFamily: "var(--font-body)", fontSize: "0.9rem",
                  color: "var(--color-text)", outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {error && (
                <p style={{ fontSize: "0.8rem", color: "#DC2626", marginTop: "0.4rem" }}>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary"
              style={{ justifyContent: "center", opacity: isPending ? 0.7 : 1 }}
            >
              {isPending ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p style={{
            textAlign: "center", fontSize: "0.75rem",
            color: "var(--color-secondary)", opacity: 0.5, marginTop: "1.5rem",
          }}>
            Set ADMIN_PASSWORD in .env.local
          </p>
        </div>
      </div>
    </div>
  );
}
