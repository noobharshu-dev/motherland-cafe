"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, X, Check, ImageOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MI { id:string; categoryId:string; name:string; description:string; price:number; imageUrl:string; isVegetarian:boolean; isVegan:boolean; isGlutenFree:boolean; isFeatured:boolean; }
interface Cat { id:string; name:string; displayOrder:number; items:MI[]; }

const BLANK_ITEM = { categoryId:"", name:"", description:"", price:0, imageUrl:"", isVegetarian:false, isVegan:false, isGlutenFree:false, isFeatured:false };

interface MenuManagerProps {
  categories: Cat[];
  onCreateCategory?: (name: string) => void;
  onCreate: (item: any) => void;
  onUpdate: (id: string, item: any) => void;
  onDelete: (id: string) => void;
}

export default function MenuManager({ categories, onCreateCategory, onCreate, onUpdate, onDelete }: MenuManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MI | null>(null);
  const [itemF, setItemF] = useState(BLANK_ITEM);

  const openNewForm = () => {
    setItemF({ ...BLANK_ITEM, categoryId: categories[0]?.id ?? "" });
    setEditItem(null);
    setShowForm(true);
  };

  const openEditForm = (item: MI) => {
    setItemF({
      categoryId: item.categoryId,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isGlutenFree: item.isGlutenFree,
      isFeatured: item.isFeatured
    });
    setEditItem(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = () => {
    if (editItem) {
      onUpdate(editItem.id, itemF);
    } else {
      onCreate(itemF);
    }
    setShowForm(false);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditItem(null);
  };

  const inputClass = "w-full p-3 bg-[rgba(0,0,0,0.2)] text-[var(--color-primary)] border border-[rgba(255,255,255,0.1)] rounded-xl text-sm focus:ring-1 focus:ring-[var(--color-cta)] outline-none transition-shadow";

  return (
    <div className="w-full space-y-8">
      {/* Add/Edit Inline Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-[var(--color-surface)] rounded-2xl border border-[rgba(255,255,255,0.05)] shadow-xl p-6 md:p-8 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-[family-name:var(--font-heading)] text-2xl text-[var(--color-primary)] font-medium">
                {editItem ? "Edit Menu Item" : "Add New Item"}
              </h3>
              <button onClick={cancelForm} className="text-[var(--color-muted)] hover:text-white transition-colors bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] p-2 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">Item Name *</label>
                <input className={inputClass} value={itemF.name} onChange={e => setItemF(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Flat White" />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">Price (₹) *</label>
                <input type="number" className={inputClass} value={itemF.price || ""} onChange={e => setItemF(f => ({ ...f, price: Number(e.target.value) }))} placeholder="e.g. 150" />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">Category *</label>
                <select className={`${inputClass} appearance-none`} value={itemF.categoryId} onChange={e => setItemF(f => ({ ...f, categoryId: e.target.value }))}>
                  <option value="" disabled>Select a category...</option>
                  {categories.map(c => <option key={c.id} value={c.id} className="bg-[var(--color-surface)] text-white">{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">Image URL</label>
                <input className={inputClass} value={itemF.imageUrl} onChange={e => setItemF(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://images.unsplash.com/..." />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">Description</label>
                <textarea rows={2} className={`${inputClass} resize-y`} value={itemF.description} onChange={e => setItemF(f => ({ ...f, description: e.target.value }))} placeholder="Short description of the item..." />
              </div>

              <div className="md:col-span-2 flex flex-wrap gap-4 pt-2">
                {(["isVegetarian", "isVegan", "isGlutenFree", "isFeatured"] as const).map(k => (
                  <label key={k} className="flex items-center gap-2 px-4 py-2 bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.05)] rounded-full cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-[var(--color-cta)] rounded bg-transparent border-[rgba(255,255,255,0.2)] focus:ring-[var(--color-cta)] focus:ring-offset-0 focus:ring-offset-transparent accent-[var(--color-cta)]" checked={itemF[k]} onChange={e => setItemF(f => ({ ...f, [k]: e.target.checked }))} />
                    <span className="text-sm font-medium text-[var(--color-secondary)]">
                      {k.replace("is", "").replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={cancelForm} className="px-6 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-[var(--color-primary)] text-sm font-bold hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--color-cta)] text-[#1A1311] text-sm font-bold hover:bg-[#B8972E] transition-colors shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <Check size={16} /> {editItem ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showForm && (
        <div className="flex items-center gap-4">
          <button onClick={openNewForm} className="flex items-center gap-2 px-6 py-3 bg-[var(--color-cta)] text-[#1A1311] rounded-xl text-sm font-bold hover:bg-[#B8972E] transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Plus size={16} /> Add Menu Item
          </button>
          {onCreateCategory && (
            <button onClick={() => { const name = prompt("Enter category name"); if(name) onCreateCategory(name); }} className="flex items-center gap-2 px-6 py-3 btn-outline text-sm font-bold">
              <Plus size={16} /> New Category
            </button>
          )}
        </div>
      )}

      {/* Categories & Items Grid */}
      <div className="space-y-12 pt-4">
        {categories.map(cat => cat.items.length > 0 && (
          <div key={cat.id}>
            <h3 className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest mb-4">
              {cat.name} · {cat.items.length} items
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {cat.items.map(item => (
                <div key={item.id} className="bg-[var(--color-surface)] rounded-2xl border border-[rgba(255,255,255,0.05)] overflow-hidden flex flex-col hover:border-[rgba(212,175,55,0.2)] transition-colors group shadow-lg">
                  <div className="h-44 bg-[rgba(0,0,0,0.2)] relative overflow-hidden">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 300px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[rgba(255,255,255,0.1)]">
                        <ImageOff size={32} />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-[rgba(26,21,18,0.8)] backdrop-blur-md text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[rgba(255,255,255,0.1)] shadow-md">
                      {cat.name}
                    </span>
                    {item.isFeatured && (
                      <span className="absolute top-3 right-3 bg-[var(--color-cta)] text-[#1A1311] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="font-[family-name:var(--font-heading)] font-semibold text-lg text-[var(--color-primary)] leading-tight">{item.name}</p>
                      <p className="font-bold text-[var(--color-cta)] text-lg shrink-0">₹{item.price}</p>
                    </div>
                    {item.description && (
                      <p className="text-[var(--color-muted)] text-xs leading-relaxed line-clamp-2 flex-grow mb-4">{item.description}</p>
                    )}
                    <div className="flex gap-2 mt-auto pt-4 border-t border-[rgba(255,255,255,0.05)]">
                      <button onClick={() => openEditForm(item)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.1)] text-[var(--color-secondary)] text-xs font-bold hover:border-[var(--color-cta)] hover:text-[var(--color-cta)] transition-colors">
                        <Edit2 size={14} /> Edit
                      </button>
                      <button onClick={() => { if(confirm(`Delete "${item.name}"?`)) onDelete(item.id); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.1)] text-[var(--color-secondary)] text-xs font-bold hover:border-red-500 hover:text-red-400 transition-colors ml-auto">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {categories.every(cat => cat.items.length === 0) && (
          <div className="text-center py-20 text-[var(--color-muted)] bg-[rgba(255,255,255,0.01)] rounded-2xl border border-[rgba(255,255,255,0.05)] border-dashed">
            No items found. Click "Add Menu Item" to start.
          </div>
        )}
      </div>
    </div>
  );
}
