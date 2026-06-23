import Link from "next/link";
import { Calendar } from "lucide-react";

export default function ReservationCTA() {
  return (
    <section
      className="section"
      style={{
        background: "var(--color-surface)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: "-6rem",
          right: "-6rem",
          width: "24rem",
          height: "24rem",
          borderRadius: "50%",
          background: "rgba(212, 175, 55, 0.05)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-4rem",
          left: "-4rem",
          width: "16rem",
          height: "16rem",
          borderRadius: "50%",
          background: "rgba(212, 175, 55, 0.03)",
          pointerEvents: "none",
        }}
      />

      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-primary)",
              opacity: 0.7,
              marginBottom: "0.5rem",
            }}
          >
            Reserve Your Spot
          </p>
          <h2
            className="heading"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              color: "var(--color-primary)",
              maxWidth: "520px",
            }}
          >
            Find Your Quiet Corner at Motherland
          </h2>
        </div>

        <Link
          href="/reservations"
          className="btn-cta-large"
        >
          <Calendar size={18} />
          Book a Table
        </Link>
      </div>
    </section>
  );
}
