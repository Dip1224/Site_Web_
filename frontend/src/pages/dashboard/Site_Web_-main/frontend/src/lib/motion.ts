// Simple animation function replacement for motion/react
export const animate = (
  from: number,
  to: number,
  options: {
    duration: number;
    ease?: number[];
    onUpdate: (value: number) => void;
  }
) => {
  const { duration, onUpdate } = options;
  const startTime = performance.now();
  
  const animateFrame = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / (duration * 1000), 1);
    
    // Cubic bezier easing approximation for [0.16, 1, 0.3, 1]
    const easedProgress = progress === 1 ? 1 : 1 - Math.pow(1 - progress, 3);
    const currentValue = from + (to - from) * easedProgress;
    
    onUpdate(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(animateFrame);
    }
  };
  
  requestAnimationFrame(animateFrame);
};