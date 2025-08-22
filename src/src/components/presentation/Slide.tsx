// src/components/presentation/Slide.tsx
import React from 'react';

interface SlideProps {
  title?: string;
  centered?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Slide: React.FC<SlideProps> = ({ 
  title, 
  centered = false, 
  children, 
  className = "" 
}) => {
  return (
    <section 
      className={`presentation-slide ${centered ? 'centered' : ''} ${className}`}
      data-title={title}
    >
      {title && (
        <div className="slide-title-overlay">
          <h1 className="text-4xl md:text-6xl font-bold text-yellow-bright mb-8">
            {title}
          </h1>
        </div>
      )}
      <div className="slide-content">
        {children}
      </div>
    </section>
  );
};
