'use client';
import { useState, useEffect } from 'react';

const C = {
  surface: '#131313', surfaceContainer: '#201f1f', surfaceContainerLow: '#1c1b1b',
  surfaceContainerHigh: '#2a2a2a', surfaceContainerLowest: '#0e0e0e',
  outline: '#4d4635', primary: '#f2ca50', onPrimary: '#3c2f00',
  primaryContainer: '#d4af37', onPrimaryContainer: '#554300',
  onSurface: '#e5e2e1', onSurfaceVariant: '#d0c5af',
  tertiary: '#e6cd82', error: '#ffb4ab',
};

const label = { fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const };

export default function ReservationsManagement() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reservations')
      .then(r => r.json())
      .then(data => { setReservations(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/reservations/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const pending = reservations.filter(r => r.status === 'pending').length;
  const confirmed = reservations.filter(r => r.status === 'confirmed').length;

  if (loading) return <div style={{ padding: '40px', color: C.onSurfaceVariant, fontFamily: "'Inter', sans-serif" }}>Loading reservations...</div>;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 600, fontFamily: "'Playfair Display', serif", color: C.onSurface, margin: '0 0 4px' }}>Reservations</h2>
        <p style={{ fontSize: '14px', color: C.onSurfaceVariant, margin: 0 }}>Manage incoming table bookings.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total', value: reservations.length, color: C.onSurface },
          { label: 'Confirmed', value: confirmed, color: C.onSurface },
          { label: 'Pending', value: pending, color: C.tertiary },
          { label: 'Avg Party', value: reservations.length > 0 ? (reservations.reduce((a, r) => a + r.guests, 0) / reservations.length).toFixed(1) : '—', color: C.onSurface },
        ].map(s => (
          <div key={s.label} style={{ background: C.surfaceContainer, border: `1px solid ${C.outline}`, borderRadius: '8px', padding: '20px' }}>
            <div style={{ ...label, color: C.onSurfaceVariant, marginBottom: '10px' }}>{s.label}</div>
            <div style={{ fontSize: '40px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: s.color, lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: C.surface, border: `1px solid ${C.outline}`, borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.outline}`, background: C.surfaceContainerLow, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: "'Playfair Display', serif", color: C.onSurface, margin: 0 }}>Upcoming Reservations</h3>
          <span style={{ ...label, color: C.onSurfaceVariant }}>{reservations.length} total</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.outline}`, background: C.surfaceContainerLowest }}>
                {['Customer', 'Contact', 'Date & Time', 'Party', 'Status', 'Actions'].map((h, i) => (
                  <th key={h} style={{ ...label, color: C.onSurfaceVariant, padding: '12px 16px', textAlign: i >= 4 ? 'center' : 'left', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: C.onSurfaceVariant }}>No reservations yet.</td></tr>
              ) : reservations.map(res => (
                <tr key={res.id} style={{ borderBottom: `1px solid ${C.outline}20` }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: C.onSurface, fontSize: '14px' }}>{res.name}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: C.onSurfaceVariant, fontSize: '13px' }}>
                    {res.phone || res.email || '—'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ color: C.onSurface, fontSize: '14px' }}>{res.reservationDate}</div>
                    <div style={{ color: C.onSurfaceVariant, fontSize: '12px' }}>{res.reservationTime}</div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: C.surfaceContainerHigh, color: C.onSurface, fontSize: '13px', border: `1px solid ${C.outline}` }}>
                      {res.guests}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    {res.status === 'pending' ? (
                      <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: '999px', border: `1px solid ${C.primary}`, color: C.primary, background: `${C.primary}15`, ...label, fontSize: '10px' }}>Pending</span>
                    ) : res.status === 'confirmed' ? (
                      <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: '999px', background: C.onSurface, color: C.surface, ...label, fontSize: '10px' }}>Confirmed</span>
                    ) : (
                      <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: '999px', border: `1px solid ${C.error}`, color: C.error, ...label, fontSize: '10px', textTransform: 'capitalize' }}>{res.status}</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      {res.status === 'pending' && (
                        <button
                          onClick={() => handleStatus(res.id, 'confirmed')}
                          style={{ padding: '6px 14px', background: C.primaryContainer, color: C.onPrimaryContainer, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, letterSpacing: '0.03em' }}
                        >Confirm</button>
                      )}
                      {res.status !== 'cancelled' && (
                        <button
                          aria-label="Cancel reservation"
                          onClick={() => handleStatus(res.id, 'cancelled')}
                          style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: C.error, lineHeight: 0 }}
                          title="Cancel"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
