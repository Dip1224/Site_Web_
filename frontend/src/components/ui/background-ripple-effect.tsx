"use client";
import React, { useCallback, useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";
import { useThemeColors } from "../../hooks/useThemeColors";

interface BackgroundRippleEffectProps {
  className?: string;
  gridSize?: number;
  cellSize?: number;
}

export const BackgroundRippleEffect: React.FC<BackgroundRippleEffectProps> = ({
  className = "",
  gridSize = 12,
  cellSize = 60,
}) => {
  const { isDark } = useTheme();
  const colors = useThemeColors();
  const [activeBoxes, setActiveBoxes] = useState<Set<number>>(new Set());
  const timeoutRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  const handleBoxClick = useCallback((index: number) => {
    setActiveBoxes((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });

    // Clear existing timeout for this box
    const existingTimeout = timeoutRef.current.get(index);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout to remove the box from active state
    const timeout = setTimeout(() => {
      setActiveBoxes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
      timeoutRef.current.delete(index);
    }, 600); // Animation duration

    timeoutRef.current.set(index, timeout);
  }, []);

  const handleBoxHover = useCallback((index: number) => {
    // Add more visible hover effect
    setActiveBoxes((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });

    // Remove hover effect after longer delay for visibility
    setTimeout(() => {
      setActiveBoxes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }, 800);
  }, []);

  // Generate grid of boxes
  const totalBoxes = gridSize * gridSize;
  const boxes = Array.from({ length: totalBoxes }, (_, index) => {
    const isActive = activeBoxes.has(index);

    return (
      <div
        key={index}
        className={cn(
          "border border-opacity-20 cursor-pointer transition-all duration-200 ease-out animate-cell-ripple",
          className
        )}
        style={{
          width: `${cellSize}px`,
          height: `${cellSize}px`,
          borderColor: isDark ? colors.primaryGreen + "60" : colors.lightGreen + "50",
          backgroundColor: isActive 
            ? (isDark ? colors.primaryGreen + "80" : colors.lightGreen + "60")
            : (isDark ? colors.primaryGreen + "20" : colors.lightGreen + "15"),
          opacity: isActive ? 1 : 0.7,
          animationDelay: `${Math.random() * 500}ms`,
          animationDuration: "3000ms",
          boxShadow: isActive 
            ? (isDark ? `0 0 20px ${colors.primaryGreen}60` : `0 0 15px ${colors.lightGreen}40`)
            : "none"
        }}
        onClick={() => handleBoxClick(index)}
        onMouseEnter={() => handleBoxHover(index)}
      />
    );
  });

  return (
    <div
      className={cn(
        "absolute inset-0 grid gap-1 place-items-center overflow-hidden pointer-events-auto z-0",
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        background: isDark 
          ? `radial-gradient(ellipse at center, ${colors.primaryGreen}30 0%, ${colors.primaryGreen}10 50%, transparent 80%)`
          : `radial-gradient(ellipse at center, ${colors.lightGreen}20 0%, ${colors.lightGreen}08 50%, transparent 80%)`
      }}
    >
      {boxes}
    </div>
  );
};