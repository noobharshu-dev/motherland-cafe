'use client';
import { useState, useEffect } from 'react';

const C = {
  surface: '#131313', surfaceContainer: '#201f1f',
  surfaceContainerHigh: '#2a2a2a', outline: '#4d4635',
  primary: '#f2ca50', onPrimary: '#3c2f00',
  primaryContainer: '#d4af37', onPrimaryContainer: '#554300',
  onSurface: '#e5e2e1', onSurfaceVariant: '#d0c5af',
  error: '#ffb4ab', errorContainer: 'rgba(147, 0, 10, 0.6)',
};

export default function GalleryManagement() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(data => { setImages(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    if (res.ok) setImages(prev => prev.filter(i => i.id !== id));
  };

  if (loading) return <div style={{ padding: '40px', color: C.onSurfaceVariant, fontFamily: "'Inter', sans-serif" }}>Loading gallery...</div>;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 600, fontFamily: "'Playfair Display', serif", color: C.onSurface, margin: '0 0 4px' }}>Gallery</h2>
          <p style={{ fontSize: '14px', color: C.onSurfaceVariant, margin: 0 }}>Manage cafe photos and media.</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '0 20px', height: '40px',
          background: C.primaryContainer, border: 'none',
          borderRadius: '6px', color: C.onPrimaryContainer,
          fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
          cursor: 'pointer',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_photo_alternate</span>
          Upload Image
        </button>
      </div>

      {images.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 40px', background: C.surfaceContainer, border: `1px solid ${C.outline}`, borderRadius: '12px', color: C.onSurfaceVariant }}>
          <span className="material-symbols-outlined" style={{ fontSize: '56px', display: 'block', marginBottom: '16px' }}>photo_library</span>
          <p style={{ fontSize: '16px', margin: 0 }}>No gallery images yet. Upload your first photo!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {images.map(img => (
            <div
              key={img.id}
              style={{ background: C.surfaceContainer, border: `1px solid ${C.outline}`, borderRadius: '10px', overflow: 'hidden', position: 'relative' }}
            >
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 400ms' }}
                />
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 200ms',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                >
                  <button
                    onClick={() => handleDelete(img.id)}
                    style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      background: C.errorContainer, border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: C.error,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>delete</span>
                  </button>
                </div>
              </div>
              <div style={{ padding: '10px 12px' }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: C.onSurface, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.title}</p>
                {img.category && <p style={{ margin: '2px 0 0', fontSize: '11px', color: C.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{img.category}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
