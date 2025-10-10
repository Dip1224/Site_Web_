import React, { useRef, useEffect, ReactNode } from 'react';

interface GlowingEffectProps {
  children?: ReactNode;
  className?: string;
  spread?: number;
  glow?: boolean;
  disabled?: boolean;
  proximity?: number;
  inactiveZone?: number;
  variant?: 'default' | 'border';
  borderWidth?: number;
}

export function GlowingEffect({
  children,
  className = '',
  spread = 60,
  glow = true,
  disabled = false,
  proximity = 40,
  inactiveZone = 0.01,
  variant = 'default',
  borderWidth = 2
}: GlowingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || !glow) return;

    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calcular distancia del cursor al centro del elemento
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
      
      // Solo aplicar efecto si está dentro de la zona de proximidad
      if (distance <= proximity) {
        const intensity = Math.max(inactiveZone, 1 - (distance / proximity));
        
        if (variant === 'border') {
          container.style.boxShadow = `
            0 0 ${spread * intensity}px rgba(34, 197, 94, ${intensity * 0.6}),
            inset 0 0 ${spread * intensity * 0.5}px rgba(34, 197, 94, ${intensity * 0.3})
          `;
          container.style.borderColor = `rgba(34, 197, 94, ${intensity})`;
        } else {
          container.style.boxShadow = `
            0 0 ${spread * intensity}px rgba(34, 197, 94, ${intensity * 0.4}),
            0 0 ${spread * intensity * 2}px rgba(34, 197, 94, ${intensity * 0.2})
          `;
        }
      } else {
        // Fuera de la zona de proximidad - efecto mínimo
        if (variant === 'border') {
          container.style.boxShadow = `
            0 0 ${spread * inactiveZone}px rgba(34, 197, 94, ${inactiveZone * 0.3}),
            inset 0 0 ${spread * inactiveZone * 0.5}px rgba(34, 197, 94, ${inactiveZone * 0.1})
          `;
          container.style.borderColor = `rgba(34, 197, 94, ${inactiveZone})`;
        } else {
          container.style.boxShadow = `0 0 ${spread * inactiveZone}px rgba(34, 197, 94, ${inactiveZone * 0.2})`;
        }
      }
    };

    const handleMouseLeave = () => {
      if (variant === 'border') {
        container.style.boxShadow = 'none';
        container.style.borderColor = 'transparent';
      } else {
        container.style.boxShadow = 'none';
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [spread, glow, disabled, proximity, inactiveZone, variant]);

  return (
    <div
      ref={containerRef}
      className={`relative transition-all duration-300 ${className}`}
      style={{
        border: variant === 'border' ? `${borderWidth}px solid transparent` : undefined
      }}
    >
      {children}
    </div>
  );
}

export default GlowingEffect;