// src/components/presentation/ImageWithCaption.tsx
interface ImageWithCaptionProps {
  src: string;
  alt: string;
  caption?: string;
  width?: string;
  delay?: number;
}

export const ImageWithCaption: React.FC<ImageWithCaptionProps> = ({ 
  src, 
  alt, 
  caption, 
  width = "100%", 
  delay = 0 
}) => {
  return (
    <figure 
      data-animate="fade-in"
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      className="text-center my-8"
    >
      <img 
        src={src} 
        alt={alt}
        style={{ width, maxWidth: '100%' }}
        className="rounded-lg shadow-lg mx-auto"
      />
      {caption && (
        <figcaption className="mt-4 text-sm italic text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
