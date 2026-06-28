'use client';

import { useState, useEffect } from 'react';

export default function GalleryManagement() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        setImages(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setImages(prev => prev.filter(img => img.id !== id));
      }
    }
  };

  if (loading) return <div className="p-4 text-on-surface">Loading gallery...</div>;
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm mb-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg md:text-headline-lg text-on-surface font-semibold mb-1">Gallery</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Manage cafe photos and menus.</p>
        </div>
        <div className="flex flex-wrap items-center gap-sm w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-xs px-md py-xs bg-primary-container text-on-primary-container hover:bg-primary transition-colors rounded font-label-md text-label-md font-bold h-10">
            <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
            Upload Image
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
        {images.map(img => (
          <div key={img.id} className="bg-surface-container border border-outline-variant rounded-lg overflow-hidden group">
            <div className="h-48 overflow-hidden relative">
              <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => handleDelete(img.id)} className="w-10 h-10 bg-error-container/80 rounded-full flex items-center justify-center text-on-error-container hover:bg-error hover:text-on-error transition-colors">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="font-label-md text-on-surface">{img.title}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
