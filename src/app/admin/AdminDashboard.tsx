"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Image as ImageIcon, Coffee, Star, Calendar, LayoutDashboard, RefreshCw } from "lucide-react";
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
    { id: "menu", label: "Menu", icon: Coffee },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "reservations", label: "Reservations", icon: Calendar, count: reservations.filter(r => r.status === "pending").length },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] font-[family-name:var(--font-body)]">
      {/* Top bar */}
      <div className="bg-[#1A1512] px-6 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <Coffee size={20} className="text-[var(--color-cta)]" />
          <span className="text-[var(--color-primary)] font-medium text-xl font-[family-name:var(--font-heading)] hidden sm:inline-block">Motherland Admin</span>
          <span className="text-[var(--color-primary)] font-medium text-xl font-[family-name:var(--font-heading)] sm:hidden">Motherland</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <button onClick={() => router.refresh()} disabled={pending}
            className="flex items-center gap-1.5 text-[var(--color-secondary)] hover:text-[var(--color-primary)] text-sm transition-colors font-bold disabled:opacity-50">
            <RefreshCw size={14} className={pending ? 'animate-spin' : ''} /> <span className="hidden sm:inline">Refresh</span>
          </button>
          <div className="w-px h-4 bg-[rgba(255,255,255,0.1)] hidden sm:block"></div>
          <button onClick={() => run(logoutAdmin)} disabled={pending}
            className="flex items-center gap-1.5 text-[var(--color-secondary)] hover:text-red-400 text-sm transition-colors font-bold disabled:opacity-50">
            <LogOut size={14} /> <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 relative">
        {/* Loading Overlay for pending transitions */}
        <AnimatePresence>
          {pending && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-[#1A1512] border border-[var(--color-cta)] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.2)] flex items-center gap-3"
            >
              <div className="w-4 h-4 border-2 border-[var(--color-cta)] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-[var(--color-primary)] tracking-widest uppercase">Saving changes...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Menu Items', value: categories.reduce((sum, c) => sum + c.items.length, 0), color: 'text-orange-400' },
            { label: 'Gallery Images', value: galleryImages.length, color: 'text-blue-400' },
            { label: 'Total Reviews', value: reviews.length, color: 'text-green-400' },
            { label: 'Pending Reserves', value: reservations.filter(r => r.status === 'pending').length, color: 'text-[var(--color-cta)]' },
          ].map(stat => (
            <div key={stat.label} className="bg-[var(--color-surface)] rounded-xl p-5 border border-[rgba(255,255,255,0.05)] hover:border-[rgba(212,175,55,0.2)] transition-colors shadow-lg">
              <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider font-semibold">{stat.label}</p>
              <p className={`text-3xl font-[family-name:var(--font-heading)] font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex bg-[var(--color-surface)] rounded-xl border border-[rgba(255,255,255,0.05)] p-1 shadow-md max-w-full overflow-x-auto custom-scrollbar">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  tab === t.id 
                    ? 'bg-[var(--color-cta)] text-[#1A1311] shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                    : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
                  }`}>
                <t.icon size={15} />
                {t.label}
                {(t.count ?? 0) > 0 && (
                  <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-[#1A1311]/20 text-[#1A1311]' : 'bg-[rgba(255,255,255,0.1)] text-[var(--color-primary)]'}`}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
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

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      `}</style>
    </div>
  );
}
