"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function HoverCard({ children, className, style }: HoverCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5, boxShadow: "0 12px 40px rgba(0,0,0,0.4)" }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
