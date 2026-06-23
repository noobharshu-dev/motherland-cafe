"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";

// Reusing types from AdminDashboard
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
  const [catId, setCatId] = useState(categories[0]?.id ?? "");
  const [editItem, setEditItem] = useState<MI | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [itemF, setItemF] = useState(BLANK_ITEM);

  const activeCat = categories.find(c => c.id === catId);

  const openNewModal = () => {
    setItemF({ ...BLANK_ITEM, categoryId: catId });
    setEditItem(null);
    setShowModal(true);
  };

  const openEditModal = (item: MI) => {
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
    setShowModal(true);
  };

  const handleSave = () => {
    if (editItem) {
      onUpdate(editItem.id, itemF);
    } else {
      onCreate(itemF);
    }
    setShowModal(false);
  };

  return (
    <div className="w-full">
      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setCatId(c.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                catId === c.id
                  ? "bg-[var(--color-cta)] text-[#1A1311] border-[var(--color-cta)]"
                  : "bg-[rgba(255,255,255,0.02)] text-[var(--color-secondary)] border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.05)]"
              }`}
            >
              {c.name} <span className="opacity-60 text-xs ml-1">({c.items.length})</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {onCreateCategory && (
            <button
              className="flex items-center gap-2 px-5 py-2.5 btn-outline text-sm font-bold whitespace-nowrap"
              onClick={() => { const name = prompt("Enter category name"); if(name) onCreateCategory(name); }}
            >
              <Plus size={16} /> New Category
            </button>
          )}
          <button
            className="flex items-center gap-2 px-5 py-2.5 btn-primary bg-[var(--color-cta)] text-[#1A1311] rounded-full text-sm font-bold whitespace-nowrap hover:bg-[#B8972E] transition-all"
            onClick={openNewModal}
          >
            <Plus size={16} /> Add Item
          </button>
        </div>
      </div>

      {/* Grid Layout (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(activeCat?.items ?? []).map(item => (
          <div
            key={item.id}
            className="bg-[rgba(255,255,255,0.02)] backdrop-blur-md p-4 rounded-2xl border border-[rgba(255,255,255,0.05)] flex gap-4 group hover:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.03)] transition-all"
          >
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative bg-[rgba(0,0,0,0.2)]">
              {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="80px" />}
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex justify-between items-start">
                <h3 className="font-[family-name:var(--font-heading)] text-lg text-[var(--color-primary)] font-medium leading-tight truncate pr-2">
                  {item.name}
                </h3>
                <span className="font-bold text-sm text-[var(--color-cta)]">₹{item.price}</span>
              </div>
              <p className="text-xs text-[var(--color-muted)] mt-1 line-clamp-2 leading-relaxed flex-1">
                {item.description}
              </p>
              
              <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="flex-1 flex justify-center items-center gap-1 py-1.5 btn-outline text-[var(--color-primary)] rounded-lg text-xs font-medium transition-colors"
                  onClick={() => openEditModal(item)}
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button
                  className="flex-1 flex justify-center items-center gap-1 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium transition-colors"
                  onClick={() => { if(confirm(`Delete "${item.name}"?`)) onDelete(item.id); }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!activeCat?.items.length && (
        <div className="text-center py-20 text-[var(--color-muted)] bg-[rgba(255,255,255,0.01)] rounded-2xl border border-[rgba(255,255,255,0.05)] border-dashed mt-4">
          No items found in {activeCat?.name}. Click "Add Item" to start.
        </div>
      )}

      {/* Modal Form */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? "Edit Menu Item" : "New Menu Item"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">Category</label>
            <select
              className="w-full p-3 bg-[rgba(0,0,0,0.2)] text-[var(--color-primary)] border border-[rgba(255,255,255,0.1)] rounded-xl text-sm focus:ring-1 focus:ring-[var(--color-cta)] outline-none transition-shadow"
              value={itemF.categoryId}
              onChange={e => setItemF(f => ({ ...f, categoryId: e.target.value }))}
            >
              <option value="" disabled>Select a category...</option>
              {categories.map(c => <option key={c.id} value={c.id} className="bg-[var(--color-surface)] text-white">{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">Name *</label>
            <input
              className="w-full p-3 bg-[rgba(0,0,0,0.2)] text-[var(--color-primary)] border border-[rgba(255,255,255,0.1)] rounded-xl text-sm focus:ring-1 focus:ring-[var(--color-cta)] outline-none transition-shadow"
              value={itemF.name}
              onChange={e => setItemF(f => ({ ...f, name: e.target.value }))}
              placeholder="E.g., Espresso"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">Price ₹</label>
            <input
              type="number"
              className="w-full p-3 bg-[rgba(0,0,0,0.2)] text-[var(--color-primary)] border border-[rgba(255,255,255,0.1)] rounded-xl text-sm focus:ring-1 focus:ring-[var(--color-cta)] outline-none transition-shadow"
              value={itemF.price || ""}
              onChange={e => setItemF(f => ({ ...f, price: Number(e.target.value) }))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">Image URL</label>
            <input
              className="w-full p-3 bg-[rgba(0,0,0,0.2)] text-[var(--color-primary)] border border-[rgba(255,255,255,0.1)] rounded-xl text-sm focus:ring-1 focus:ring-[var(--color-cta)] outline-none transition-shadow"
              value={itemF.imageUrl}
              onChange={e => setItemF(f => ({ ...f, imageUrl: e.target.value }))}
              placeholder="https://images.unsplash.com/..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">Description</label>
            <textarea
              rows={3}
              className="w-full p-3 bg-[rgba(0,0,0,0.2)] text-[var(--color-primary)] border border-[rgba(255,255,255,0.1)] rounded-xl text-sm focus:ring-1 focus:ring-[var(--color-cta)] outline-none transition-shadow resize-y"
              value={itemF.description}
              onChange={e => setItemF(f => ({ ...f, description: e.target.value }))}
              placeholder="Short description of the item..."
            />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-4 pt-2">
            {(["isVegetarian", "isVegan", "isGlutenFree", "isFeatured"] as const).map(k => (
              <label key={k} className="flex items-center gap-2 px-4 py-2 bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.05)] rounded-full cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[var(--color-cta)] rounded bg-transparent border-[rgba(255,255,255,0.2)] focus:ring-[var(--color-cta)] focus:ring-offset-0 focus:ring-offset-transparent accent-[var(--color-cta)]"
                  checked={itemF[k]}
                  onChange={e => setItemF(f => ({ ...f, [k]: e.target.checked }))}
                />
                <span className="text-sm font-medium text-[var(--color-secondary)]">
                  {k.replace("is", "").replace(/([A-Z])/g, " $1").trim()}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-[rgba(255,255,255,0.05)]">
          <button
            className="px-6 py-2.5 btn-outline text-[var(--color-primary)] border border-[rgba(255,255,255,0.1)] rounded-xl text-sm font-bold hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2.5 btn-primary bg-[var(--color-cta)] text-[#1A1311] rounded-xl text-sm font-bold hover:bg-[#B8972E] transition-colors"
            onClick={handleSave}
          >
            {editItem ? "Save Changes" : "Add Menu Item"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
