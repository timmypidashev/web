// src/components/presentation/TwoColumn.tsx
interface TwoColumnProps {
  leftWidth?: string;
  rightWidth?: string;
  gap?: string;
  left: React.ReactNode;
  right: React.ReactNode;
}

export const TwoColumn: React.FC<TwoColumnProps> = ({ 
  leftWidth = "1fr", 
  rightWidth = "1fr", 
  gap = "2rem",
  left,
  right
}) => {
  return (
    <div 
      className="grid items-start w-full md:grid-cols-2 grid-cols-1"
      style={{ 
        gridTemplateColumns: `${leftWidth} ${rightWidth}`, 
        gap: gap 
      }}
    >
      <div className="left-column">
        {left}
      </div>
      <div className="right-column">
        {right}
      </div>
    </div>
  );
};
