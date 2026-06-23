"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Star, Quote } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import SpotlightCard from "@/components/SpotlightCard";

interface Review {
  id: string;
  name: string;
  rating: number;
  reviewText: string;
  source: string;
}

const AUTO_SLIDE_MS = 10000;
const ANIM_MS = 450;

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transitionLock = useRef(false);

  // --- Slide logic ---
  const slideTo = useCallback((idx: number, dir: "next" | "prev") => {
    if (transitionLock.current || idx === current) return;
    transitionLock.current = true;
    setDirection(dir);
    setNext(idx);
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setNext(null);
      setTransitioning(false);
      transitionLock.current = false;
    }, ANIM_MS);
  }, [current]);

  const goNext = useCallback(() => {
    slideTo((current + 1) % reviews.length, "next");
  }, [current, reviews.length, slideTo]);

  const goPrev = useCallback(() => {
    slideTo((current - 1 + reviews.length) % reviews.length, "prev");
  }, [current, reviews.length, slideTo]);

  // --- Progress bar ---
  const startProgress = useCallback(() => {
    setProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    const startTime = Date.now();
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min(100, (elapsed / AUTO_SLIDE_MS) * 100));
    }, 50);
  }, []);

  const stopProgress = useCallback(() => {
    if (progressRef.current) { clearInterval(progressRef.current); progressRef.current = null; }
    setProgress(0);
  }, []);

  // --- Auto-slide timer ---
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    startProgress();
    timerRef.current = setInterval(() => {
      goNext();
      startProgress();
    }, AUTO_SLIDE_MS);
  }, [goNext, startProgress]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    stopProgress();
  }, [stopProgress]);

  // --- IntersectionObserver: start only when visible ---
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startTimer();
        else stopTimer();
      },
      { threshold: 0.4 }
    );
    obs.observe(section);
    return () => { obs.disconnect(); stopTimer(); };
  }, [startTimer, stopTimer]);

  // Reset timer on manual nav
  const handleManual = (fn: () => void) => {
    fn();
    startTimer();
  };

  const review = reviews[current];
  const nextReview = next !== null ? reviews[next] : null;

  return (
    <section
      ref={sectionRef}
      className="section"
      style={{ background: "var(--color-surface)", position: "relative", overflow: "hidden" }}
    >
      {/* Decorative quote */}
      <div style={{
        position: "absolute", top: "-2rem", left: "50%", transform: "translateX(-50%)",
        fontFamily: "var(--font-heading)", fontSize: "clamp(8rem, 20vw, 20rem)",
        color: "rgba(212, 175, 55, 0.05)", lineHeight: 1, userSelect: "none",
        pointerEvents: "none", whiteSpace: "nowrap",
      }}>❝</div>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <AnimatedSection>
          <SectionHeading eyebrow="Guest Stories" title="What Our Guests Say" align="center" />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>

            {/* Fixed-size viewport — both cards render inside, overflow hidden */}
            <div
              style={{
                position: "relative",
                height: "22rem",
                overflow: "hidden",
                marginBottom: "2rem",
              }}
            >
              {/* Exiting card */}
              {transitioning && (
                <SpotlightCard
                  spotlightColor="rgba(212, 175, 55, 0.12)"
                  className={`reviews-card reviews-exit-${direction}`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(251, 249, 246, 0.02)",
                    border: "1px solid rgba(251, 249, 246, 0.07)",
                    borderRadius: "var(--radius-xl)",
                    padding: "2.5rem 2.5rem",
                  }}
                >
                  <ReviewContent review={review} />
                </SpotlightCard>
              )}

              {/* Entering card */}
              {transitioning && nextReview && (
                <SpotlightCard
                  spotlightColor="rgba(212, 175, 55, 0.12)"
                  className={`reviews-card reviews-enter-${direction}`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(251, 249, 246, 0.02)",
                    border: "1px solid rgba(251, 249, 246, 0.07)",
                    borderRadius: "var(--radius-xl)",
                    padding: "2.5rem 2.5rem",
                  }}
                >
                  <ReviewContent review={nextReview} />
                </SpotlightCard>
              )}

              {/* Static card when not transitioning */}
              {!transitioning && (
                <SpotlightCard
                  spotlightColor="rgba(212, 175, 55, 0.12)"
                  className="reviews-card"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(251, 249, 246, 0.02)",
                    border: "1px solid rgba(251, 249, 246, 0.07)",
                    borderRadius: "var(--radius-xl)",
                    padding: "2.5rem 2.5rem",
                  }}
                >
                  <ReviewContent review={review} />
                </SpotlightCard>
              )}
            </div>

            {/* Progress bar */}
            <div style={{
              width: "100%", height: "2px",
              background: "rgba(251,249,246,0.08)", borderRadius: "999px",
              overflow: "hidden", marginBottom: "1.25rem",
            }}>
              <div style={{
                height: "100%", width: `${progress}%`,
                background: "var(--color-cta)", borderRadius: "999px",
                transition: "width 100ms linear",
              }} />
            </div>

            {/* Dot nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
              <button onClick={() => handleManual(goPrev)} aria-label="Previous review" className="review-nav-btn">‹</button>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleManual(() => slideTo(i, i > current ? "next" : "prev"))}
                    aria-label={`Go to review ${i + 1}`}
                    style={{
                      width: i === current ? "1.5rem" : "0.5rem",
                      height: "0.5rem", borderRadius: "999px",
                      background: i === current ? "var(--color-cta)" : "rgba(251, 249, 246, 0.15)",
                      border: "none", cursor: "pointer",
                      transition: "width 300ms ease, background 300ms ease",
                      padding: 0,
                    }}
                  />
                ))}
              </div>

              <button onClick={() => handleManual(goNext)} aria-label="Next review" className="review-nav-btn">›</button>
            </div>
          </div>
        </AnimatedSection>
      </div>

      <style>{`
        .reviews-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* Enter from right (next) */
        .reviews-enter-next {
          animation: enterFromRight ${ANIM_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        /* Exit to left (next) */
        .reviews-exit-next {
          animation: exitToLeft ${ANIM_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        /* Enter from left (prev) */
        .reviews-enter-prev {
          animation: enterFromLeft ${ANIM_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        /* Exit to right (prev) */
        .reviews-exit-prev {
          animation: exitToRight ${ANIM_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes enterFromRight {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes exitToLeft {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(-60px); }
        }
        @keyframes enterFromLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes exitToRight {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(60px); }
        }

        .review-nav-btn {
          width: 2.75rem; height: 2.75rem; border-radius: 50%;
          border: 1px solid rgba(251, 249, 246, 0.15);
          background: transparent; color: var(--color-text);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 1.5rem; line-height: 1;
          transition: background 200ms, border-color 200ms;
        }
        .review-nav-btn:hover {
          background: rgba(251, 249, 246, 0.05);
          border-color: rgba(251, 249, 246, 0.25);
        }
      `}</style>
    </section>
  );
}

function ReviewContent({ review }: { review: any }) {
  return (
    <>
      <Quote size={28} style={{ color: "var(--color-cta)", marginBottom: "1rem", opacity: 0.8, flexShrink: 0 }} />
      <p style={{
        fontFamily: "var(--font-body)", fontSize: "1.05rem", lineHeight: 1.8,
        color: "var(--color-text)", marginBottom: "1.5rem", flex: 1,
      }}>
        &ldquo;{review?.reviewText}&rdquo;
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "0.25rem", marginBottom: "0.75rem" }}>
        {[...Array(review?.rating || 5)].map((_, i) => (
          <Star key={i} size={15} fill="var(--color-cta)" color="var(--color-cta)" />
        ))}
      </div>
      <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", color: "var(--color-cta)", fontWeight: 700 }}>
        {review?.name}
      </p>
      <p style={{ fontSize: "0.75rem", color: "var(--color-muted)", marginTop: "0.2rem" }}>
        via {review?.source}
      </p>
    </>
  );
}
