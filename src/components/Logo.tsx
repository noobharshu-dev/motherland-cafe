export default function Logo({ className, width = 180, height = 180 }: { className?: string, width?: number, height?: number }) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 400 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
        {/* Top */}
        <path d="M 190 60 L 190 140 M 210 60 L 210 140 M 190 60 L 210 60 M 190 140 L 210 140" />
        {/* Bottom */}
        <path d="M 190 260 L 190 340 M 210 260 L 210 340 M 190 260 L 210 260 M 190 340 L 210 340" />
        {/* Left */}
        <path d="M 60 190 L 140 190 M 60 210 L 140 210 M 60 190 L 60 210 M 140 190 L 140 210" />
        {/* Right */}
        <path d="M 260 190 L 340 190 M 260 210 L 340 210 M 260 190 L 260 210 M 340 190 L 340 210" />
        {/* Top-Right */}
        <path d="M 255 130 L 310 75 M 270 145 L 325 90 M 255 130 L 270 145 M 310 75 L 325 90" />
        {/* Bottom-Left */}
        <path d="M 75 310 L 130 255 M 90 325 L 145 270 M 75 310 L 90 325 M 130 255 L 145 270" />
        {/* Top-Left */}
        <path d="M 90 75 L 145 130 M 75 90 L 130 145 M 90 75 L 75 90 M 145 130 L 130 145" />
        {/* Bottom-Right */}
        <path d="M 270 255 L 325 310 M 255 270 L 310 325 M 270 255 L 255 270 M 325 310 L 310 325" />
      </g>
    </svg>
  );
}
