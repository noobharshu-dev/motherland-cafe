'use client';
import { useState, useEffect } from 'react';

export default function ReservationsManagement() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reservations')
      .then(res => res.json())
      .then(data => {
        setReservations(data);
        setLoading(false);
      });
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/reservations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    }
  };

  if (loading) return <div className="p-4 text-on-surface">Loading reservations...</div>;
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm mb-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg md:text-headline-lg text-on-surface font-semibold mb-1">Reservations</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Manage incoming table bookings.</p>
        </div>
      </div>

      <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden flex flex-col shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_100px] gap-4 px-md py-xs border-b border-outline-variant bg-surface-container-lowest font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
          <div>Customer</div>
          <div>Date</div>
          <div>Time</div>
          <div>Guests</div>
          <div className="text-right">Actions</div>
        </div>

        <div className="flex flex-col">
          {reservations.map((res) => (
            <div key={res.id} className={`flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr_100px] gap-4 p-md border-b border-surface-container-high hover:bg-surface-container/50 transition-colors items-center`}>
              <div className="font-headline-sm text-base text-on-surface">{res.name}</div>
              <div className="text-on-surface-variant text-sm">{res.reservationDate}</div>
              <div className="text-on-surface-variant text-sm">{res.reservationTime}</div>
              <div className="text-on-surface-variant text-sm">{res.guests} people</div>
              
              <div className="flex justify-end gap-2">
                {res.status === 'pending' ? (
                  <button onClick={() => handleUpdateStatus(res.id, 'confirmed')} className="px-3 py-1 bg-primary-container text-on-primary-container rounded font-label-md text-xs hover:bg-primary transition-colors">Confirm</button>
                ) : (
                  <span className="px-3 py-1 border border-outline-variant rounded font-label-md text-xs text-primary capitalize">{res.status}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
