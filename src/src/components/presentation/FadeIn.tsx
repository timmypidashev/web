// src/components/presentation/FadeIn.tsx
import React from 'react';

interface FadeInProps {
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({ 
  delay = 0, 
  children, 
  className = "" 
}) => {
  return (
    <div 
      data-animate="fade-in" 
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </div>
  );
};
