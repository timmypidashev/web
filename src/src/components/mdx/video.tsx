// src/components/mdx/Video.tsx
import React, { useRef } from "react";
import { Play } from "lucide-react";

type VideoProps = {
  url: string;
  title: string;
  attribution?: string;
  className?: string;
};

export function Video({ url, title, attribution, className }: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLButtonElement>(null);

  const handlePlay = () => {
    if (!videoRef.current || !overlayRef.current) return;

    // Show browser native controls on play
    videoRef.current.controls = true;
    videoRef.current.play();

    // Hide the overlay
    overlayRef.current.style.display = "none";
  };

  return (
    <figure className={`w-full ${className ?? ""}`}>
      <div className="relative w-full bg-background rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-auto bg-black cursor-pointer rounded-lg block"
          preload="metadata"
          playsInline
          title={title}
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Big overlay play button */}
        <button
          ref={overlayRef}
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-background/90 text-foreground hover:text-yellow-bright transition"
          aria-label={`Play ${title}`}
        >
          <Play size={64} strokeWidth={1.5} />
        </button>
      </div>

      {/* Title + attribution */}
      <figcaption className="mt-2 text-xs text-foreground flex justify-between items-center">
        <span>{title}</span>
        {attribution && (
          <a
            href={attribution}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-bright"
          >
          {attribution}
          </a>
        )}
      </figcaption>
    </figure>
  );
}
