// src/components/presentation/Highlight.tsx
interface HighlightProps {
  color?: 'yellow' | 'blue' | 'green' | 'red' | 'purple';
  delay?: number;
  children: React.ReactNode;
}

export const Highlight: React.FC<HighlightProps> = ({ 
  color = 'yellow', 
  delay = 0, 
  children 
}) => {
  const colorClasses = {
    yellow: 'bg-yellow-bright/20 text-yellow-bright',
    blue: 'bg-blue-bright/20 text-blue-bright',
    green: 'bg-green-bright/20 text-green-bright',
    red: 'bg-red-bright/20 text-red-bright',
    purple: 'bg-purple-bright/20 text-purple-bright',
  };

  return (
    <span 
      data-animate="highlight"
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      className={`px-2 py-1 rounded ${colorClasses[color]}`}
    >
      {children}
    </span>
  );
};
