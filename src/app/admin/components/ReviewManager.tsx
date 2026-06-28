"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";

interface Rev { id:string; name:string; rating:number; reviewText:string; source:string; isPublished:boolean; createdAt:string; }
const BLANK_REV = { name:"", rating:5, reviewText:"", source:"Google", isPublished:true };

interface ReviewManagerProps {
  reviews: Rev[];
  onCreate: (review: any) => void;
  onTogglePublish: (id: string, published: boolean) => void;
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

export default function ReviewManager({ reviews, onCreate, onTogglePublish, onDelete }: ReviewManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [revF, setRevF] = useState(BLANK_REV);

  const handleSave = () => {
    onCreate(revF);
    setShowModal(false);
    setRevF(BLANK_REV);
  };

  return (
    <div className="w-full space-y-6">

      {/* ── Action Bar ───────────────────────────────────────── */}
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium" style={{ color: "#A89F91" }}>
          {reviews.filter(r => r.isPublished).length} of {reviews.length} review{reviews.length !== 1 ? "s" : ""} published
        </p>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{ background: "#D4AF37", color: "#1A1311" }}
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} /> Add Review
        </button>
      </div>

      {/* ── Review Cards ─────────────────────────────────────── */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map(r => (
            <div
              key={r.id}
              className="rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all"
              style={{ background: "#211A15", border: "1px solid rgba(255,255,255,0.05)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)")}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg leading-tight" style={{ color: "#FBF9F6" }}>{r.name}</h4>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block"
                      style={{ background: "rgba(255,255,255,0.06)", color: "#A89F91" }}
                    >
                      via {r.source}
                    </span>
                  </div>
                  <div className="text-base" style={{ color: "#D4AF37" }}>
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  </div>
                </div>
                <p
                  className="text-sm leading-relaxed mb-4 italic pl-3"
                  style={{ color: "#A89F91", borderLeft: "2px solid rgba(212,175,55,0.3)" }}
                >
                  &ldquo;{r.reviewText}&rdquo;
                </p>
              </div>

              <div className="flex justify-between items-center pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                {/* Toggle */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    className="w-10 h-5 rounded-full relative transition-colors duration-300"
                    style={{ background: r.isPublished ? "#D4AF37" : "rgba(255,255,255,0.15)" }}
                    onClick={() => onTogglePublish(r.id, !r.isPublished)}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300"
                      style={{ transform: r.isPublished ? "translateX(1.35rem)" : "translateX(0.125rem)" }}
                    />
                  </div>
                  <span className="text-xs font-bold" style={{ color: r.isPublished ? "#D4AF37" : "#A89F91" }}>
                    {r.isPublished ? "Live" : "Hidden"}
                  </span>
                </label>

                <button
                  className="p-2 rounded-full transition-colors"
                  style={{ color: "rgba(220,38,38,0.6)" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(220,38,38,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "rgba(220,38,38,0.6)"; e.currentTarget.style.background = "transparent"; }}
                  onClick={() => { if (confirm("Delete review?")) onDelete(r.id); }}
                  title="Delete Review"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="text-center py-20 rounded-2xl"
          style={{ color: "#A89F91", background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(255,255,255,0.07)" }}
        >
          No reviews found. Click &ldquo;Add Review&rdquo; to add one.
        </div>
      )}

      {/* ── Add Review Modal ─────────────────────────────────── */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Review">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#A89F91" }}>Name</label>
            <input
              style={inputStyle}
              value={revF.name}
              onChange={e => setRevF(f => ({ ...f, name: e.target.value }))}
              onFocus={e => (e.target.style.borderColor = "#D4AF37")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#A89F91" }}>Rating (1–5)</label>
            <input
              type="number" min={1} max={5}
              style={inputStyle}
              value={revF.rating}
              onChange={e => setRevF(f => ({ ...f, rating: Number(e.target.value) }))}
              onFocus={e => (e.target.style.borderColor = "#D4AF37")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#A89F91" }}>Source</label>
            <select
              style={{ ...inputStyle, appearance: "none" as const }}
              value={revF.source}
              onChange={e => setRevF(f => ({ ...f, source: e.target.value }))}
              onFocus={e => (e.target.style.borderColor = "#D4AF37")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            >
              <option style={{ background: "#211A15" }}>Google</option>
              <option style={{ background: "#211A15" }}>Zomato</option>
              <option style={{ background: "#211A15" }}>Instagram</option>
              <option style={{ background: "#211A15" }}>Direct</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#A89F91" }}>Review Text</label>
            <textarea
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
              value={revF.reviewText}
              onChange={e => setRevF(f => ({ ...f, reviewText: e.target.value }))}
              onFocus={e => (e.target.style.borderColor = "#D4AF37")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
          <div className="md:col-span-3 pt-2">
            <label
              className="flex items-center gap-3 px-4 py-2.5 rounded-full cursor-pointer transition-colors text-sm font-medium select-none w-fit"
              style={{
                background: revF.isPublished ? "rgba(212,175,55,0.1)" : "rgba(0,0,0,0.2)",
                border: `1px solid ${revF.isPublished ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.07)"}`,
                color: revF.isPublished ? "#D4AF37" : "#A89F91",
              }}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={revF.isPublished}
                onChange={e => setRevF(f => ({ ...f, isPublished: e.target.checked }))}
              />
              <div
                className="w-10 h-5 rounded-full relative transition-colors"
                style={{ background: revF.isPublished ? "#D4AF37" : "rgba(255,255,255,0.15)" }}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                  style={{ transform: revF.isPublished ? "translateX(1.35rem)" : "translateX(0.125rem)" }}
                />
              </div>
              Show on public site
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
            Add Review
          </button>
        </div>
      </Modal>
    </div>
  );
}
