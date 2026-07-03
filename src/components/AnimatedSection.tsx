"use client";

import { useRef } from "react";
import { LazyMotion, domAnimation, m, useInView } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

export default function AnimatedSection({
  children,
  className,
  delay = 0,
  style,
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    // LazyMotion with domAnimation lazy-loads the animation feature set (~18kb vs ~140kb)
    // Only loaded when the component is mounted — viewport-triggered via useInView
    <LazyMotion features={domAnimation} strict>
      <m.div
        ref={ref}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
        transition={{ type: "spring" as const, stiffness: 80, damping: 25, mass: 1, delay }}
        className={className}
        style={style}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
