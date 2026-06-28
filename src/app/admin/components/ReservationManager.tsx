"use client";

interface Res { id:string; name:string; phone:string; email:string; guests:number; reservationDate:string; reservationTime:string; notes:string|null; status:string; createdAt:string; }

interface ReservationManagerProps {
  reservations: Res[];
  onUpdateStatus: (id: string, status: string) => void;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; optBg: string }> = {
  confirmed: { bg: "rgba(34,197,94,0.1)", text: "#4ade80", border: "rgba(34,197,94,0.2)", optBg: "#0f1f14" },
  cancelled:  { bg: "rgba(220,38,38,0.1)",  text: "#f87171", border: "rgba(220,38,38,0.2)",  optBg: "#1f0e0e" },
  pending:    { bg: "rgba(212,175,55,0.1)", text: "#D4AF37", border: "rgba(212,175,55,0.2)", optBg: "#1a1511" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.text }} />
      {status}
    </span>
  );
};

export default function ReservationManager({ reservations, onUpdateStatus }: ReservationManagerProps) {
  return (
    <div className="w-full space-y-4">
      {!reservations.length ? (
        <div
          className="text-center py-20 rounded-2xl"
          style={{ color: "#A89F91", background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(255,255,255,0.07)" }}
        >
          No reservations found.
        </div>
      ) : (
        reservations.map(r => (
          <div
            key={r.id}
            className="rounded-2xl p-5 shadow-lg transition-all"
            style={{ background: "#211A15", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              {/* Guest Info */}
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-base" style={{ color: "#FBF9F6" }}>{r.name}</p>
                  <StatusBadge status={r.status} />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm" style={{ color: "#A89F91" }}>
                  <span>{r.email}</span>
                  <span className="hidden sm:inline" style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
                  <span>{r.phone}</span>
                </div>
                <div className="flex items-center gap-4 text-sm flex-wrap" style={{ color: "#A89F91" }}>
                  <span>
                    <span className="font-semibold" style={{ color: "#FBF9F6" }}>{r.reservationDate}</span>
                    {" "}at{" "}
                    <span className="font-semibold" style={{ color: "#D4AF37" }}>{r.reservationTime}</span>
                  </span>
                  <span>
                    <span className="font-semibold" style={{ color: "#FBF9F6" }}>{r.guests}</span>{" "}
                    {r.guests === 1 ? "guest" : "guests"}
                  </span>
                </div>
                {r.notes && (
                  <div
                    className="text-xs leading-relaxed max-w-md p-3 rounded-lg mt-1"
                    style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.04)", color: "#A89F91" }}
                  >
                    <span className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#6b7280" }}>Note</span>
                    {r.notes}
                  </div>
                )}
              </div>

              {/* Status Control */}
              <div className="flex gap-2 shrink-0 flex-wrap sm:flex-col">
                {(["pending", "confirmed", "cancelled"] as const).map(s => {
                  const active = r.status === s;
                  const sStyle = STATUS_STYLES[s] ?? STATUS_STYLES.pending;
                  return (
                    <button
                      key={s}
                      onClick={() => onUpdateStatus(r.id, s)}
                      disabled={active}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:cursor-default"
                      style={
                        active
                          ? { background: sStyle.bg, color: sStyle.text, border: `1px solid ${sStyle.border}` }
                          : { background: "transparent", color: "#A89F91", border: "1px solid rgba(255,255,255,0.1)" }
                      }
                      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = sStyle.border; e.currentTarget.style.color = sStyle.text; } }}
                      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#A89F91"; } }}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
