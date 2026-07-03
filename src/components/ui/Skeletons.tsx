/**
 * Skeleton loader components for Suspense boundaries.
 * Used on pages that fetch data from the database.
 */

/** Generic pulsing skeleton block */
function SkeletonBlock({ width = "100%", height = "1rem", borderRadius = "0.5rem" }: {
  width?: string;
  height?: string;
  borderRadius?: string;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: "rgba(251, 249, 246, 0.06)",
        animation: "skeleton-pulse 1.5s ease-in-out infinite",
      }}
    />
  );
}

/** Skeleton for a single review card */
export function ReviewsSkeleton() {
  return (
    <section className="section" style={{ background: "var(--color-surface)" }}>
      <div className="container">
        <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
            <SkeletonBlock width="60%" height="1rem" borderRadius="999px" />
            <SkeletonBlock width="40%" height="2.5rem" borderRadius="0.5rem" />
          </div>
          <div
            style={{
              height: "22rem",
              borderRadius: "var(--radius-xl)",
              background: "rgba(251, 249, 246, 0.03)",
              border: "1px solid rgba(251, 249, 246, 0.07)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              padding: "2.5rem",
            }}
          >
            <SkeletonBlock width="80%" height="1rem" borderRadius="999px" />
            <SkeletonBlock width="90%" height="1rem" borderRadius="999px" />
            <SkeletonBlock width="70%" height="1rem" borderRadius="999px" />
            <SkeletonBlock width="30%" height="1.5rem" borderRadius="0.5rem" />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </section>
  );
}

/** Skeleton for a single menu card */
function MenuCardSkeleton() {
  return (
    <div
      className="card"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <SkeletonBlock height="200px" borderRadius="0" />
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <SkeletonBlock width="40%" height="0.6rem" borderRadius="999px" />
        <SkeletonBlock width="70%" height="1rem" borderRadius="999px" />
        <SkeletonBlock width="90%" height="0.8rem" borderRadius="999px" />
        <SkeletonBlock width="60%" height="0.8rem" borderRadius="999px" />
      </div>
    </div>
  );
}

/** Skeleton for the menu preview section (4 cards) */
export function MenuPreviewSkeleton() {
  return (
    <section className="section" style={{ background: "var(--color-bg)" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <MenuCardSkeleton key={i} />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </section>
  );
}

/** Skeleton for the full menu page */
export function MenuPageSkeleton() {
  return (
    <div style={{ paddingTop: "8rem" }}>
      <div className="container">
        <div style={{ marginBottom: "3rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <SkeletonBlock width="20%" height="0.75rem" borderRadius="999px" />
          <SkeletonBlock width="50%" height="3rem" borderRadius="0.5rem" />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <MenuCardSkeleton key={i} />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

/** Skeleton for gallery page */
export function GalleryPageSkeleton() {
  return (
    <div style={{ paddingTop: "8rem" }}>
      <div className="container">
        <div style={{ marginBottom: "3rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <SkeletonBlock width="20%" height="0.75rem" borderRadius="999px" />
          <SkeletonBlock width="40%" height="3rem" borderRadius="0.5rem" />
        </div>
        <div style={{ columns: "3 280px", columnGap: "1.25rem" }}>
          {[400, 320, 480, 360, 440, 300, 420, 380, 460].map((h, i) => (
            <div key={i} style={{ marginBottom: "1.25rem", breakInside: "avoid" }}>
              <SkeletonBlock height={`${h}px`} borderRadius="var(--radius-lg)" />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
