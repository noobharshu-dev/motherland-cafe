'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function MenuManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/menu/items').then(res => res.json()),
      fetch('/api/admin/stats').then(res => res.json())
    ]).then(([itemsData, statsData]) => {
      setItems(itemsData);
      setStats(statsData);
      setLoading(false);
    });
  }, []);

  const handleToggleVisibility = async (id: string, currentVisible: boolean) => {
    const res = await fetch(`/api/menu/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVisible: !currentVisible })
    });
    if (res.ok) {
      setItems(prev => prev.map(item => item.id === id ? { ...item, isVisible: !currentVisible } : item));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      const res = await fetch(`/api/menu/items/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(prev => prev.filter(item => item.id !== id));
      }
    }
  };

  if (loading) return <div className="p-4 text-on-surface">Loading menu...</div>;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm mb-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg md:text-headline-lg text-on-surface font-semibold mb-1">Active Menu</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Manage your culinary offerings and categories.</p>
        </div>
        <div className="flex flex-wrap items-center gap-sm w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-xs px-md py-xs border border-on-surface text-on-surface hover:bg-surface-container-high transition-colors rounded font-label-md text-label-md h-10">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add New Category
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-xs px-md py-xs bg-primary-container text-on-primary-container hover:bg-primary transition-colors rounded font-label-md text-label-md font-bold h-10">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Add New Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
        <StatCard label="Menu Items" icon="restaurant" value={stats?.menuItems || 0} subText="Total Items" subTextColor="text-primary" />
        <StatCard label="Gallery Images" icon="image" value={stats?.galleryImages || 0} subText="Up to date" subTextColor="text-on-surface-variant" />
        <StatCard label="Total Reviews" icon="star" value={stats?.totalReviews || 0} subText={`${stats?.avgRating || 0} Avg Rating`} subTextColor="text-primary" />
        <StatCard label="Pending Res" icon="pending_actions" value={stats?.pendingReservations || 0} subText="Requires attention" subTextColor="text-tertiary" highlight={stats?.pendingReservations > 0} />
      </div>

      <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden flex flex-col shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
        <div className="bg-surface-container-low border-b border-outline-variant px-md py-sm flex justify-between items-center sticky top-20 z-20">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-xs">
            Main Course
            <span className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded-full font-label-md text-[10px]">{items.length} Items</span>
          </h3>
          <button className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-md hover:bg-surface-container">
            <span className="material-symbols-outlined text-[20px]">more_horiz</span>
          </button>
        </div>

        <div className="hidden md:grid grid-cols-[80px_2fr_1fr_1fr_100px] gap-4 px-md py-xs border-b border-outline-variant bg-surface-container-lowest font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
          <div>Image</div>
          <div>Item Details</div>
          <div>Tags &amp; Status</div>
          <div>Price</div>
          <div className="text-right">Actions</div>
        </div>

        <div className="flex flex-col">
          {items.map((item) => (
            <div key={item.id} className={`group flex flex-col md:grid md:grid-cols-[80px_2fr_1fr_1fr_100px] gap-4 p-md border-b border-surface-container-high hover:bg-surface-container/50 transition-colors items-center relative ${!item.isVisible ? 'opacity-60' : ''}`}>
              <div className="absolute top-4 right-4 md:hidden">
                <button className="text-on-surface-variant p-1">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>

              <div className="w-20 h-20 rounded-md overflow-hidden border border-outline-variant bg-surface-container-high shrink-0 self-start md:self-center flex items-center justify-center">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <span className="material-symbols-outlined text-on-surface-variant text-[32px] grayscale">image_not_supported</span>
                )}
              </div>

              <div className="flex flex-col gap-1 w-full mt-2 md:mt-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-headline-sm text-headline-sm text-on-surface m-0 text-base">{item.name}</h4>
                  {!item.isVisible && <span className="px-2 py-0.5 bg-surface-variant text-on-surface-variant rounded-sm font-label-md text-[9px] uppercase tracking-wider">Out of Season</span>}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 pr-4 md:pr-0">{item.description}</p>
              </div>

              <div className="flex flex-wrap gap-2 w-full mt-2 md:mt-0">
                {item.isVegan && <span className="inline-flex items-center gap-1 px-2 py-1 border rounded font-label-md text-[10px] bg-surface-container-high text-on-surface-variant border-outline-variant">Vegan</span>}
                {item.isVegetarian && <span className="inline-flex items-center gap-1 px-2 py-1 border rounded font-label-md text-[10px] bg-surface-container-high text-on-surface-variant border-outline-variant">Veg</span>}
                {item.isGlutenFree && <span className="inline-flex items-center gap-1 px-2 py-1 border rounded font-label-md text-[10px] bg-surface-container-high text-on-surface-variant border-outline-variant">GF</span>}
                {item.isFeatured && <span className="inline-flex items-center gap-1 px-2 py-1 border rounded font-label-md text-[10px] bg-tertiary-container/20 text-tertiary border-tertiary/30"><span className="material-symbols-outlined text-[12px] fill-current">star</span>Featured</span>}
              </div>

              <div className="font-body-lg text-body-lg text-on-surface font-semibold w-full mt-2 md:mt-0 flex justify-between md:block">
                <span className="md:hidden text-on-surface-variant font-label-md text-label-md uppercase">Price</span>
                ${item.price.toFixed(2)}
              </div>

              <div className="hidden md:flex justify-end gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors" title="Edit">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button onClick={() => handleToggleVisibility(item.id, item.isVisible)} className={`w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant transition-colors ${item.isVisible ? 'hover:text-error hover:bg-error-container/20' : 'hover:text-primary hover:bg-surface-container-high'}`} title={item.isVisible ? 'Hide' : 'Restore Visibility'}>
                  <span className="material-symbols-outlined text-[18px]">{item.isVisible ? 'visibility_off' : 'visibility'}</span>
                </button>
                <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors" title="Delete">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface-container-lowest p-sm flex justify-center border-t border-outline-variant">
          <button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 py-1 px-4 rounded-full hover:bg-surface-container-high">
            Load More Items
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
        </div>
      </div>
    </>
  );
}

function StatCard({ label, icon, value, subText, subTextColor, highlight }: any) {
  return (
    <div className={`bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col gap-xs hover:bg-surface-container-high transition-colors relative overflow-hidden`}>
      {highlight && <div className="absolute right-0 top-0 w-16 h-16 bg-tertiary-container/10 rounded-bl-full"></div>}
      <div className="flex justify-between items-center text-on-surface-variant mb-2">
        <span className={`font-label-md text-label-md uppercase tracking-wider ${highlight ? 'text-tertiary' : ''}`}>{label}</span>
        <span className={`material-symbols-outlined text-[20px] ${highlight ? 'text-tertiary' : ''}`}>{icon}</span>
      </div>
      <div className="font-display-lg text-display-lg text-on-surface">{value}</div>
      <div className={`font-body-sm text-body-sm ${subTextColor}`}>{subText}</div>
    </div>
  );
}
