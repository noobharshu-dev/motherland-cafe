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

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  background: "rgba(0,0,0,0.25)",
  color: "#FBF9F6",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "0.75rem",
  fontSize: "0.875rem",
  outline: "none",
  transition: "border-color 0.2s",
};

export default function MenuManager({ categories, onCreateCategory, onCreate, onUpdate, onDelete }: MenuManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MI | null>(null);
  const [itemF, setItemF] = useState(BLANK_ITEM);
  const [deleteTarget, setDeleteTarget] = useState<MI | null>(null);

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
    setEditItem(null);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditItem(null);
  };

  const handleDelete = (item: MI) => {
    setDeleteTarget(item);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const allItems = categories.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <div className="w-full space-y-6">

      {/* ── Delete Confirmation Modal ─────────────────────────── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center"
              style={{ background: "#211A15", border: "1px solid rgba(255,255,255,0.08)" }}
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(220,38,38,0.15)" }}>
                <Trash2 size={22} style={{ color: "#f87171" }} />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: "#FBF9F6" }}>Delete this item?</h3>
              <p className="text-sm mb-6" style={{ color: "#A89F91" }}>
                &ldquo;{deleteTarget.name}&rdquo; will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#FBF9F6", background: "transparent" }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
                  style={{ background: "#dc2626", color: "#fff" }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Add / Edit Inline Form ────────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="rounded-2xl p-6 md:p-8 shadow-xl"
            style={{ background: "#211A15", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl" style={{ color: "#FBF9F6", fontFamily: "var(--font-heading, Georgia, serif)" }}>
                {editItem ? "Edit Menu Item" : "Add New Item"}
              </h3>
              <button
                onClick={cancelForm}
                className="p-2 rounded-full transition-colors"
                style={{ color: "#A89F91", background: "rgba(255,255,255,0.05)" }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#A89F91" }}>Item Name *</label>
                <input
                  style={inputStyle}
                  value={itemF.name}
                  onChange={e => setItemF(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Masala Chai"
                  onFocus={e => (e.target.style.borderColor = "#D4AF37")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#A89F91" }}>Price (₹) *</label>
                <input
                  type="number"
                  style={inputStyle}
                  value={itemF.price || ""}
                  onChange={e => setItemF(f => ({ ...f, price: Number(e.target.value) }))}
                  placeholder="e.g. 150"
                  onFocus={e => (e.target.style.borderColor = "#D4AF37")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#A89F91" }}>Category *</label>
                <select
                  style={{ ...inputStyle, appearance: "none" as const }}
                  value={itemF.categoryId}
                  onChange={e => setItemF(f => ({ ...f, categoryId: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = "#D4AF37")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                >
                  <option value="" disabled style={{ background: "#211A15" }}>Select a category...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id} style={{ background: "#211A15", color: "#FBF9F6" }}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#A89F91" }}>Image URL</label>
                <input
                  style={inputStyle}
                  value={itemF.imageUrl}
                  onChange={e => setItemF(f => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  onFocus={e => (e.target.style.borderColor = "#D4AF37")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#A89F91" }}>Description</label>
                <textarea
                  rows={2}
                  style={{ ...inputStyle, resize: "vertical" }}
                  value={itemF.description}
                  onChange={e => setItemF(f => ({ ...f, description: e.target.value }))}
                  placeholder="Short description of the item..."
                  onFocus={e => (e.target.style.borderColor = "#D4AF37")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>

              <div className="md:col-span-2 flex flex-wrap gap-3 pt-1">
                {(["isVegetarian", "isVegan", "isGlutenFree", "isFeatured"] as const).map(k => (
                  <label
                    key={k}
                    className="flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-colors text-sm font-medium select-none"
                    style={{
                      background: itemF[k] ? "rgba(212,175,55,0.1)" : "rgba(0,0,0,0.2)",
                      border: `1px solid ${itemF[k] ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.07)"}`,
                      color: itemF[k] ? "#D4AF37" : "#A89F91",
                    }}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={itemF[k]}
                      onChange={e => setItemF(f => ({ ...f, [k]: e.target.checked }))}
                    />
                    <span className="w-4 h-4 rounded border flex items-center justify-center"
                      style={{ borderColor: itemF[k] ? "#D4AF37" : "rgba(255,255,255,0.2)", background: itemF[k] ? "#D4AF37" : "transparent" }}>
                      {itemF[k] && <Check size={10} style={{ color: "#1A1311" }} />}
                    </span>
                    {k.replace("is", "").replace(/([A-Z])/g, " $1").trim()}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button
                onClick={cancelForm}
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#FBF9F6", background: "transparent" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
                style={{ background: "#D4AF37", color: "#1A1311" }}
              >
                <Check size={15} />
                {editItem ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Action Bar ───────────────────────────────────────── */}
      {!showForm && (
        <div className="flex items-center gap-3">
          <button
            onClick={openNewForm}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background: "#D4AF37", color: "#1A1311" }}
          >
            <Plus size={16} /> Add Menu Item
          </button>
          {onCreateCategory && (
            <button
              onClick={() => { const name = prompt("Enter category name"); if (name) onCreateCategory(name); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#FBF9F6", background: "transparent" }}
            >
              <Plus size={16} /> New Category
            </button>
          )}
        </div>
      )}

      {/* ── Categories & Items Grid ───────────────────────────── */}
      <div className="space-y-10 pt-2">
        {categories.map(cat => cat.items.length > 0 && (
          <div key={cat.id}>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#A89F91" }}>
              {cat.name} · {cat.items.length} item{cat.items.length !== 1 ? "s" : ""}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cat.items.map(item => (
                <div
                  key={item.id}
                  className="rounded-2xl overflow-hidden flex flex-col transition-all group shadow-lg"
                  style={{ background: "#211A15", border: "1px solid rgba(255,255,255,0.05)" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)")}
                >
                  {/* Image */}
                  <div className="h-44 relative overflow-hidden" style={{ background: "rgba(0,0,0,0.2)" }}>
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ color: "rgba(255,255,255,0.1)" }}>
                        <ImageOff size={32} />
                      </div>
                    )}
                    <span
                      className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(26,21,18,0.85)", color: "#FBF9F6", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
                    >
                      {cat.name}
                    </span>
                    {item.isFeatured && (
                      <span
                        className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{ background: "#D4AF37", color: "#1A1311" }}
                      >
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-grow flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="font-bold text-base leading-tight" style={{ color: "#FBF9F6" }}>{item.name}</p>
                      <p className="font-bold text-base shrink-0" style={{ color: "#D4AF37" }}>₹{item.price}</p>
                    </div>
                    {item.description && (
                      <p className="text-xs leading-relaxed line-clamp-2 flex-grow mb-3" style={{ color: "#A89F91" }}>
                        {item.description}
                      </p>
                    )}

                    {/* Flags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.isVegetarian && <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}>Veg</span>}
                      {item.isVegan && <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}>Vegan</span>}
                      {item.isGlutenFree && <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }}>GF</span>}
                    </div>

                    {/* Actions */}
                    <div
                      className="flex gap-2 pt-3"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <button
                        onClick={() => openEditForm(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                        style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#A89F91" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#D4AF37"; e.currentTarget.style.color = "#D4AF37"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#A89F91"; }}
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ml-auto"
                        style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#A89F91" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#dc2626"; e.currentTarget.style.color = "#f87171"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#A89F91"; }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {allItems === 0 && (
          <div
            className="text-center py-20 rounded-2xl"
            style={{ color: "#A89F91", background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(255,255,255,0.07)" }}
          >
            No items found. Click &ldquo;Add Menu Item&rdquo; to get started.
          </div>
        )}
      </div>
    </div>
  );
}
