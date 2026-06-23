"use client";

interface Res { id:string; name:string; phone:string; email:string; guests:number; reservationDate:string; reservationTime:string; notes:string|null; status:string; createdAt:string; }

interface ReservationManagerProps {
  reservations: Res[];
  onUpdateStatus: (id: string, status: string) => void;
}

export default function ReservationManager({ reservations, onUpdateStatus }: ReservationManagerProps) {
  return (
    <div className="w-full">
      <div className="bg-[rgba(255,255,255,0.02)] backdrop-blur-md rounded-2xl border border-[rgba(255,255,255,0.05)] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[var(--color-muted)] uppercase tracking-wider bg-[rgba(0,0,0,0.2)] border-b border-[rgba(255,255,255,0.05)]">
              <tr>
                <th className="px-6 py-5 font-bold">Guest Details</th>
                <th className="px-6 py-5 font-bold">Date & Time</th>
                <th className="px-6 py-5 font-bold text-center">Party</th>
                <th className="px-6 py-5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.02)]">
              {reservations.map((r) => (
                <tr key={r.id} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="font-bold text-[var(--color-primary)] text-base mb-1">{r.name}</div>
                    <div className="flex flex-col gap-0.5 text-xs">
                      <span className="text-[var(--color-secondary)]">{r.phone}</span>
                      <span className="text-[var(--color-muted)]">{r.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="font-semibold text-[var(--color-primary)] mb-1">{r.reservationDate}</div>
                    <div className="text-[var(--color-secondary)] flex items-center gap-1.5 text-xs">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-cta)] shadow-[0_0_5px_rgba(212,175,55,0.5)]"></span>
                      {r.reservationTime}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] font-bold text-[var(--color-primary)]">
                      {r.guests}
                    </span>
                    <div className="text-[var(--color-muted)] text-[10px] mt-1 uppercase tracking-wider">Pax</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="relative inline-block w-full max-w-[150px]">
                      <select
                        value={r.status}
                        onChange={e => onUpdateStatus(r.id, e.target.value)}
                        className={`w-full text-xs font-bold px-4 py-2.5 rounded-xl border outline-none cursor-pointer appearance-none transition-colors ${
                          r.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' : 
                          r.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' : 
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20'
                        }`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.75rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1em 1em'
                        }}
                      >
                        <option value="pending" className="bg-[#1A1311] text-yellow-400">Pending</option>
                        <option value="confirmed" className="bg-[#1A1311] text-green-400">Confirmed</option>
                        <option value="cancelled" className="bg-[#1A1311] text-red-400">Cancelled</option>
                      </select>
                    </div>
                    {r.notes && (
                      <div className="mt-3 text-xs text-[var(--color-muted)] bg-[rgba(0,0,0,0.2)] p-3 rounded-lg border border-[rgba(255,255,255,0.02)] max-w-xs">
                        <span className="font-bold text-[var(--color-secondary)] uppercase tracking-wider text-[10px] block mb-1">Note</span>
                        <p className="line-clamp-2 leading-relaxed" title={r.notes}>{r.notes}</p>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!reservations.length && (
          <div className="text-center py-20 text-[var(--color-muted)] bg-[rgba(255,255,255,0.01)] border-t border-[rgba(255,255,255,0.05)] border-dashed">
            No reservations found.
          </div>
        )}
      </div>
    </div>
  );
}
