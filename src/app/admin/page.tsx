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
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4 font-[family-name:var(--font-body)]">
        <div className="w-full max-w-md bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-[rgba(220,38,38,0.2)] rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-center relative overflow-hidden">
          {/* Subtle red glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-red-500/10 blur-[50px] pointer-events-none" />
          
          <h2 className="font-[family-name:var(--font-heading)] text-2xl text-red-400 mb-4 relative z-10">Database Unreachable</h2>
          <p className="text-sm text-[var(--color-secondary)] leading-relaxed mb-6 relative z-10">
            Neon free-tier databases sleep after inactivity. <strong className="text-[var(--color-primary)]">Wait 5 seconds and refresh the page</strong> — it will wake up automatically.
          </p>
          <div className="bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 mb-8 text-left overflow-x-auto relative z-10 custom-scrollbar">
            <p className="text-xs text-[var(--color-muted)] font-mono whitespace-pre-wrap break-words opacity-80">
              Error: {msg.slice(0, 250)}...
            </p>
          </div>
          <div className="flex flex-col gap-4 items-center relative z-10">
            <a href="/admin" className="px-8 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.1)]">
              Refresh Page
            </a>
            <p className="text-xs text-[var(--color-muted)] opacity-60">
              Also check DATABASE_URL in .env.local
            </p>
          </div>
        </div>
      </div>
    );
  }
}
