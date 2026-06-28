"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Image as ImageIcon, Coffee, Star, Calendar, RefreshCw, UtensilsCrossed } from "lucide-react";
import {
  logoutAdmin, createCategory, createMenuItem, updateMenuItem, deleteMenuItem,
  createGalleryImage, deleteGalleryImage,
  createReview, toggleReviewPublished, deleteReview,
  updateReservationStatus,
} from "./actions";

// Sub-components
import MenuManager from "./components/MenuManager";
import GalleryManager from "./components/GalleryManager";
import ReviewManager from "./components/ReviewManager";
import ReservationManager from "./components/ReservationManager";

type Tab = "menu" | "gallery" | "reviews" | "reservations";

// Types
interface MI { id:string; categoryId:string; name:string; description:string; price:number; imageUrl:string; isVegetarian:boolean; isVegan:boolean; isGlutenFree:boolean; isFeatured:boolean; }
interface Cat { id:string; name:string; displayOrder:number; items:MI[]; }
interface GI { id:string; imageUrl:string; title:string; category:string; isPublished:boolean; displayOrder:number; }
interface Rev { id:string; name:string; rating:number; reviewText:string; source:string; isPublished:boolean; createdAt:string; }
interface Res { id:string; name:string; phone:string; email:string; guests:number; reservationDate:string; reservationTime:string; notes:string|null; status:string; createdAt:string; }

export default function AdminDashboard({ 
  categories, 
  galleryImages, 
  reviews, 
  reservations 
}: { 
  categories:Cat[]; 
  galleryImages:GI[]; 
  reviews:Rev[]; 
  reservations:Res[]; 
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [tab, setTab] = useState<Tab>("menu");

  const run = (fn: () => Promise<unknown>) => start(async () => { 
    await fn(); 
    router.refresh(); 
  });

  const TABS: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: "menu", label: "Menu", icon: UtensilsCrossed },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "reservations", label: "Reservations", icon: Calendar, count: reservations.filter(r => r.status === "pending").length },
  ];

  const stats = [
    { label: "Menu Items", value: categories.reduce((sum, c) => sum + c.items.length, 0), color: "text-orange-400" },
    { label: "Gallery Images", value: galleryImages.length, color: "text-blue-400" },
    { label: "Total Reviews", value: reviews.length, color: "text-green-400" },
    { label: "Pending Reserves", value: reservations.filter(r => r.status === "pending").length, color: "text-[#D4AF37]" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#14100D", fontFamily: "var(--font-body, 'Outfit', system-ui, sans-serif)" }}>

      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <div style={{ background: "#1A1512", borderBottom: "1px solid rgba(212,175,55,0.1)" }}
        className="px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-3">
          <Coffee size={20} style={{ color: "#D4AF37" }} />
          <span className="text-white font-semibold text-lg hidden sm:inline"
            style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', Georgia, serif)" }}>
            Motherland Admin
          </span>
          <span className="text-white font-semibold text-lg sm:hidden"
            style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', Georgia, serif)" }}>
            Motherland
          </span>
        </div>
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.refresh()}
            disabled={pending}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors disabled:opacity-50"
            style={{ color: "#A89F91" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#FBF9F6")}
            onMouseLeave={e => (e.currentTarget.style.color = "#A89F91")}
          >
            <RefreshCw size={14} className={pending ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <div className="w-px h-4 hidden sm:block" style={{ background: "rgba(255,255,255,0.1)" }} />
          <button
            onClick={() => run(logoutAdmin)}
            disabled={pending}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors disabled:opacity-50"
            style={{ color: "#A89F91" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
            onMouseLeave={e => (e.currentTarget.style.color = "#A89F91")}
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Saving Overlay ───────────────────────────────────── */}
        <AnimatePresence>
          {pending && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full flex items-center gap-3 shadow-xl"
              style={{ background: "#1A1512", border: "1px solid rgba(212,175,55,0.3)" }}
            >
              <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#D4AF37", borderTopColor: "transparent" }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#FBF9F6" }}>Saving changes...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Stat Cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(stat => (
            <div
              key={stat.label}
              className="rounded-xl p-5 shadow-lg"
              style={{ background: "#211A15", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#A89F91" }}>
                {stat.label}
              </p>
              <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── Tab Bar ──────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div
            className="flex p-1 rounded-xl shadow-md overflow-x-auto"
            style={{ background: "#211A15", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
                style={
                  tab === t.id
                    ? { background: "#D4AF37", color: "#1A1311" }
                    : { color: "#A89F91" }
                }
                onMouseEnter={e => { if (tab !== t.id) e.currentTarget.style.color = "#FBF9F6"; }}
                onMouseLeave={e => { if (tab !== t.id) e.currentTarget.style.color = "#A89F91"; }}
              >
                <t.icon size={15} />
                {t.label}
                {(t.count ?? 0) > 0 && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={
                      tab === t.id
                        ? { background: "rgba(26,19,11,0.2)", color: "#1A1311" }
                        : { background: "rgba(255,255,255,0.1)", color: "#FBF9F6" }
                    }
                  >
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Content ──────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full"
          >
            {tab === "menu" && (
              <MenuManager
                categories={categories}
                onCreateCategory={(name) => run(() => createCategory(name, categories.length))}
                onCreate={(item) => run(() => createMenuItem(item))}
                onUpdate={(id, item) => run(() => updateMenuItem(id, item))}
                onDelete={(id) => run(() => deleteMenuItem(id))}
              />
            )}

            {tab === "gallery" && (
              <GalleryManager
                images={galleryImages}
                onCreate={(img) => run(() => createGalleryImage(img))}
                onDelete={(id) => run(() => deleteGalleryImage(id))}
              />
            )}

            {tab === "reviews" && (
              <ReviewManager
                reviews={reviews}
                onCreate={(rev) => run(() => createReview(rev))}
                onTogglePublish={(id, pub) => run(() => toggleReviewPublished(id, pub))}
                onDelete={(id) => run(() => deleteReview(id))}
              />
            )}

            {tab === "reservations" && (
              <ReservationManager
                reservations={reservations}
                onUpdateStatus={(id, status) => run(() => updateReservationStatus(id, status))}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
