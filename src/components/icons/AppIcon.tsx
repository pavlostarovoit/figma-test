/**
 * Inline SVG icon for the PWA
 * This can be used as favicon and in various sizes
 */

interface AppIconProps {
  size?: number;
}

export function AppIcon({ size = 512 }: AppIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Background */}
      <rect width="512" height="512" fill="#000000" />
      
      {/* Rocket body */}
      <g transform="translate(256, 256)">
        {/* Main rocket shape */}
        <path
          d="M0,-154 L51,-77 L47,-26 L51,-13 L26,-6 L10,-21 L10,-31 L0,-21 L-10,-31 L-10,-21 L-26,-6 L-51,-13 L-47,-26 L-51,-77 Z"
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth="4"
        />
        
        {/* Flame (orange) */}
        <path
          d="M-31,0 L0,90 L31,0 L26,15 L0,41 L-26,15 Z"
          fill="#ff6b00"
        />
        
        {/* Inner flame (yellow) */}
        <path
          d="M-15,0 L0,41 L15,0 Z"
          fill="#ffd700"
        />
        
        {/* Window */}
        <circle cx="0" cy="-77" r="31" fill="#0a64eb" />
        
        {/* Window reflection */}
        <circle cx="-8" cy="-82" r="13" fill="rgba(255, 255, 255, 0.5)" />
        
        {/* Stars */}
        <circle cx="-180" cy="-128" r="5" fill="rgba(255, 255, 255, 0.6)" />
        <circle cx="180" cy="-103" r="6" fill="rgba(255, 255, 255, 0.6)" />
        <circle cx="-154" cy="77" r="4" fill="rgba(255, 255, 255, 0.6)" />
        <circle cx="154" cy="51" r="5" fill="rgba(255, 255, 255, 0.6)" />
        
        {/* Text */}
        <text
          x="0"
          y="190"
          fontFamily="Arial, sans-serif"
          fontSize="46"
          fontWeight="bold"
          fill="#ffffff"
          textAnchor="middle"
        >
          THRUST
        </text>
      </g>
    </svg>
  );
}

/**
 * Generate a data URL from the SVG icon
 */
export function getAppIconDataUrl(size: number = 512): string {
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#000000" />
      <g transform="translate(256, 256)">
        <path d="M0,-154 L51,-77 L47,-26 L51,-13 L26,-6 L10,-21 L10,-31 L0,-21 L-10,-31 L-10,-21 L-26,-6 L-51,-13 L-47,-26 L-51,-77 Z" fill="#ffffff" stroke="#ffffff" stroke-width="4" />
        <path d="M-31,0 L0,90 L31,0 L26,15 L0,41 L-26,15 Z" fill="#ff6b00" />
        <path d="M-15,0 L0,41 L15,0 Z" fill="#ffd700" />
        <circle cx="0" cy="-77" r="31" fill="#0a64eb" />
        <circle cx="-8" cy="-82" r="13" fill="rgba(255, 255, 255, 0.5)" />
        <circle cx="-180" cy="-128" r="5" fill="rgba(255, 255, 255, 0.6)" />
        <circle cx="180" cy="-103" r="6" fill="rgba(255, 255, 255, 0.6)" />
        <circle cx="-154" cy="77" r="4" fill="rgba(255, 255, 255, 0.6)" />
        <circle cx="154" cy="51" r="5" fill="rgba(255, 255, 255, 0.6)" />
        <text x="0" y="190" font-family="Arial, sans-serif" font-size="46" font-weight="bold" fill="#ffffff" text-anchor="middle">THRUST</text>
      </g>
    </svg>
  `.trim();
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
