import type { Metadata } from "next";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Motherland Cafe",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuth = cookieStore.get("admin_auth")?.value === "1";

  if (!isAuth) return <AdminLogin />;

  try {
    const [categories, galleryImages, reviews, reservations] = await Promise.all([
      prisma.menuCategory.findMany({
        orderBy: { displayOrder: "asc" },
        include: { items: { orderBy: { name: "asc" } } },
      }),
      prisma.galleryImage.findMany({ orderBy: { displayOrder: "asc" } }),
      prisma.review.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.reservation.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    return (
      <AdminDashboard
        categories={categories}
        galleryImages={galleryImages}
        reviews={reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
        reservations={reservations.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
      />
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg)", fontFamily: "var(--font-body)" }}>
        <div style={{ maxWidth: "480px", padding: "2.5rem", background: "white", borderRadius: "16px", border: "1px solid rgba(220,38,38,0.2)", boxShadow: "0 4px 24px rgba(120,53,15,0.1)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", color: "#DC2626", marginBottom: "1rem" }}>Database Unreachable</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--color-secondary)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
            Neon free-tier databases sleep after inactivity. <strong>Wait 5 seconds and refresh the page</strong> — it will wake up automatically.
          </p>
          <p style={{ fontSize: "0.78rem", color: "var(--color-secondary)", opacity: 0.65, marginBottom: "1.5rem", wordBreak: "break-all" }}>
            Error: {msg.slice(0, 200)}
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <a href="/admin" style={{ display: "inline-flex", padding: "0.6rem 1.25rem", background: "var(--color-primary)", color: "var(--color-bg)", borderRadius: "8px", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700 }}>
              Retry
            </a>
            <p style={{ fontSize: "0.75rem", color: "var(--color-secondary)", opacity: 0.55, alignSelf: "center" }}>
              Also check DATABASE_URL in .env.local
            </p>
          </div>
        </div>
      </div>
    );
  }
}
