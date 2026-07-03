'use client';
import { useState, useEffect, useRef } from 'react';

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
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (e) {}
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    if (res.ok) setImages(prev => prev.filter((i: any) => i.id !== id));
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
        <button 
          aria-label="Add new photo"
          onClick={() => setShowUploadModal(true)}
          style={{
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
                    aria-label="Delete photo"
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

      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} onSaved={fetchData} />
      )}
    </div>
  );
}

function UploadModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [formData, setFormData] = useState({ title: '', category: 'general', imageUrl: '' });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const sigRes = await fetch('/api/upload/signature', { method: 'POST' });
      if (!sigRes.ok) throw new Error(`Signature request failed: ${sigRes.status}`);
      const { signature, timestamp, folder, cloudName, apiKey } = await sigRes.json();

      if (!cloudName || !apiKey || !signature) {
        throw new Error('Missing Cloudinary credentials');
      }

      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('api_key', apiKey);
      formDataUpload.append('timestamp', String(timestamp));
      formDataUpload.append('signature', signature);
      formDataUpload.append('folder', folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formDataUpload,
      });
      const uploadData = await uploadRes.json();
      if (uploadData.secure_url) {
        // Functional updater prevents stale closure from wiping other fields
        setFormData(prev => ({ ...prev, imageUrl: uploadData.secure_url }));
      } else {
        throw new Error(uploadData.error?.message || JSON.stringify(uploadData));
      }
    } catch (err: any) {
      console.error('[gallery handleUpload]', err);
      alert(`Image upload failed: ${err?.message || err}`);
    }
    setUploading(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setSaving(false);
    if (res.ok) {
      onSaved();
      onClose();
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.8)' }}>
      <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', background: '#1e1e1e', border: '1px solid #2c2c2c', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #2c2c2c', flexShrink: 0 }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600, fontFamily: "'Playfair Display', serif", color: '#e5e2e1' }}>Upload Image</h2>
          <button aria-label="Close modal" onClick={onClose} type="button" style={{ background: 'none', border: 'none', color: '#d0c5af', cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>close</span>
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label htmlFor="image-file" style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: '#d0c5af', marginBottom: '8px' }}>Image File</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{ width: '100%', height: '180px', border: '2px dashed #4d4635', borderRadius: '8px', background: '#121212', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}
            >
              <input id="image-file" type="file" ref={fileInputRef} onChange={handleUpload} accept="image/*" style={{ display: 'none' }} />
              {uploading ? (
                <div style={{ color: '#d4af37' }}>Uploading...</div>
              ) : formData.imageUrl ? (
                <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '36px', color: '#d0c5af', marginBottom: '8px' }}>add_photo_alternate</span>
                  <p style={{ margin: 0, fontSize: '14px', color: '#d0c5af' }}>Click to upload image</p>
                  <p style={{ margin: '4px 0 0', fontSize: '10px', color: 'rgba(208, 197, 175, 0.7)' }}>JPG, PNG, WEBP</p>
                </>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="title" style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: '#d0c5af', marginBottom: '8px' }}>Title</label>
            <input 
              id="title" required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Evening Interior"
              style={{ width: '100%', background: '#121212', border: '1px solid #2c2c2c', borderRadius: '4px', padding: '12px', color: '#e5e2e1', fontSize: '16px', outline: 'none' }}
            />
          </div>
          <div>
            <label htmlFor="category" style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: '#d0c5af', marginBottom: '8px' }}>Category</label>
            <select 
              id="category" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
              style={{ width: '100%', background: '#121212', border: '1px solid #2c2c2c', borderRadius: '4px', padding: '12px', color: '#e5e2e1', fontSize: '16px', outline: 'none', cursor: 'pointer', appearance: 'none' }}
            >
              <option value="general">General</option>
              <option value="interior">Interior</option>
              <option value="food">Food</option>
              <option value="events">Events</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', padding: '16px 24px', background: '#1a1a1a', borderTop: '1px solid #2c2c2c' }}>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: '#d0c5af', textTransform: 'uppercase', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', cursor: 'pointer' }}>Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={saving || !formData.imageUrl} style={{ background: '#d4af37', color: '#000', border: 'none', borderRadius: '4px', padding: '12px 32px', textTransform: 'uppercase', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>upload</span>
            {saving ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>
    </div>
  );
}
