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

export default function ReviewManager({ reviews, onCreate, onTogglePublish, onDelete }: ReviewManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [revF, setRevF] = useState(BLANK_REV);

  const handleSave = () => {
    onCreate(revF);
    setShowModal(false);
    setRevF(BLANK_REV);
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-8">
        <button
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-cta)] text-[#1A1311] rounded-full text-sm font-bold whitespace-nowrap hover:bg-[#B8972E] transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} /> Add Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.map(r => (
          <div key={r.id} className="bg-[rgba(255,255,255,0.02)] backdrop-blur-md p-5 rounded-2xl border border-[rgba(255,255,255,0.05)] flex flex-col justify-between hover:border-[rgba(255,255,255,0.1)] transition-colors">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-[var(--color-primary)] text-lg leading-tight">{r.name}</h4>
                  <span className="text-xs font-medium text-[var(--color-muted)] px-2 py-0.5 bg-[rgba(255,255,255,0.05)] rounded-full mt-1 inline-block">via {r.source}</span>
                </div>
                <div className="flex gap-0.5 text-[var(--color-cta)] text-sm drop-shadow-[0_0_5px_rgba(212,175,55,0.3)]">
                  {"★".repeat(r.rating)}
                </div>
              </div>
              <p className="text-sm text-[var(--color-secondary)] leading-relaxed mb-6 italic border-l-2 border-[rgba(212,175,55,0.3)] pl-3">"{r.reviewText}"</p>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-[rgba(255,255,255,0.05)]">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${r.isPublished ? 'bg-[var(--color-cta)]' : 'bg-[rgba(255,255,255,0.1)]'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${r.isPublished ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <span className={`text-xs font-bold transition-colors ${r.isPublished ? "text-[var(--color-cta)]" : "text-[var(--color-muted)]"}`}>
                  {r.isPublished ? "Live" : "Hidden"}
                </span>
                <input type="checkbox" className="hidden" checked={r.isPublished} onChange={e => onTogglePublish(r.id, e.target.checked)} />
              </label>
              
              <button
                className="p-2 text-[rgba(220,38,38,0.7)] hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                onClick={() => { if(confirm("Delete review?")) onDelete(r.id); }}
                title="Delete Review"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {!reviews.length && (
        <div className="text-center py-20 text-[var(--color-muted)] bg-[rgba(255,255,255,0.01)] rounded-2xl border border-[rgba(255,255,255,0.05)] border-dashed mt-4">
          No reviews found. Click "Add Review" to add one.
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Review">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">Name</label>
            <input
              className="w-full p-3 bg-[rgba(0,0,0,0.2)] text-[var(--color-primary)] border border-[rgba(255,255,255,0.1)] rounded-xl text-sm focus:ring-1 focus:ring-[var(--color-cta)] outline-none transition-shadow"
              value={revF.name}
              onChange={e => setRevF(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">Rating (1-5)</label>
            <input
              type="number" min={1} max={5}
              className="w-full p-3 bg-[rgba(0,0,0,0.2)] text-[var(--color-primary)] border border-[rgba(255,255,255,0.1)] rounded-xl text-sm focus:ring-1 focus:ring-[var(--color-cta)] outline-none transition-shadow"
              value={revF.rating}
              onChange={e => setRevF(f => ({ ...f, rating: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">Source</label>
            <select
              className="w-full p-3 bg-[rgba(0,0,0,0.2)] text-[var(--color-primary)] border border-[rgba(255,255,255,0.1)] rounded-xl text-sm focus:ring-1 focus:ring-[var(--color-cta)] outline-none transition-shadow"
              value={revF.source}
              onChange={e => setRevF(f => ({ ...f, source: e.target.value }))}
            >
              <option>Google</option>
              <option>Zomato</option>
              <option>Instagram</option>
              <option>Direct</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">Review Text</label>
            <textarea
              rows={4}
              className="w-full p-3 bg-[rgba(0,0,0,0.2)] text-[var(--color-primary)] border border-[rgba(255,255,255,0.1)] rounded-xl text-sm focus:ring-1 focus:ring-[var(--color-cta)] outline-none transition-shadow resize-y"
              value={revF.reviewText}
              onChange={e => setRevF(f => ({ ...f, reviewText: e.target.value }))}
            />
          </div>
          <div className="md:col-span-3 flex items-center pt-4">
            <label className="flex items-center gap-3 px-4 py-2 bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.05)] rounded-full cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors">
              <input
                type="checkbox"
                className="w-4 h-4 text-[var(--color-cta)] rounded bg-transparent border-[rgba(255,255,255,0.2)] focus:ring-[var(--color-cta)] focus:ring-offset-0 accent-[var(--color-cta)]"
                checked={revF.isPublished}
                onChange={e => setRevF(f => ({ ...f, isPublished: e.target.checked }))}
              />
              <span className="text-sm font-medium text-[var(--color-secondary)]">Show on public site</span>
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
            Add Review
          </button>
        </div>
      </Modal>
    </div>
  );
}
