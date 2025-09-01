import { useState, useEffect, ReactNode } from 'react';

// Fade In Animation
export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 300, 
  className = '' 
}: { 
  children: ReactNode; 
  delay?: number; 
  duration?: number; 
  className?: string; 
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all ease-in-out ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
      }}
    >
      {children}
    </div>
  );
}

// Slide In from Left
export function SlideInLeft({ 
  children, 
  delay = 0, 
  duration = 300, 
  className = '' 
}: { 
  children: ReactNode; 
  delay?: number; 
  duration?: number; 
  className?: string; 
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all ease-out ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
      }}
    >
      {children}
    </div>
  );
}

// Scale In Animation
export function ScaleIn({ 
  children, 
  delay = 0, 
  duration = 200, 
  className = '' 
}: { 
  children: ReactNode; 
  delay?: number; 
  duration?: number; 
  className?: string; 
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all ease-out ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.95)',
      }}
    >
      {children}
    </div>
  );
}

// Staggered List Animation
export function StaggeredList({ 
  children, 
  staggerDelay = 100, 
  className = '' 
}: { 
  children: ReactNode[]; 
  staggerDelay?: number; 
  className?: string; 
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn key={index} delay={index * staggerDelay}>
          {child}
        </FadeIn>
      ))}
    </div>
  );
}

// Bounce Animation for Success States
export function BounceIn({ 
  children, 
  trigger, 
  className = '' 
}: { 
  children: ReactNode; 
  trigger: boolean; 
  className?: string; 
}) {
  return (
    <div
      className={`transition-transform duration-200 ease-out ${className} ${
        trigger ? 'animate-bounce' : ''
      }`}
    >
      {children}
    </div>
  );
}

// Pulse Animation for Loading States
export function PulseAnimation({ 
  children, 
  isActive = true, 
  className = '' 
}: { 
  children: ReactNode; 
  isActive?: boolean; 
  className?: string; 
}) {
  return (
    <div className={`${isActive ? 'animate-pulse' : ''} ${className}`}>
      {children}
    </div>
  );
}

// Shake Animation for Errors
export function ShakeError({ 
  children, 
  trigger, 
  className = '' 
}: { 
  children: ReactNode; 
  trigger: boolean; 
  className?: string; 
}) {
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div
      className={`${className} ${
        isShaking ? 'animate-bounce' : ''
      } transition-all duration-100`}
    >
      {children}
    </div>
  );
}

// Expandable Content Animation
export function ExpandableContent({ 
  isExpanded, 
  children, 
  className = '' 
}: { 
  isExpanded: boolean; 
  children: ReactNode; 
  className?: string; 
}) {
  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${className}`}
      style={{
        maxHeight: isExpanded ? '1000px' : '0',
        opacity: isExpanded ? 1 : 0,
      }}
    >
      <div className="py-2">
        {children}
      </div>
    </div>
  );
}

// Progress Bar Animation
export function AnimatedProgressBar({ 
  progress, 
  duration = 1000, 
  className = '' 
}: { 
  progress: number; 
  duration?: number; 
  className?: string; 
}) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className="h-full bg-blue-600 rounded-full transition-all ease-out"
        style={{
          width: `${Math.max(0, Math.min(100, animatedProgress))}%`,
          transitionDuration: `${duration}ms`,
        }}
      />
    </div>
  );
}

// Floating Action Button Animation
export function FloatingActionButton({ 
  children, 
  isVisible = true, 
  onClick, 
  className = '' 
}: { 
  children: ReactNode; 
  isVisible?: boolean; 
  onClick?: () => void; 
  className?: string; 
}) {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 
        text-white rounded-full shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-300 ease-in-out transform
        ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
