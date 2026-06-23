"use client";

import { useActionState } from "react";
import { createReservation, type ReservationState } from "@/app/actions/reservation";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const initialState: ReservationState = { success: false, message: "", errors: {} };

const TIME_SLOTS = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM",
  "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM",
  "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM",
  "8:30 PM", "9:00 PM",
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "var(--radius-sm)",
  border: "1.5px solid rgba(120,53,15,0.25)",
  background: "var(--color-surface)",
  fontFamily: "var(--font-body)",
  fontSize: "0.9rem",
  color: "var(--color-text)",
  outline: "none",
  transition: "border-color 200ms",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--color-secondary)",
  marginBottom: "0.4rem",
};

export default function ReservationForm() {
  const [state, formAction, isPending] = useActionState(createReservation, initialState);

  // Get today's date for min date
  const today = new Date().toISOString().split("T")[0];

  if (state.success) {
    return (
      <div
        style={{
          background: "var(--color-surface)",
          border: "1.5px solid rgba(5,150,105,0.3)",
          borderRadius: "var(--radius-xl)",
          padding: "3rem 2rem",
          textAlign: "center",
        }}
      >
        <CheckCircle size={48} color="#059669" style={{ margin: "0 auto 1.25rem" }} />
        <h2 className="heading" style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>
          You&apos;re All Set!
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--color-secondary)", lineHeight: 1.75, maxWidth: "360px", margin: "0 auto 2rem" }}>
          {state.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-outline"
          style={{ margin: "0 auto" }}
        >
          Make Another Reservation
        </button>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      style={{
        background: "var(--color-surface)",
        border: "1px solid rgba(217,119,6,0.15)",
        borderRadius: "var(--radius-xl)",
        padding: "2.5rem 2rem",
        boxShadow: "var(--shadow-warm)",
      }}
    >
      <h2 className="heading" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
        Book Your Table
      </h2>
      <p style={{ fontSize: "0.85rem", color: "var(--color-secondary)", opacity: 0.75, marginBottom: "2rem" }}>
        Fill in your details and we&apos;ll confirm your reservation.
      </p>

      {/* Error banner */}
      {state.message && !state.success && (
        <div
          style={{
            display: "flex",
            gap: "0.6rem",
            alignItems: "flex-start",
            padding: "0.875rem 1rem",
            borderRadius: "var(--radius-sm)",
            background: "rgba(220,38,38,0.08)",
            border: "1px solid rgba(220,38,38,0.2)",
            marginBottom: "1.5rem",
          }}
        >
          <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: "1px" }} />
          <p style={{ fontSize: "0.85rem", color: "#DC2626" }}>{state.message}</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Name */}
        <div>
          <label htmlFor="name" style={labelStyle}>Full Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Ananya Sharma"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(120,53,15,0.25)")}
          />
          {state.errors?.name && <p style={{ fontSize: "0.75rem", color: "#DC2626", marginTop: "0.3rem" }}>{state.errors.name[0]}</p>}
        </div>

        {/* Phone + Email */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label htmlFor="phone" style={labelStyle}>Phone *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="09876543210"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(120,53,15,0.25)")}
            />
            {state.errors?.phone && <p style={{ fontSize: "0.75rem", color: "#DC2626", marginTop: "0.3rem" }}>{state.errors.phone[0]}</p>}
          </div>
          <div>
            <label htmlFor="guests" style={labelStyle}>Guests *</label>
            <select
              id="guests"
              name="guests"
              required
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(120,53,15,0.25)")}
            >
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
              ))}
            </select>
            {state.errors?.guests && <p style={{ fontSize: "0.75rem", color: "#DC2626", marginTop: "0.3rem" }}>{state.errors.guests[0]}</p>}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" style={labelStyle}>Email Address *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(120,53,15,0.25)")}
          />
          {state.errors?.email && <p style={{ fontSize: "0.75rem", color: "#DC2626", marginTop: "0.3rem" }}>{state.errors.email[0]}</p>}
        </div>

        {/* Date + Time */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label htmlFor="reservationDate" style={labelStyle}>Date *</label>
            <input
              id="reservationDate"
              name="reservationDate"
              type="date"
              required
              min={today}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(120,53,15,0.25)")}
            />
            {state.errors?.reservationDate && <p style={{ fontSize: "0.75rem", color: "#DC2626", marginTop: "0.3rem" }}>{state.errors.reservationDate[0]}</p>}
          </div>
          <div>
            <label htmlFor="reservationTime" style={labelStyle}>Time *</label>
            <select
              id="reservationTime"
              name="reservationTime"
              required
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(120,53,15,0.25)")}
            >
              <option value="">Select a time</option>
              {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {state.errors?.reservationTime && <p style={{ fontSize: "0.75rem", color: "#DC2626", marginTop: "0.3rem" }}>{state.errors.reservationTime[0]}</p>}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" style={labelStyle}>Special Requests</label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Any dietary requirements, occasion, or seating preferences..."
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(120,53,15,0.25)")}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary"
          style={{
            justifyContent: "center",
            opacity: isPending ? 0.7 : 1,
            cursor: isPending ? "not-allowed" : "pointer",
          }}
        >
          {isPending ? (
            <>
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              Reserving...
            </>
          ) : (
            "Confirm Reservation"
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </form>
  );
}
