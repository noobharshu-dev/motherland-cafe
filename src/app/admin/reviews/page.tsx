'use client';
import { useState, useEffect } from 'react';

const C = {
  surface: '#131313', surfaceContainer: '#201f1f',
  surfaceContainerLow: '#1c1b1b', surfaceContainerHigh: '#2a2a2a',
  outline: '#4d4635', primary: '#f2ca50',
  primaryContainer: '#d4af37', onPrimaryContainer: '#554300',
  onSurface: '#e5e2e1', onSurfaceVariant: '#d0c5af',
  error: '#ffb4ab',
};

const label = { fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const };

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(data => { setReviews(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/reviews/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const filtered = filter === 'all' ? reviews : reviews.filter(r => r.status === filter);

  if (loading) return <div style={{ padding: '40px', color: C.onSurfaceVariant, fontFamily: "'Inter', sans-serif" }}>Loading reviews...</div>;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 600, fontFamily: "'Playfair Display', serif", color: C.onSurface, margin: '0 0 4px' }}>Reviews</h2>
          <p style={{ fontSize: '14px', color: C.onSurfaceVariant, margin: 0 }}>Moderate customer reviews before they appear publicly.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'pending', 'published', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px', borderRadius: '6px', border: `1px solid ${C.outline}`,
                background: filter === f ? C.surfaceContainerHigh : 'transparent',
                color: filter === f ? C.onSurface : C.onSurfaceVariant,
                cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                letterSpacing: '0.04em', textTransform: 'capitalize',
              }}
            >{f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
      </div>

      {/* Review Cards */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: C.surfaceContainer, border: `1px solid ${C.outline}`, borderRadius: '12px', color: C.onSurfaceVariant }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>rate_review</span>
          <p style={{ fontSize: '15px', margin: 0 }}>No reviews found{filter !== 'all' ? ` with status "${filter}"` : ''}.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(review => (
            <div key={review.id} style={{
              background: C.surfaceContainerLow, border: `1px solid ${C.outline}`,
              borderRadius: '10px', padding: '20px',
              display: 'flex', flexDirection: 'column', gap: '12px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, color: C.onSurface, fontSize: '15px' }}>{review.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined"
                          style={{
                            fontSize: '16px',
                            color: C.primary,
                            fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0",
                          }}
                        >star</span>
                      ))}
                    </div>
                    <span style={{ fontSize: '12px', color: C.onSurfaceVariant }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: C.onSurfaceVariant, margin: 0, lineHeight: '20px' }}>{review.reviewText}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {review.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleStatus(review.id, 'published')}
                        style={{
                          padding: '6px 14px', background: C.primaryContainer,
                          color: C.onPrimaryContainer, border: 'none',
                          borderRadius: '4px', cursor: 'pointer',
                          fontSize: '12px', fontWeight: 700, letterSpacing: '0.03em',
                        }}
                      >Approve</button>
                      <button
                        onClick={() => handleStatus(review.id, 'rejected')}
                        style={{
                          padding: '6px 14px', background: 'none',
                          color: C.error, border: `1px solid ${C.error}`,
                          borderRadius: '4px', cursor: 'pointer',
                          fontSize: '12px', fontWeight: 700, letterSpacing: '0.03em',
                        }}
                      >Reject</button>
                    </>
                  ) : (
                    <span style={{
                      ...label, fontSize: '10px',
                      padding: '4px 12px', borderRadius: '999px',
                      border: `1px solid ${review.status === 'published' ? C.primary : C.error}`,
                      color: review.status === 'published' ? C.primary : C.error,
                    }}>{review.status}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
