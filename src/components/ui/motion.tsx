import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

// Simple animation utilities without framer-motion dependency
// Uses CSS animations for performance

interface FadeInProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(
  ({ className, delay = 0, duration = 0.5, direction = 'up', children, style, ...props }, ref) => {
    const directionStyles = {
      up: 'translate-y-4',
      down: '-translate-y-4',
      left: 'translate-x-4',
      right: '-translate-x-4',
      none: '',
    };

    return (
      <div
        ref={ref}
        className={cn(
          "animate-in fade-in",
          direction !== 'none' && `slide-in-from-bottom-4`,
          className
        )}
        style={{
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          animationFillMode: 'both',
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
FadeIn.displayName = 'FadeIn';

interface ScaleInProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number;
  duration?: number;
}

export const ScaleIn = forwardRef<HTMLDivElement, ScaleInProps>(
  ({ className, delay = 0, duration = 0.5, children, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("animate-in zoom-in-95 fade-in", className)}
        style={{
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          animationFillMode: 'both',
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ScaleIn.displayName = 'ScaleIn';

interface StaggerContainerProps extends HTMLAttributes<HTMLDivElement> {
  staggerDelay?: number;
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({ className, children, staggerDelay = 0.1, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("", className)} {...props}>
        {children}
      </div>
    );
  }
);
StaggerContainer.displayName = 'StaggerContainer';

// Hover effect component
interface HoverScaleProps extends HTMLAttributes<HTMLDivElement> {
  scale?: number;
}

export const HoverScale = forwardRef<HTMLDivElement, HoverScaleProps>(
  ({ className, children, scale = 1.02, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "transition-transform duration-300 ease-out hover:scale-[1.02]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
HoverScale.displayName = 'HoverScale';

// Floating animation
interface FloatProps extends HTMLAttributes<HTMLDivElement> {
  intensity?: 'subtle' | 'normal' | 'strong';
}

export const Float = forwardRef<HTMLDivElement, FloatProps>(
  ({ className, children, intensity = 'normal', ...props }, ref) => {
    const intensityClass = {
      subtle: 'animate-float-subtle',
      normal: 'animate-float',
      strong: 'animate-float-strong',
    };

    return (
      <div
        ref={ref}
        className={cn(intensityClass[intensity], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Float.displayName = 'Float';

// Pulse glow effect
interface PulseGlowProps extends HTMLAttributes<HTMLDivElement> {
  color?: 'primary' | 'accent';
}

export const PulseGlow = forwardRef<HTMLDivElement, PulseGlowProps>(
  ({ className, children, color = 'primary', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative",
          className
        )}
        {...props}
      >
        <div className={cn(
          "absolute inset-0 rounded-inherit blur-xl opacity-50 animate-pulse",
          color === 'primary' ? 'bg-primary/30' : 'bg-accent/30'
        )} />
        <div className="relative">{children}</div>
      </div>
    );
  }
);
PulseGlow.displayName = 'PulseGlow';
