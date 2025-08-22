// src/components/presentation/SlideIn.tsx
interface SlideInProps {
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

export const SlideIn: React.FC<SlideInProps> = ({ 
  direction = 'up', 
  delay = 0, 
  children, 
  className = "" 
}) => {
  return (
    <div 
      data-animate="slide-in"
      data-direction={direction}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </div>
  );
};
