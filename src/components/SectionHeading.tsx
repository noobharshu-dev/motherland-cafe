interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: SectionHeadingProps) {
  const textAlign = align === "center" ? "center" : "left";
  const alignItems = align === "center" ? "center" : "flex-start";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems, textAlign, gap: "0.75rem", marginBottom: "3rem" }}>
      {eyebrow && (
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-secondary)",
          }}
        >
          {eyebrow}
        </span>
      )}
      <div className="divider" />
      <h2
        className="heading"
        style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", maxWidth: "700px" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.05rem",
            color: "var(--color-secondary)",
            lineHeight: 1.7,
            maxWidth: "560px",
            opacity: 0.85,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
