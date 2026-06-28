'use client';
import { useState, useEffect } from 'react';

const C = {
  bg: '#131313',
  surface: '#131313',
  surfaceContainer: '#201f1f',
  surfaceContainerLow: '#1c1b1b',
  surfaceContainerHigh: '#2a2a2a',
  surfaceContainerLowest: '#0e0e0e',
  outline: '#4d4635',
  primary: '#f2ca50',
  onPrimary: '#3c2f00',
  primaryContainer: '#d4af37',
  onPrimaryContainer: '#554300',
  onSurface: '#e5e2e1',
  onSurfaceVariant: '#d0c5af',
  tertiary: '#e6cd82',
  error: '#ffb4ab',
  errorContainer: '#93000a',
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
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/menu/items').then(r => r.json()),
      fetch('/api/admin/stats').then(r => r.json()),
    ]).then(([itemsData, statsData]) => {
      setItems(Array.isArray(itemsData) ? itemsData : []);
      setStats(statsData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

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
          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0 20px', height: '40px',
            background: 'transparent', border: `1px solid ${C.onSurface}`,
            borderRadius: '4px', color: C.onSurface, cursor: 'pointer',
            ...S.label,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Add Category
          </button>
          <button style={{
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
                  <div style={{ ...S.bodyLg, color: C.onSurface, fontWeight: 600 }}>${item.price?.toFixed(2)}</div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
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
                        <span style={{ color: C.onSurface, fontWeight: 600 }}>${item.price?.toFixed(2)}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
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
