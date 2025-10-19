'use client';

import * as React from 'react';
import {
  type HTMLMotionProps,
  motion,
  useMotionValue,
  useSpring,
  type SpringOptions,
  type Transition,
} from 'framer-motion';

import { cn } from '../../utils/cn';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';

type StarLayerProps = HTMLMotionProps<'div'> & {
  count: number;
  size: number;
  transition: Transition;
  starColor: string;
};

function generateStars(count: number, starColor: string) {
  const shadows: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 4000) - 2000;
    const y = Math.floor(Math.random() * 4000) - 2000;
    shadows.push(`${x}px ${y}px 0px ${starColor}`);
  }
  return shadows.join(', ');
}

function StarLayer({
  count = 1000,
  size = 1,
  transition = { repeat: Infinity, duration: 50, ease: 'linear' },
  starColor = '#fff',
  className,
  ...props
}: StarLayerProps) {
  const [boxShadow, setBoxShadow] = React.useState<string>('');

  React.useEffect(() => {
    setBoxShadow(generateStars(count, starColor));
  }, [count, starColor]);

  return (
    <motion.div
      data-slot="star-layer"
      animate={{ y: [0, -2000] }}
      transition={transition}
      className={cn('absolute top-0 left-0 w-full h-[2000px]', className)}
      {...props}
    >
      <div
        className="absolute bg-transparent rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          boxShadow: boxShadow,
        }}
      />
      <div
        className="absolute bg-transparent rounded-full top-[2000px]"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          boxShadow: boxShadow,
        }}
      />
    </motion.div>
  );
}

type StarsBackgroundProps = React.ComponentProps<'div'> & {
  factor?: number;
  speed?: number;
  transition?: SpringOptions;
  starColor?: string;
  pointerEvents?: boolean;
};

function StarsBackground({
  children,
  className,
  factor = 0.05,
  speed = 50,
  transition = { stiffness: 50, damping: 20 },
  starColor,
  pointerEvents = true,
  ...props
}: StarsBackgroundProps) {
  const { isDark } = useTheme();
  const colors = useThemeColors();
  
  // Use theme-aware star colors if not provided
  const defaultStarColor = isDark 
    ? colors.lightGreen    // Verde claro brillante para modo oscuro
    : colors.primaryGreen;  // Verde primario para modo claro

  const finalStarColor = starColor || defaultStarColor;

  const offsetX = useMotionValue(1);
  const offsetY = useMotionValue(1);

  const springX = useSpring(offsetX, transition);
  const springY = useSpring(offsetY, transition);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const newOffsetX = -(e.clientX - centerX) * factor;
      const newOffsetY = -(e.clientY - centerY) * factor;
      offsetX.set(newOffsetX);
      offsetY.set(newOffsetY);
    },
    [offsetX, offsetY, factor],
  );

  // Background gradient using theme colors
  const backgroundStyle = isDark 
    ? `radial-gradient(ellipse at center, ${colors.primaryGreen}40 0%, ${colors.background} 60%, ${colors.darkGreen} 100%)`
    : `radial-gradient(ellipse at center, ${colors.lightGreen}30 0%, ${colors.textPrimary} 70%, ${colors.accentGreen}20 100%)`;

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
      <motion.div
        style={{ x: springX, y: springY }}
        className={cn({ 'pointer-events-none': !pointerEvents })}
      >
        <StarLayer
          count={1200}
          size={1}
          transition={{ repeat: Infinity, duration: speed, ease: 'linear' }}
          starColor={finalStarColor}
        />
        <StarLayer
          count={400}
          size={2}
          transition={{
            repeat: Infinity,
            duration: speed * 1.5,
            ease: 'linear',
          }}
          starColor={isDark ? colors.textSecondary : colors.accentGreen}
        />
        <StarLayer
          count={200}
          size={3}
          transition={{
            repeat: Infinity,
            duration: speed * 2.5,
            ease: 'linear',
          }}
          starColor={
            isDark
              ? colors.accentGreen ?? '#00FF00'
              : colors.textSecondary ?? '#CCCCCC'
          }
        />
      </motion.div>
      {children}
    </div>
  );
}

export {
  StarLayer,
  StarsBackground,
  type StarLayerProps,
  type StarsBackgroundProps,
};
