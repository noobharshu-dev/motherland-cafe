"use client";

import { useRef, useState } from 'react';

const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.25)',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  style?: React.CSSProperties;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => { setIsFocused(true); setOpacity(0.6); };
  const handleBlur = () => { setIsFocused(false); setOpacity(0); };
  const handleMouseEnter = () => setOpacity(0.6);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
    >
      <div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          opacity,
          transition: 'opacity 500ms ease-in-out',
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default SpotlightCard;
