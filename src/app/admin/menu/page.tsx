'use client';
import { useState, useEffect, useRef } from 'react';

const C = {
  bg: '#131313', surface: '#131313', surfaceContainer: '#201f1f',
  surfaceContainerLow: '#1c1b1b', surfaceContainerHigh: '#2a2a2a',
  surfaceContainerLowest: '#0e0e0e', outline: '#4d4635',
  primary: '#f2ca50', onPrimary: '#3c2f00',
  primaryContainer: '#d4af37', onPrimaryContainer: '#554300',
  onSurface: '#e5e2e1', onSurfaceVariant: '#d0c5af',
  tertiary: '#e6cd82', error: '#ffb4ab', errorContainer: '#93000a',
};

const S = {
  label: { fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const },
  body: { fontSize: '14px', lineHeight: '20px' },
  bodyLg: { fontSize: '16px', lineHeight: '24px' },
  headingSm: { fontSize: '18px', fontWeight: 600, fontFamily: "'Playfair Display', serif" },
  headingLg: { fontSize: '28px', fontWeight: 600, fontFamily: "'Playfair Display', serif" },
  displayLg: { fontSize: '40px', fontWeight: 700, fontFamily: "'Playfair Display', serif", lineHeight: 1 },
};

export default function MenuManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, statsRes, catRes] = await Promise.all([
        fetch('/api/menu/items'),
        fetch('/api/admin/stats'),
        fetch('/api/menu/categories')
      ]);
      const itemsData = await itemsRes.json();
      const statsData = await statsRes.json();
      const catData = await catRes.json();
      setItems(Array.isArray(itemsData) ? itemsData : []);
      setStats(statsData);
      setCategories(Array.isArray(catData) ? catData : []);
    } catch (e) {}
    setLoading(false);
  };

  const handleToggleVisibility = async (id: string, current: boolean) => {
    const res = await fetch(`/api/menu/items/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVisible: !current }),
    });
    if (res.ok) setItems(prev => prev.map(i => i.id === id ? { ...i, isVisible: !current } : i));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    const res = await fetch(`/api/menu/items/${id}`, { method: 'DELETE' });
    if (res.ok) setItems(prev => prev.filter(i => i.id !== id));
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setShowItemModal(true);
  };

  if (loading) return <div style={{ padding: '40px', color: C.onSurfaceVariant }}>Loading menu...</div>;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '32px' }}>
        <div>
          <h2 style={{ ...S.headingLg, color: C.onSurface, margin: '0 0 4px' }}>Active Menu</h2>
          <p style={{ ...S.body, color: C.onSurfaceVariant, margin: 0 }}>Manage your culinary offerings and categories.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setShowCategoryModal(true)}
            style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0 20px', height: '40px',
            background: 'transparent', border: `1px solid ${C.onSurface}`,
            borderRadius: '4px', color: C.onSurface, cursor: 'pointer',
            ...S.label,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Add Category
          </button>
          <button 
            onClick={() => { setEditingItem(null); setShowItemModal(true); }}
            style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0 20px', height: '40px',
            background: C.primaryContainer, border: 'none',
            borderRadius: '4px', color: C.onPrimaryContainer, cursor: 'pointer',
            ...S.label,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span>
            Add New Item
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Menu Items', icon: 'restaurant', value: stats?.menuItems ?? 0, sub: 'Total Items', subColor: C.primary },
          { label: 'Gallery Images', icon: 'image', value: stats?.galleryImages ?? 0, sub: 'Up to date', subColor: C.onSurfaceVariant },
          { label: 'Total Reviews', icon: 'star', value: stats?.totalReviews ?? 0, sub: `${stats?.avgRating ?? 0} Avg Rating`, subColor: C.primary },
          { label: 'Pending Res', icon: 'pending_actions', value: stats?.pendingReservations ?? 0, sub: 'Requires attention', subColor: C.tertiary, highlight: (stats?.pendingReservations ?? 0) > 0 },
        ].map(card => (
          <div key={card.label} style={{
            background: C.surfaceContainer, border: `1px solid ${C.outline}`,
            borderRadius: '8px', padding: '20px',
            display: 'flex', flexDirection: 'column', gap: '6px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ ...S.label, color: card.highlight ? C.tertiary : C.onSurfaceVariant }}>{card.label}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: card.highlight ? C.tertiary : C.onSurfaceVariant }}>{card.icon}</span>
            </div>
            <div style={{ ...S.displayLg, color: C.onSurface }}>{card.value}</div>
            <div style={{ ...S.body, color: card.subColor }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Menu Table */}
      <div style={{ background: C.surface, border: `1px solid ${C.outline}`, borderRadius: '8px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
        {/* Category header */}
        <div style={{ background: C.surfaceContainerLow, borderBottom: `1px solid ${C.outline}`, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ ...S.headingSm, color: C.onSurface, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            All Items
            <span style={{ background: C.surfaceContainerHigh, color: C.onSurfaceVariant, borderRadius: '999px', padding: '2px 10px', fontSize: '10px', fontWeight: 600 }}>{items.length} Items</span>
          </h3>
        </div>

        {/* Table header - desktop only */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '80px 1fr 140px 100px 120px',
          gap: '16px', padding: '10px 24px',
          borderBottom: `1px solid ${C.outline}`,
          background: C.surfaceContainerLowest,
        }} className="hidden md:grid">
          {['Image', 'Item Details', 'Tags & Status', 'Price', 'Actions'].map((h, i) => (
            <div key={h} style={{ ...S.label, color: C.onSurfaceVariant, textAlign: i === 4 ? 'right' : 'left' }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {items.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: C.onSurfaceVariant }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>restaurant_menu</span>
            No menu items yet. Add your first item!
          </div>
        ) : (
          <>
            {/* Desktop rows */}
            <div className="hidden md:block">
              {items.map(item => (
                <div
                  key={`d-${item.id}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr 140px 100px 120px',
                    gap: '16px', padding: '16px 24px',
                    borderBottom: `1px solid ${C.surfaceContainerHigh}`,
                    alignItems: 'center',
                    opacity: item.isVisible ? 1 : 0.55,
                  }}
                >
                  {/* Image */}
                  <div style={{ width: '72px', height: '72px', borderRadius: '6px', overflow: 'hidden', border: `1px solid ${C.outline}`, background: C.surfaceContainerHigh, flexShrink: 0 }}>
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}><span className="material-symbols-outlined" style={{ color: C.onSurfaceVariant, fontSize: '28px' }}>image_not_supported</span></div>
                    }
                  </div>

                  {/* Details */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h4 style={{ ...S.headingSm, color: C.onSurface, margin: 0, fontSize: '15px' }}>{item.name}</h4>
                      {!item.isVisible && <span style={{ ...S.label, background: C.surfaceContainer, color: C.onSurfaceVariant, padding: '2px 8px', borderRadius: '4px', fontSize: '9px' }}>Hidden</span>}
                    </div>
                    <p style={{ ...S.body, color: C.onSurfaceVariant, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>{item.description}</p>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {item.isVegan && <Tag>Vegan</Tag>}
                    {item.isVegetarian && <Tag>Veg</Tag>}
                    {item.isGlutenFree && <Tag>GF</Tag>}
                    {item.isFeatured && <GoldTag>⭐ Featured</GoldTag>}
                  </div>

                  {/* Price */}
                  <div style={{ ...S.bodyLg, color: C.onSurface, fontWeight: 600 }}>₹{item.price?.toFixed(2)}</div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <IconBtn title="Edit" onClick={() => openEditModal(item)}>
                      edit
                    </IconBtn>
                    <IconBtn title={item.isVisible ? 'Hide' : 'Show'} onClick={() => handleToggleVisibility(item.id, item.isVisible)}>
                      {item.isVisible ? 'visibility_off' : 'visibility'}
                    </IconBtn>
                    <IconBtn title="Delete" onClick={() => handleDelete(item.id)} danger>
                      delete
                    </IconBtn>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile rows */}
            <div className="md:hidden">
              {items.map(item => (
                <div key={`m-${item.id}`} style={{ padding: '16px', borderBottom: `1px solid ${C.surfaceContainerHigh}`, opacity: item.isVisible ? 1 : 0.55 }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '6px', overflow: 'hidden', border: `1px solid ${C.outline}`, flexShrink: 0, background: C.surfaceContainerHigh }}>
                      {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><span className="material-symbols-outlined" style={{ color: C.onSurfaceVariant, fontSize: '24px' }}>image_not_supported</span></div>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: C.onSurface, marginBottom: '4px', fontSize: '15px' }}>{item.name}</div>
                      <div style={{ color: C.onSurfaceVariant, fontSize: '12px', marginBottom: '8px' }}>{item.description}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: C.onSurface, fontWeight: 600 }}>₹{item.price?.toFixed(2)}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => openEditModal(item)} style={{ background: 'none', border: 'none', color: C.onSurfaceVariant, cursor: 'pointer', padding: '4px', lineHeight: 0 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                          </button>
                          <button onClick={() => handleToggleVisibility(item.id, item.isVisible)} style={{ background: 'none', border: 'none', color: C.onSurfaceVariant, cursor: 'pointer', padding: '4px', lineHeight: 0 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{item.isVisible ? 'visibility_off' : 'visibility'}</span>
                          </button>
                          <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: C.error, cursor: 'pointer', padding: '4px', lineHeight: 0 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        <div style={{ background: C.surfaceContainerLowest, padding: '12px', display: 'flex', justifyContent: 'center', borderTop: `1px solid ${C.outline}` }}>
          <span style={{ ...S.label, color: C.onSurfaceVariant }}>{items.length} item{items.length !== 1 ? 's' : ''} total</span>
        </div>
      </div>

      {showCategoryModal && (
        <CategoryModal onClose={() => setShowCategoryModal(false)} onSaved={fetchData} />
      )}
      {showItemModal && (
        <ItemModal 
          onClose={() => setShowItemModal(false)} 
          onSaved={fetchData} 
          categories={categories} 
          editingItem={editingItem} 
        />
      )}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 8px',
      background: '#2a2a2a', color: '#d0c5af',
      border: '1px solid #4d4635', borderRadius: '4px',
      fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em',
    }}>{children}</span>
  );
}

function GoldTag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 8px',
      background: 'rgba(201, 177, 106, 0.15)', color: '#e6cd82',
      border: '1px solid rgba(230, 205, 130, 0.3)', borderRadius: '4px',
      fontSize: '10px', fontWeight: 600,
    }}>{children}</span>
  );
}

function IconBtn({ children, onClick, title, danger }: { children: string; onClick: () => void; title?: string; danger?: boolean }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: '32px', height: '32px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'none', border: 'none', cursor: 'pointer',
        color: danger ? '#ffb4ab' : '#d0c5af',
        transition: 'all 150ms',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{children}</span>
    </button>
  );
}

function CategoryModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/menu/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, displayOrder: 0 })
    });
    setLoading(false);
    if (res.ok) {
      onSaved();
      onClose();
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#1e1e1e', border: '1px solid #2c2c2c', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '24px', borderBottom: '1px solid #2c2c2c' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600, fontFamily: "'Playfair Display', serif", color: '#e5e2e1' }}>Add Category</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#d0c5af', cursor: 'pointer' }}><span className="material-symbols-outlined">close</span></button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: '#d0c5af', marginBottom: '8px' }}>Category Name</label>
            <input 
              required type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g., Brunch Plates"
              style={{ width: '100%', background: '#121212', border: '1px solid #2c2c2c', borderRadius: '4px', padding: '12px', color: '#e5e2e1', fontSize: '16px', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', background: '#1a1a1a', margin: '-24px', marginTop: 0, padding: '16px 24px', borderTop: '1px solid #2c2c2c' }}>
            <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: '#d0c5af', textTransform: 'uppercase', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ background: '#d4af37', color: '#000', border: 'none', borderRadius: '4px', padding: '8px 24px', textTransform: 'uppercase', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
              {loading ? 'Saving...' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ItemModal({ onClose, onSaved, categories, editingItem }: { onClose: () => void; onSaved: () => void; categories: any[]; editingItem?: any }) {
  const [formData, setFormData] = useState({
    name: editingItem?.name || '',
    price: editingItem?.price || '',
    categoryId: editingItem?.categoryId || '',
    description: editingItem?.description || '',
    imageUrl: editingItem?.imageUrl || '',
    isVegetarian: editingItem?.isVegetarian || false,
    isVegan: editingItem?.isVegan || false,
    isGlutenFree: editingItem?.isGlutenFree || false,
    isFeatured: editingItem?.isFeatured || false,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const sigRes = await fetch('/api/upload/signature', { method: 'POST' });
      const { signature, timestamp, folder, cloudName, apiKey } = await sigRes.json();
      
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('api_key', apiKey);
      formDataUpload.append('timestamp', timestamp);
      formDataUpload.append('signature', signature);
      formDataUpload.append('folder', folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formDataUpload,
      });
      const uploadData = await uploadRes.json();
      if (uploadData.secure_url) {
        setFormData({ ...formData, imageUrl: uploadData.secure_url });
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
    setUploading(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    const url = editingItem ? `/api/menu/items/${editingItem.id}` : '/api/menu/items';
    const method = editingItem ? 'PUT' : 'POST';
    
    const payload = {
      ...formData,
      price: parseFloat(formData.price as any)
    };
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    setSaving(false);
    if (res.ok) {
      onSaved();
      onClose();
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.8)' }}>
      <div style={{ width: '100%', maxWidth: '672px', maxHeight: '95vh', display: 'flex', flexDirection: 'column', background: '#1e1e1e', border: '1px solid #2c2c2c', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #2c2c2c', flexShrink: 0 }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600, fontFamily: "'Playfair Display', serif", color: '#e5e2e1' }}>
            {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
          </h2>
          <button onClick={onClose} type="button" style={{ background: 'none', border: 'none', color: '#d0c5af', cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>close</span>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          
          {/* Image Upload */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: '#d0c5af', marginBottom: '8px' }}>Item Image</label>
            <div style={{ position: 'relative', width: '100%', paddingTop: '75%' /* 4:3 ratio */ }}>
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{ position: 'absolute', inset: 0, border: '2px dashed #4d4635', borderRadius: '8px', background: '#121212', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}
              >
                <input type="file" ref={fileInputRef} onChange={handleUpload} accept="image/*" style={{ display: 'none' }} />
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
          </div>

          {/* Name & Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: '#d0c5af', marginBottom: '8px' }}>Item Name</label>
              <input 
                required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Artisan Pour Over"
                style={{ width: '100%', background: '#121212', border: '1px solid #2c2c2c', borderRadius: '4px', padding: '12px', color: '#e5e2e1', fontSize: '16px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: '#d0c5af', marginBottom: '8px' }}>Price (₹)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#d0c5af' }}>₹</span>
                <input 
                  required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00"
                  style={{ width: '100%', background: '#121212', border: '1px solid #2c2c2c', borderRadius: '4px', padding: '12px 12px 12px 28px', color: '#e5e2e1', fontSize: '16px', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Category & Tags */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: '#d0c5af', marginBottom: '8px' }}>Category</label>
              <select 
                required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}
                style={{ width: '100%', background: '#121212', border: '1px solid #2c2c2c', borderRadius: '4px', padding: '12px', color: '#e5e2e1', fontSize: '16px', outline: 'none', cursor: 'pointer' }}
              >
                <option value="" disabled>Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: '#d0c5af', marginBottom: '8px' }}>Dietary Tags</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <TagCheckbox label="Vegan" checked={formData.isVegan} onChange={v => setFormData({...formData, isVegan: v})} />
                <TagCheckbox label="Vegetarian" checked={formData.isVegetarian} onChange={v => setFormData({...formData, isVegetarian: v})} />
                <TagCheckbox label="Gluten-Free" checked={formData.isGlutenFree} onChange={v => setFormData({...formData, isGlutenFree: v})} />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: '#d0c5af', marginBottom: '8px' }}>Description</label>
            <textarea 
              required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the flavor profile..."
              style={{ width: '100%', background: '#121212', border: '1px solid #2c2c2c', borderRadius: '4px', padding: '12px', color: '#e5e2e1', fontSize: '16px', outline: 'none', resize: 'none' }}
            />
          </div>

          {/* Featured Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#121212', border: '1px solid #2c2c2c', borderRadius: '8px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '16px', color: '#e5e2e1' }}>Feature on Homepage</span>
              <span style={{ display: 'block', fontSize: '14px', color: '#d0c5af' }}>Highlight this item in the "Seasonal Signatures" section.</span>
            </div>
            <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} style={{ opacity: 0, position: 'absolute' }} />
              <div style={{ width: '44px', height: '24px', background: formData.isFeatured ? '#d4af37' : '#353534', borderRadius: '999px', transition: 'all 0.2s', position: 'relative' }}>
                <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: formData.isFeatured ? '22px' : '2px', transition: 'all 0.2s' }}></div>
              </div>
            </label>
          </div>

        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', padding: '16px 24px', background: '#1a1a1a', borderTop: '1px solid #2c2c2c', flexShrink: 0 }}>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: '#d0c5af', textTransform: 'uppercase', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', cursor: 'pointer' }}>Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={saving} style={{ background: '#d4af37', color: '#000', border: 'none', borderRadius: '4px', padding: '12px 32px', textTransform: 'uppercase', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{editingItem ? 'save' : 'add'}</span>
            {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  );
}

function TagCheckbox({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', background: '#121212', border: `1px solid ${checked ? '#f2ca50' : '#2c2c2c'}`, borderRadius: '999px', padding: '6px 12px', cursor: 'pointer', transition: 'all 0.2s' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ display: 'none' }} />
      <span style={{ fontSize: '14px', color: checked ? '#f2ca50' : '#d0c5af' }}>{label}</span>
    </label>
  );
}
