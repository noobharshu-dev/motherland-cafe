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

export default function GalleryManager({ images, onCreate, onDelete }: GalleryManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [galF, setGalF] = useState(BLANK_GAL);

  const handleSave = () => {
    onCreate(galF);
    setShowModal(false);
    setGalF(BLANK_GAL);
  };

  return (
    <div className="w-full space-y-6">

      {/* ── Action Bar ───────────────────────────────────────── */}
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium" style={{ color: "#A89F91" }}>
          {images.length} photo{images.length !== 1 ? "s" : ""} in gallery
        </p>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{ background: "#D4AF37", color: "#1A1311" }}
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} /> Add Photo
        </button>
      </div>

      {/* ── Photo Grid ───────────────────────────────────────── */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div
              key={img.id}
              className="rounded-2xl overflow-hidden group transition-all"
              style={{ background: "#211A15", border: "1px solid rgba(255,255,255,0.05)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)")}
            >
              <div className="relative aspect-square" style={{ background: "rgba(0,0,0,0.2)" }}>
                <Image src={img.imageUrl} alt={img.title} fill className="object-cover" sizes="300px" />

                {!img.isPublished && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
                    <span className="text-xs font-bold tracking-widest px-3 py-1 rounded-full" style={{ color: "#FBF9F6", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      HIDDEN
                    </span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }}>
                  <button
                    className="absolute top-2 right-2 p-2 rounded-full text-white transition-colors shadow-lg"
                    style={{ background: "rgba(220,38,38,0.8)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(220,38,38,1)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(220,38,38,0.8)")}
                    onClick={() => { if (confirm(`Delete "${img.title}"?`)) onDelete(img.id); }}
                    title="Delete Image"
                  >
                    <Trash2 size={13} />
                  </button>
                  <div className="p-3">
                    <p className="text-sm font-semibold truncate" style={{ color: "#FBF9F6" }}>{img.title || "Untitled"}</p>
                    <p className="text-xs capitalize" style={{ color: "#A89F91" }}>{img.category}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="text-center py-20 rounded-2xl"
          style={{ color: "#A89F91", background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(255,255,255,0.07)" }}
        >
          No gallery images found. Click &ldquo;Add Photo&rdquo; to upload.
        </div>
      )}

      {/* ── Upload Modal ──────────────────────────────────────── */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Gallery Photo">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#A89F91" }}>Image URL *</label>
            <input
              style={inputStyle}
              value={galF.imageUrl}
              onChange={e => setGalF(f => ({ ...f, imageUrl: e.target.value }))}
              placeholder="https://images.unsplash.com/..."
              onFocus={e => (e.target.style.borderColor = "#D4AF37")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#A89F91" }}>Title</label>
            <input
              style={inputStyle}
              value={galF.title}
              onChange={e => setGalF(f => ({ ...f, title: e.target.value }))}
              placeholder="Cozy seating"
              onFocus={e => (e.target.style.borderColor = "#D4AF37")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#A89F91" }}>Category</label>
            <select
              style={{ ...inputStyle, appearance: "none" as const }}
              value={galF.category}
              onChange={e => setGalF(f => ({ ...f, category: e.target.value }))}
              onFocus={e => (e.target.style.borderColor = "#D4AF37")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            >
              <option value="ambience" style={{ background: "#211A15" }}>Ambience</option>
              <option value="food" style={{ background: "#211A15" }}>Food</option>
              <option value="drinks" style={{ background: "#211A15" }}>Drinks</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#A89F91" }}>Display Order</label>
            <input
              type="number"
              style={inputStyle}
              value={galF.displayOrder}
              onChange={e => setGalF(f => ({ ...f, displayOrder: Number(e.target.value) }))}
              onFocus={e => (e.target.style.borderColor = "#D4AF37")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
          <div className="flex items-center pt-2">
            <label
              className="flex items-center gap-3 px-4 py-2.5 rounded-full cursor-pointer transition-colors text-sm font-medium select-none"
              style={{
                background: galF.isPublished ? "rgba(212,175,55,0.1)" : "rgba(0,0,0,0.2)",
                border: `1px solid ${galF.isPublished ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.07)"}`,
                color: galF.isPublished ? "#D4AF37" : "#A89F91",
              }}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={galF.isPublished}
                onChange={e => setGalF(f => ({ ...f, isPublished: e.target.checked }))}
              />
              <div
                className="w-10 h-5 rounded-full relative transition-colors"
                style={{ background: galF.isPublished ? "#D4AF37" : "rgba(255,255,255,0.15)" }}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                  style={{ transform: galF.isPublished ? "translateX(1.35rem)" : "translateX(0.125rem)" }}
                />
              </div>
              Published Live
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button
            className="px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#FBF9F6", background: "transparent" }}
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
            style={{ background: "#D4AF37", color: "#1A1311" }}
            onClick={handleSave}
          >
            Upload Photo
          </button>
        </div>
      </Modal>
    </div>
  );
}
