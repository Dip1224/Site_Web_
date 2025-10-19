import type { ReactNode } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ShimmerTextProps {
  children: ReactNode;
  className?: string;
  shimmerColor?: string;
  animationDuration?: number;
  shimmerWidth?: number;
}

export function ShimmerText({
  children,
  className = '',
  shimmerColor,
  animationDuration = 3,
  shimmerWidth = 100
}: ShimmerTextProps) {
  const { isDark } = useTheme();
  
  // Configurar colores según el tema
  const baseColor = isDark ? '#ffffff' : '#1f2937'; // blanco para oscuro, gris oscuro para claro
  const effectiveShimmerColor = shimmerColor || (isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(34, 197, 94, 0.8)'); // blanco para oscuro, verde para claro
  const shimmerStyle = {
    background: `linear-gradient(
      90deg,
      ${baseColor} 0%,
      ${effectiveShimmerColor} 30%,
      ${baseColor} 60%,
      ${effectiveShimmerColor} 90%,
      ${baseColor} 100%
    )`,
    backgroundSize: `${shimmerWidth}% 100%`,
    animation: `shimmer ${animationDuration}s infinite ease-in-out`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    display: 'inline-block'
  };

  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -${shimmerWidth}% 0;
            }
            50% {
              background-position: ${shimmerWidth}% 0;
            }
            100% {
              background-position: ${shimmerWidth * 2}% 0;
            }
          }
        `}
      </style>
      <span
        className={`relative ${className}`}
        style={shimmerStyle}
      >
        {children}
      </span>
    </>
  );
}

export default ShimmerText;
