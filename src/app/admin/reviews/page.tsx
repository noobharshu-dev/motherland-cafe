'use client';

import { useState, useEffect } from 'react';

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setLoading(false);
      });
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    }
  };

  if (loading) return <div className="p-4 text-on-surface">Loading reviews...</div>;
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm mb-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg md:text-headline-lg text-on-surface font-semibold mb-1">Reviews</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Moderate customer reviews.</p>
        </div>
      </div>

      <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden flex flex-col shadow-[0_8px_24px_rgba(0,0,0,0.2)] p-md space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="p-4 border border-outline-variant rounded-lg bg-surface-container-low flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-label-md font-bold text-on-surface">{review.name}</span>
                <div className="flex items-center text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                  ))}
                </div>
                <span className="text-xs text-on-surface-variant">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="font-body-sm text-on-surface-variant">{review.reviewText}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {review.status === 'pending' ? (
                <>
                  <button onClick={() => handleUpdateStatus(review.id, 'published')} className="px-3 py-1 bg-primary-container text-on-primary-container rounded font-label-md text-xs hover:bg-primary transition-colors">Approve</button>
                  <button onClick={() => handleUpdateStatus(review.id, 'rejected')} className="px-3 py-1 bg-surface-container-highest text-on-surface rounded font-label-md text-xs hover:bg-surface-variant transition-colors">Reject</button>
                </>
              ) : (
                <span className="px-3 py-1 border border-outline-variant rounded font-label-md text-xs text-on-surface-variant capitalize">{review.status}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
