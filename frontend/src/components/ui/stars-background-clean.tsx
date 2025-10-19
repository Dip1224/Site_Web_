'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

type StarsBackgroundProps = React.ComponentProps<'div'> & {
  starCount?: number;
  speed?: number;
  factor?: number;
  starColor?: string;
  pointerEvents?: boolean;
};

function StarsBackground({
  children,
  className,
  starCount = 200,
  speed = 40,
  factor = 0.1,
  starColor,
  pointerEvents = true,
  ...props
}: StarsBackgroundProps) {
  const { isDark } = useTheme();
  const colors = useThemeColors();
  
  // Use theme-aware star colors if not provided
  const finalStarColor = starColor || (isDark ? colors.lightGreen : colors.primaryGreen);

  // Generate stars data
  const [stars, setStars] = React.useState<Star[]>([]);

  React.useEffect(() => {
    const newStars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100, // Percentage
        y: Math.random() * 100, // Percentage
        size: Math.random() * 3 + 1, // 1-4px
        duration: speed + Math.random() * 20, // Variable duration
        delay: Math.random() * 50, // Random delay
      });
    }
    setStars(newStars);
  }, [starCount, speed]);

  // Mouse parallax effect
  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!pointerEvents) return;
      
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const deltaX = (mouseX - centerX) * factor;
      const deltaY = (mouseY - centerY) * factor;
      
      // Apply transform to all stars
      const starElements = e.currentTarget.querySelectorAll('[data-star]');
      starElements.forEach((star, index) => {
        const element = star as HTMLElement;
        const multiplier = (index % 3 + 1) * 0.3; // Different layers move at different speeds
        element.style.transform = `translate(${deltaX * multiplier}px, ${deltaY * multiplier}px)`;
      });
    },
    [factor, pointerEvents],
  );

  // Background gradient using theme colors
  const backgroundStyle = isDark 
    ? `radial-gradient(ellipse at center, ${colors.primaryGreen}20 0%, ${colors.background} 60%, ${colors.darkGreen} 100%)`
    : `radial-gradient(ellipse at center, ${colors.lightGreen}15 0%, ${colors.textPrimary} 70%, ${colors.accentGreen}10 100%)`;

  return (
    <div
      data-slot="stars-background"
      className={cn(
        'relative size-full overflow-hidden',
        className,
      )}
      style={{
        background: backgroundStyle
      }}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {/* Render individual stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          data-star
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: finalStarColor,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Additional twinkling layer */}
      {stars.slice(0, starCount / 3).map((star) => (
        <motion.div
          key={`twinkle-${star.id}`}
          data-star
          className="absolute rounded-full"
          style={{
            left: `${(star.x + 20) % 100}%`,
            top: `${(star.y + 30) % 100}%`,
            width: `${star.size * 0.5}px`,
            height: `${star.size * 0.5}px`,
            backgroundColor: isDark ? colors.accentGreen : colors.textSecondary,
          }}
          animate={{
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: star.duration * 1.5,
            delay: star.delay + 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {children}
    </div>
  );
}

export { StarsBackground };
