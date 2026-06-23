"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Image as ImageIcon, Coffee, Star, Calendar, LayoutDashboard, Menu as MenuIcon, X } from "lucide-react";
import {
  logoutAdmin, createMenuItem, updateMenuItem, deleteMenuItem,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col md:flex-row font-[family-name:var(--font-body)]">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[rgba(255,255,255,0.05)] sticky top-0 z-50">
        <span className="font-[family-name:var(--font-heading)] text-xl text-[var(--color-primary)] font-medium tracking-tight flex items-center gap-2">
          <LayoutDashboard className="text-[var(--color-cta)]" size={20} />
          Motherland Admin
        </span>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-[var(--color-primary)] bg-[rgba(255,255,255,0.05)] rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors">
          <MenuIcon size={20} />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-72 bg-[#1A1512] border-r border-[rgba(212,175,55,0.1)] flex flex-col transform transition-transform duration-300 ease-out md:translate-x-0 md:static shadow-2xl md:shadow-none ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 md:p-8 flex justify-between items-center">
          <span className="font-[family-name:var(--font-heading)] text-2xl text-[var(--color-primary)] font-medium tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-cta)] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <LayoutDashboard className="text-[#1A1311]" size={18} />
            </div>
            Motherland
          </span>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-[var(--color-muted)] hover:text-white md:hidden">
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 md:px-6 py-2 space-y-2 overflow-y-auto custom-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all group ${
                tab === t.id 
                  ? "bg-[rgba(212,175,55,0.1)] text-[var(--color-cta)] border border-[rgba(212,175,55,0.2)] shadow-lg" 
                  : "text-[var(--color-secondary)] border border-transparent hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--color-primary)]"
              }`}
            >
              <t.icon size={18} className={`transition-transform duration-300 ${tab === t.id ? "scale-110" : "group-hover:scale-110"}`} />
              {t.label}
              {t.count ? (
                <span className={`ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  tab === t.id ? "bg-[var(--color-cta)] text-[#1A1311]" : "bg-[rgba(212,175,55,0.2)] text-[var(--color-cta)]"
                }`}>
                  {t.count} New
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-4 md:p-6 border-t border-[rgba(212,175,55,0.1)] bg-[rgba(0,0,0,0.2)]">
          <a href="/" target="_blank" className="w-full mb-3 flex items-center justify-center gap-2 py-2 text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors group">
            View Live Site 
            <span className="transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
          </a>
          <button onClick={() => run(logoutAdmin)} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all shadow-[0_0_15px_rgba(220,38,38,0.05)]">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto w-full max-w-[1400px] mx-auto custom-scrollbar relative">
        <div className="flex justify-between items-end mb-10 hidden md:flex">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl text-[var(--color-primary)] font-medium mb-2">
              {TABS.find(t => t.id === tab)?.label}
            </h1>
            <p className="text-sm text-[var(--color-muted)]">Manage your cafe's content and bookings.</p>
          </div>
        </div>

        {/* Loading Overlay for pending transitions */}
        <AnimatePresence>
          {pending && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-cta)] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.2)] flex items-center gap-3"
            >
              <div className="w-4 h-4 border-2 border-[var(--color-cta)] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-[var(--color-primary)] tracking-widest uppercase">Saving changes...</span>
            </motion.div>
          )}
        </AnimatePresence>

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
      </main>

      {/* Global Dashboard Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
