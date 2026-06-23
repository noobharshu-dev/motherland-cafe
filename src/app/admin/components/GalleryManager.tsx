"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";

interface GI { id:string; imageUrl:string; title:string; category:string; isPublished:boolean; displayOrder:number; }
const BLANK_GAL = { imageUrl:"", title:"", category:"ambience", displayOrder:0, isPublished:true };

interface GalleryManagerProps {
  images: GI[];
  onCreate: (image: any) => void;
  onDelete: (id: string) => void;
}

export default function GalleryManager({ images, onCreate, onDelete }: GalleryManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [galF, setGalF] = useState(BLANK_GAL);

  const handleSave = () => {
    onCreate(galF);
    setShowModal(false);
    setGalF(BLANK_GAL);
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-8">
        <button
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-cta)] text-[#1A1311] rounded-full text-sm font-bold whitespace-nowrap hover:bg-[#B8972E] transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} /> Add Photo
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map(img => (
          <div key={img.id} className="bg-[rgba(255,255,255,0.02)] backdrop-blur-md rounded-2xl border border-[rgba(255,255,255,0.05)] overflow-hidden group hover:border-[rgba(255,255,255,0.1)] transition-colors">
            <div className="relative aspect-square bg-[rgba(0,0,0,0.2)]">
              <Image src={img.imageUrl} alt={img.title} fill className="object-cover" sizes="300px" />
              
              {!img.isPublished && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-[var(--color-primary)] text-xs font-bold tracking-widest px-3 py-1 bg-black/50 rounded-full border border-white/10">HIDDEN</span>
                </div>
              )}
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <button
                  className="absolute top-3 right-3 p-2 bg-red-500/80 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors shadow-lg transform translate-y-2 group-hover:translate-y-0 duration-200"
                  onClick={() => { if(confirm(`Delete "${img.title}"?`)) onDelete(img.id); }}
                  title="Delete Image"
                >
                  <Trash2 size={14} />
                </button>
                <p className="font-medium text-sm text-[var(--color-primary)] truncate transform translate-y-2 group-hover:translate-y-0 duration-200 delay-75">{img.title || "Untitled"}</p>
                <p className="text-xs text-[var(--color-secondary)] capitalize transform translate-y-2 group-hover:translate-y-0 duration-200 delay-100">{img.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!images.length && (
        <div className="text-center py-20 text-[var(--color-muted)] bg-[rgba(255,255,255,0.01)] rounded-2xl border border-[rgba(255,255,255,0.05)] border-dashed mt-4">
          No gallery images found. Click "Add Photo" to upload.
        </div>
      )}

      {/* Upload Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Gallery Photo">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">Image URL *</label>
            <input
              className="w-full p-3 bg-[rgba(0,0,0,0.2)] text-[var(--color-primary)] border border-[rgba(255,255,255,0.1)] rounded-xl text-sm focus:ring-1 focus:ring-[var(--color-cta)] outline-none transition-shadow"
              value={galF.imageUrl}
              onChange={e => setGalF(f => ({ ...f, imageUrl: e.target.value }))}
              placeholder="https://images.unsplash.com/..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">Title</label>
            <input
              className="w-full p-3 bg-[rgba(0,0,0,0.2)] text-[var(--color-primary)] border border-[rgba(255,255,255,0.1)] rounded-xl text-sm focus:ring-1 focus:ring-[var(--color-cta)] outline-none transition-shadow"
              value={galF.title}
              onChange={e => setGalF(f => ({ ...f, title: e.target.value }))}
              placeholder="Cozy seating"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">Category</label>
            <select
              className="w-full p-3 bg-[rgba(0,0,0,0.2)] text-[var(--color-primary)] border border-[rgba(255,255,255,0.1)] rounded-xl text-sm focus:ring-1 focus:ring-[var(--color-cta)] outline-none transition-shadow"
              value={galF.category}
              onChange={e => setGalF(f => ({ ...f, category: e.target.value }))}
            >
              <option value="ambience">Ambience</option>
              <option value="food">Food</option>
              <option value="drinks">Drinks</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">Display Order</label>
            <input
              type="number"
              className="w-full p-3 bg-[rgba(0,0,0,0.2)] text-[var(--color-primary)] border border-[rgba(255,255,255,0.1)] rounded-xl text-sm focus:ring-1 focus:ring-[var(--color-cta)] outline-none transition-shadow"
              value={galF.displayOrder}
              onChange={e => setGalF(f => ({ ...f, displayOrder: Number(e.target.value) }))}
            />
          </div>
          <div className="flex items-center pt-8">
            <label className="flex items-center gap-3 px-4 py-2 bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.05)] rounded-full cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors">
              <input
                type="checkbox"
                className="w-4 h-4 text-[var(--color-cta)] rounded bg-transparent border-[rgba(255,255,255,0.2)] focus:ring-[var(--color-cta)] focus:ring-offset-0 accent-[var(--color-cta)]"
                checked={galF.isPublished}
                onChange={e => setGalF(f => ({ ...f, isPublished: e.target.checked }))}
              />
              <span className="text-sm font-medium text-[var(--color-secondary)]">Published Live</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-[rgba(255,255,255,0.05)]">
          <button
            className="px-6 py-2.5 bg-transparent text-[var(--color-primary)] border border-[rgba(255,255,255,0.1)] rounded-xl text-sm font-bold hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2.5 bg-[var(--color-cta)] text-[#1A1311] rounded-xl text-sm font-bold hover:bg-[#B8972E] transition-colors"
            onClick={handleSave}
          >
            Upload Photo
          </button>
        </div>
      </Modal>
    </div>
  );
}
