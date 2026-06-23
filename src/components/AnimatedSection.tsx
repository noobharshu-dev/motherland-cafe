"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

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
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={{ type: "spring" as const, stiffness: 80, damping: 25, mass: 1, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
