"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Plus, Image as ImageIcon, Coffee, Star, Calendar, 
  Trash2, Edit2, LayoutDashboard, Menu as MenuIcon, X
} from "lucide-react";
import {
  logoutAdmin, createMenuItem, updateMenuItem, deleteMenuItem,
  createGalleryImage, deleteGalleryImage,
  createReview, toggleReviewPublished, deleteReview,
  updateReservationStatus,
} from "./actions";
import type { MenuItemInput, GalleryInput, ReviewInput } from "./actions";

type Tab = "menu" | "gallery" | "reviews" | "reservations";
interface MI { id:string; categoryId:string; name:string; description:string; price:number; imageUrl:string; isVegetarian:boolean; isVegan:boolean; isGlutenFree:boolean; isFeatured:boolean; }
interface Cat { id:string; name:string; displayOrder:number; items:MI[]; }
interface GI { id:string; imageUrl:string; title:string; category:string; isPublished:boolean; displayOrder:number; }
interface Rev { id:string; name:string; rating:number; reviewText:string; source:string; isPublished:boolean; createdAt:string; }
interface Res { id:string; name:string; phone:string; email:string; guests:number; reservationDate:string; reservationTime:string; notes:string|null; status:string; createdAt:string; }

const BLANK_ITEM: MenuItemInput = { categoryId:"", name:"", description:"", price:0, imageUrl:"", isVegetarian:false, isVegan:false, isGlutenFree:false, isFeatured:false };
const BLANK_GAL: GalleryInput = { imageUrl:"", title:"", category:"ambience", displayOrder:0, isPublished:true };
const BLANK_REV: ReviewInput = { name:"", rating:5, reviewText:"", source:"Google", isPublished:true };

export default function AdminDashboard({ categories, galleryImages, reviews, reservations }: { categories:Cat[]; galleryImages:GI[]; reviews:Rev[]; reservations:Res[]; }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [tab, setTab] = useState<Tab>("menu");
  const [catId, setCatId] = useState(categories[0]?.id ?? "");
  const [editItem, setEditItem] = useState<MI|null>(null);
  const [showItem, setShowItem] = useState(false);
  const [itemF, setItemF] = useState<MenuItemInput>(BLANK_ITEM);
  const [showGal, setShowGal] = useState(false);
  const [galF, setGalF] = useState<GalleryInput>(BLANK_GAL);
  const [showRev, setShowRev] = useState(false);
  const [revF, setRevF] = useState<ReviewInput>(BLANK_REV);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const run = (fn: ()=>Promise<unknown>) => start(async()=>{ await fn(); router.refresh(); });
  const activeCat = categories.find(c=>c.id===catId);

  const TABS: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: "menu", label: "Menu", icon: Coffee },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "reservations", label: "Reservations", icon: Calendar, count: reservations.filter(r=>r.status==="pending").length },
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F6] flex flex-col md:flex-row font-[family-name:var(--font-body)]">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#EAE5DF] sticky top-0 z-50">
        <span className="font-[family-name:var(--font-heading)] text-xl text-[#2C1E16] font-medium tracking-tight">Motherland Admin</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-[#5C4033]">
          {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#EAE5DF] flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 hidden md:block">
          <span className="font-[family-name:var(--font-heading)] text-2xl text-[#2C1E16] font-medium tracking-tight flex items-center gap-2">
            <LayoutDashboard className="text-[#D4AF37]" size={22} />
            Motherland
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-4 md:py-0 space-y-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${tab === t.id ? "bg-[#2C1E16] text-white shadow-md" : "text-[#5C4033] hover:bg-[#FBF9F6]"}`}
            >
              <t.icon size={18} className={tab === t.id ? "text-[#D4AF37]" : "opacity-70"} />
              {t.label}
              {t.count ? (
                <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${tab === t.id ? "bg-[#D4AF37] text-[#2C1E16]" : "bg-red-100 text-red-700"}`}>
                  {t.count}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#EAE5DF]">
          <a href="/" target="_blank" className="w-full mb-2 flex justify-center py-2 text-sm text-[#5C4033] hover:underline">View Live Site ↗</a>
          <button onClick={() => run(logoutAdmin)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8 hidden md:flex">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl text-[#2C1E16] font-medium">{TABS.find(t => t.id === tab)?.label}</h1>
            <p className="text-sm text-[#8B7355] mt-1">Manage your cafe's content and bookings.</p>
          </div>
          {pending && <span className="text-sm font-medium text-[#D4AF37] animate-pulse">Saving changes...</span>}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-full"
          >
            {/* ── MENU ── */}
            {tab==="menu" && (<>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  {categories.map(c=>(
                    <button key={c.id} onClick={()=>setCatId(c.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${catId===c.id ? "bg-[#2C1E16] text-white border-[#2C1E16]" : "bg-white text-[#5C4033] border-[#EAE5DF] hover:border-[#2C1E16]"}`}>
                      {c.name} <span className="opacity-60 text-xs ml-1">({c.items.length})</span>
                    </button>
                  ))}
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#2C1E16] text-white rounded-full text-sm font-medium hover:bg-black transition-all shadow-md hover:shadow-lg" onClick={()=>{ setEditItem(null); setItemF({...BLANK_ITEM,categoryId:catId}); setShowItem(s=>!s); }}>
                  <Plus size={16} /> Add Item
                </button>
              </div>

              {showItem && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-white p-6 rounded-2xl shadow-sm border border-[#EAE5DF] mb-8 overflow-hidden">
                  <h2 className="font-[family-name:var(--font-heading)] text-2xl text-[#2C1E16] mb-6">{editItem ? "Edit Menu Item" : "New Menu Item"}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-2">Category</label>
                      <select className="w-full p-3 bg-[#FBF9F6] border border-[#EAE5DF] rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none transition-shadow" value={itemF.categoryId} onChange={e=>setItemF(f=>({...f,categoryId:e.target.value}))}>
                        {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-2">Name *</label>
                      <input className="w-full p-3 bg-[#FBF9F6] border border-[#EAE5DF] rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none transition-shadow" value={itemF.name} onChange={e=>setItemF(f=>({...f,name:e.target.value}))} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-2">Price ₹</label>
                      <input type="number" className="w-full p-3 bg-[#FBF9F6] border border-[#EAE5DF] rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none transition-shadow" value={itemF.price} onChange={e=>setItemF(f=>({...f,price:Number(e.target.value)}))} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-2">Image URL</label>
                      <input className="w-full p-3 bg-[#FBF9F6] border border-[#EAE5DF] rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none transition-shadow" value={itemF.imageUrl} onChange={e=>setItemF(f=>({...f,imageUrl:e.target.value}))} placeholder="https://images.unsplash.com/..." />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-2">Description</label>
                      <textarea rows={2} className="w-full p-3 bg-[#FBF9F6] border border-[#EAE5DF] rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none transition-shadow resize-y" value={itemF.description} onChange={e=>setItemF(f=>({...f,description:e.target.value}))} />
                    </div>
                    <div className="md:col-span-2 flex flex-wrap gap-6 pt-2">
                      {(["isVegetarian","isVegan","isGlutenFree","isFeatured"] as const).map(k=>(
                        <label key={k} className="flex items-center gap-2 text-sm font-medium text-[#5C4033] cursor-pointer group">
                          <input type="checkbox" className="w-4 h-4 text-[#2C1E16] rounded border-[#EAE5DF] focus:ring-[#D4AF37]" checked={itemF[k]} onChange={e=>setItemF(f=>({...f,[k]:e.target.checked}))} />
                          {k.replace("is","").replace(/([A-Z])/g," $1").trim()}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-8 pt-6 border-t border-[#EAE5DF]">
                    <button className="px-6 py-2.5 bg-[#2C1E16] text-white rounded-xl text-sm font-bold hover:bg-black transition-colors" onClick={()=>run(async()=>{ editItem ? await updateMenuItem(editItem.id, itemF) : await createMenuItem(itemF); setShowItem(false); setEditItem(null); })}>
                      {editItem ? "Save Changes" : "Add Menu Item"}
                    </button>
                    <button className="px-6 py-2.5 bg-white text-[#2C1E16] border border-[#EAE5DF] rounded-xl text-sm font-bold hover:bg-[#FBF9F6] transition-colors" onClick={()=>{ setShowItem(false); setEditItem(null); }}>Cancel</button>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {(activeCat?.items??[]).map(item=>(
                  <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-[#EAE5DF] flex gap-4 group hover:shadow-md transition-shadow">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative bg-gray-100">
                      {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="80px" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-[family-name:var(--font-heading)] text-lg text-[#2C1E16] font-medium leading-tight truncate pr-2">{item.name}</h3>
                        <span className="font-bold text-sm text-[#D4AF37]">₹{item.price}</span>
                      </div>
                      <p className="text-xs text-[#8B7355] mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                      
                      <div className="flex gap-2 mt-4">
                        <button className="flex-1 flex justify-center items-center gap-1 py-1.5 bg-[#FBF9F6] hover:bg-[#EAE5DF] text-[#2C1E16] rounded-lg text-xs font-semibold transition-colors" onClick={()=>{ setItemF({ categoryId:item.categoryId, name:item.name, description:item.description, price:item.price, imageUrl:item.imageUrl, isVegetarian:item.isVegetarian, isVegan:item.isVegan, isGlutenFree:item.isGlutenFree, isFeatured:item.isFeatured }); setEditItem(item); setShowItem(true); window.scrollTo({top:0,behavior:"smooth"}); }}>
                          <Edit2 size={12} /> Edit
                        </button>
                        <button className="flex-1 flex justify-center items-center gap-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition-colors" onClick={()=>{ if(confirm(`Delete "${item.name}"?`)) run(()=>deleteMenuItem(item.id)); }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {!activeCat?.items.length && <div className="text-center py-20 text-[#8B7355]">No items found. Click "Add Item" to start.</div>}
            </>)}

            {/* ── GALLERY ── */}
            {tab==="gallery" && (<>
              <div className="flex justify-end mb-6">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#2C1E16] text-white rounded-full text-sm font-medium hover:bg-black transition-all shadow-md" onClick={()=>setShowGal(s=>!s)}>
                  <Plus size={16} /> Add Photo
                </button>
              </div>
              {showGal && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-white p-6 rounded-2xl shadow-sm border border-[#EAE5DF] mb-8 overflow-hidden">
                  <h2 className="font-[family-name:var(--font-heading)] text-2xl text-[#2C1E16] mb-6">Add Gallery Photo</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2"><label className="block text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-2">Image URL *</label><input className="w-full p-3 bg-[#FBF9F6] border border-[#EAE5DF] rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none" value={galF.imageUrl} onChange={e=>setGalF(f=>({...f,imageUrl:e.target.value}))} placeholder="https://images.unsplash.com/ or Cloudinary URL" /></div>
                    <div><label className="block text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-2">Title</label><input className="w-full p-3 bg-[#FBF9F6] border border-[#EAE5DF] rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none" value={galF.title} onChange={e=>setGalF(f=>({...f,title:e.target.value}))} /></div>
                    <div><label className="block text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-2">Category</label>
                      <select className="w-full p-3 bg-[#FBF9F6] border border-[#EAE5DF] rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none" value={galF.category} onChange={e=>setGalF(f=>({...f,category:e.target.value}))}>
                        <option value="ambience">Ambience</option><option value="food">Food</option><option value="drinks">Drinks</option>
                      </select>
                    </div>
                    <div><label className="block text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-2">Display Order</label><input type="number" className="w-full p-3 bg-[#FBF9F6] border border-[#EAE5DF] rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none" value={galF.displayOrder} onChange={e=>setGalF(f=>({...f,displayOrder:Number(e.target.value)}))} /></div>
                    <div className="flex items-center pt-6">
                      <label className="flex items-center gap-2 text-sm font-medium text-[#5C4033] cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-[#2C1E16] rounded border-[#EAE5DF] focus:ring-[#D4AF37]" checked={galF.isPublished} onChange={e=>setGalF(f=>({...f,isPublished:e.target.checked}))} /> Published Live
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-8 pt-6 border-t border-[#EAE5DF]">
                    <button className="px-6 py-2.5 bg-[#2C1E16] text-white rounded-xl text-sm font-bold hover:bg-black transition-colors" onClick={()=>run(async()=>{ await createGalleryImage(galF); setShowGal(false); setGalF(BLANK_GAL); })}>Upload Photo</button>
                    <button className="px-6 py-2.5 bg-white text-[#2C1E16] border border-[#EAE5DF] rounded-xl text-sm font-bold hover:bg-[#FBF9F6] transition-colors" onClick={()=>setShowGal(false)}>Cancel</button>
                  </div>
                </motion.div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map(img=>(
                  <div key={img.id} className="bg-white rounded-2xl shadow-sm border border-[#EAE5DF] overflow-hidden group">
                    <div className="relative aspect-square bg-gray-100">
                      <Image src={img.imageUrl} alt={img.title} fill className="object-cover" sizes="300px" />
                      {!img.isPublished && <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"><span className="text-white text-xs font-bold tracking-widest">HIDDEN</span></div>}
                      <button className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50" onClick={()=>{ if(confirm(`Delete "${img.title}"?`)) run(()=>deleteGalleryImage(img.id)); }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-sm text-[#2C1E16] truncate">{img.title}</p>
                      <p className="text-xs text-[#8B7355] capitalize">{img.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>)}

            {/* ── REVIEWS ── */}
            {tab==="reviews" && (<>
              <div className="flex justify-end mb-6">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#2C1E16] text-white rounded-full text-sm font-medium hover:bg-black transition-all shadow-md" onClick={()=>setShowRev(s=>!s)}>
                  <Plus size={16} /> Add Review
                </button>
              </div>
              {showRev && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-white p-6 rounded-2xl shadow-sm border border-[#EAE5DF] mb-8 overflow-hidden">
                  <h2 className="font-[family-name:var(--font-heading)] text-2xl text-[#2C1E16] mb-6">Add Review</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div><label className="block text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-2">Name</label><input className="w-full p-3 bg-[#FBF9F6] border border-[#EAE5DF] rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none" value={revF.name} onChange={e=>setRevF(f=>({...f,name:e.target.value}))} /></div>
                    <div><label className="block text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-2">Rating (1-5)</label><input type="number" min={1} max={5} className="w-full p-3 bg-[#FBF9F6] border border-[#EAE5DF] rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none" value={revF.rating} onChange={e=>setRevF(f=>({...f,rating:Number(e.target.value)}))} /></div>
                    <div><label className="block text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-2">Source</label>
                      <select className="w-full p-3 bg-[#FBF9F6] border border-[#EAE5DF] rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none" value={revF.source} onChange={e=>setRevF(f=>({...f,source:e.target.value}))}>
                        <option>Google</option><option>Zomato</option><option>Instagram</option><option>Direct</option>
                      </select>
                    </div>
                    <div className="md:col-span-3"><label className="block text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-2">Review Text</label><textarea rows={3} className="w-full p-3 bg-[#FBF9F6] border border-[#EAE5DF] rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none resize-y" value={revF.reviewText} onChange={e=>setRevF(f=>({...f,reviewText:e.target.value}))} /></div>
                    <div className="md:col-span-3">
                      <label className="flex items-center gap-2 text-sm font-medium text-[#5C4033] cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-[#2C1E16] rounded border-[#EAE5DF] focus:ring-[#D4AF37]" checked={revF.isPublished} onChange={e=>setRevF(f=>({...f,isPublished:e.target.checked}))} /> Show on public site
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-8 pt-6 border-t border-[#EAE5DF]">
                    <button className="px-6 py-2.5 bg-[#2C1E16] text-white rounded-xl text-sm font-bold hover:bg-black transition-colors" onClick={()=>run(async()=>{ await createReview(revF); setShowRev(false); setRevF(BLANK_REV); })}>Add Review</button>
                    <button className="px-6 py-2.5 bg-white text-[#2C1E16] border border-[#EAE5DF] rounded-xl text-sm font-bold hover:bg-[#FBF9F6] transition-colors" onClick={()=>setShowRev(false)}>Cancel</button>
                  </div>
                </motion.div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map(r=>(
                  <div key={r.id} className="bg-white p-5 rounded-2xl shadow-sm border border-[#EAE5DF] flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-[#2C1E16]">{r.name}</h4>
                          <span className="text-xs text-[#8B7355]">via {r.source}</span>
                        </div>
                        <div className="text-[#D4AF37] text-sm tracking-widest">{"★".repeat(r.rating)}</div>
                      </div>
                      <p className="text-sm text-[#5C4033] leading-relaxed mb-6">"{r.reviewText}"</p>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-[#EAE5DF]">
                      <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${r.isPublished ? 'bg-green-500' : 'bg-gray-300'}`}>
                          <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${r.isPublished ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                        <span className={r.isPublished ? "text-green-700" : "text-gray-500"}>{r.isPublished ? "Live" : "Hidden"}</span>
                        <input type="checkbox" className="hidden" checked={r.isPublished} onChange={e=>run(()=>toggleReviewPublished(r.id,e.target.checked))} />
                      </label>
                      <button className="text-xs font-bold text-red-600 hover:text-red-800" onClick={()=>{ if(confirm("Delete review?")) run(()=>deleteReview(r.id)); }}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </>)}

            {/* ── RESERVATIONS ── */}
            {tab==="reservations" && (
              <div className="bg-white rounded-2xl shadow-sm border border-[#EAE5DF] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-[#8B7355] uppercase bg-[#FBF9F6] border-b border-[#EAE5DF]">
                      <tr>
                        <th className="px-6 py-4 font-bold tracking-wider">Guest Details</th>
                        <th className="px-6 py-4 font-bold tracking-wider">Date & Time</th>
                        <th className="px-6 py-4 font-bold tracking-wider text-center">Party</th>
                        <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE5DF]">
                      {reservations.map((r)=>(
                        <tr key={r.id} className="hover:bg-[#FBF9F6] transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-[#2C1E16] mb-0.5">{r.name}</div>
                            <div className="text-[#8B7355] text-xs">{r.phone}</div>
                            <div className="text-[#8B7355] text-xs">{r.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-semibold text-[#2C1E16]">{r.reservationDate}</div>
                            <div className="text-[#8B7355]">{r.reservationTime}</div>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-[#2C1E16]">
                            {r.guests} <span className="text-[#8B7355] font-normal text-xs">pax</span>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={r.status}
                              onChange={e=>run(()=>updateReservationStatus(r.id,e.target.value))}
                              className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer appearance-none pr-8 ${
                                r.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' : 
                                r.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 
                                'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }`}
                              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.25rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em' }}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            {r.notes && (
                              <div className="mt-2 text-xs text-[#8B7355] italic max-w-xs truncate">
                                Note: {r.notes}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {!reservations.length && <div className="text-center py-20 text-[#8B7355]">No reservations found.</div>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
