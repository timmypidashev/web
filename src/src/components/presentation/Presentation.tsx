// src/components/presentation/Presentation.tsx
import React, { useEffect, useState, useRef } from 'react';

interface PresentationProps {
  title?: string;
}

export const Presentation: React.FC<PresentationProps> = ({ 
  title = "Start Presentation" 
}) => {
  const [slides, setSlides] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [isBlackedOut, setIsBlackedOut] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [currentAnimations, setCurrentAnimations] = useState<Element[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize slides when component mounts
  useEffect(() => {
    const initializeSlides = () => {
      const slideElements = Array.from(document.querySelectorAll('.presentation-slide'));
      console.log('Found slides:', slideElements.length);
      
      const slideHTML = slideElements.map(el => el.outerHTML);
      setSlides(slideHTML);
    };

    // Run after a short delay to ensure all components are rendered
    const timer = setTimeout(initializeSlides, 100);
    return () => clearTimeout(timer);
  }, []);

  // Setup slide animations
  const setupSlideAnimations = () => {
    if (!contentRef.current) return;
    
    const animations = Array.from(contentRef.current.querySelectorAll('[data-animate]'));
    setCurrentAnimations(animations);
    setAnimationIndex(0);
    
    // Hide all animated elements initially
    animations.forEach(el => {
      const element = el as HTMLElement;
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
    });
  };

  // Show next animation
  const showNextAnimation = (): boolean => {
    if (animationIndex < currentAnimations.length) {
      const element = currentAnimations[animationIndex] as HTMLElement;
      element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
      setAnimationIndex(prev => prev + 1);
      return true;
    }
    return false;
  };

  // Show previous animation
  const showPrevAnimation = (): boolean => {
    if (animationIndex > 0) {
      const newIndex = animationIndex - 1;
      const element = currentAnimations[newIndex] as HTMLElement;
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      setAnimationIndex(newIndex);
      return true;
    }
    return false;
  };

  // Display slide
  const displaySlide = (index: number) => {
    if (index >= 0 && index < slides.length && contentRef.current) {
      contentRef.current.innerHTML = slides[index];
      setCurrentSlide(index);
      setupSlideAnimations();
    }
  };

  // Navigation functions
  const nextSlide = () => {
    if (showNextAnimation()) return;
    
    if (currentSlide < slides.length - 1) {
      displaySlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (showPrevAnimation()) return;
    
    if (currentSlide > 0) {
      displaySlide(currentSlide - 1);
      // Show all animations on previous slide
      setTimeout(() => {
        currentAnimations.forEach(el => {
          const element = el as HTMLElement;
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        });
        setAnimationIndex(currentAnimations.length);
      }, 50);
    }
  };

  // Start presentation
  const startPresentation = () => {
    setIsPresenting(true);
    displaySlide(0);
    document.body.classList.add('presentation-active');
  };

  // End presentation
  const endPresentation = () => {
    setIsPresenting(false);
    setIsBlackedOut(false);
    setShowHelp(false);
    document.body.classList.remove('presentation-active');
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isPresenting) return;

      switch (event.key) {
        case 'Escape':
          endPresentation();
          break;
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          prevSlide();
          break;
        case 'b':
        case 'B':
          event.preventDefault();
          setIsBlackedOut(prev => !prev);
          break;
        case '?':
          event.preventDefault();
          setShowHelp(prev => !prev);
          break;
        case 'Home':
          event.preventDefault();
          displaySlide(0);
          break;
        case 'End':
          event.preventDefault();
          displaySlide(slides.length - 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPresenting, currentSlide, animationIndex, currentAnimations, slides.length]);

  const progress = slides.length > 0 ? ((currentSlide + 1) / slides.length) * 100 : 0;

  if (slides.length === 0) {
    return null; // Don't show button if no slides
  }

  return (
    <>
      {/* Start Presentation Button */}
      <button
        onClick={startPresentation}
        className="mb-6 px-4 py-2 bg-blue-bright text-background rounded-lg hover:bg-blue transition-colors font-medium"
      >
        {title}
      </button>

      {/* Presentation Container */}
      {isPresenting && (
        <div
          ref={containerRef}
          className="fixed inset-0 z-[9999] bg-black text-foreground flex flex-col"
        >
          {/* Main Content */}
          <div
            ref={contentRef}
            className="flex-1 flex items-center justify-center p-8 overflow-auto"
          >
            <div className="text-4xl text-center text-yellow-bright">
              Loading slide...
            </div>
          </div>

          {/* Slide Counter */}
          <div className="fixed bottom-8 right-8 bg-gray-800 bg-opacity-80 text-foreground px-4 py-2 rounded-lg font-mono">
            {currentSlide + 1} / {slides.length}
          </div>

          {/* Help Toggle */}
          <button
            onClick={() => setShowHelp(prev => !prev)}
            className="fixed bottom-8 left-8 bg-gray-800 bg-opacity-80 text-blue-bright border border-gray-600 px-4 py-2 rounded-lg font-mono hover:bg-gray-700 transition-colors"
          >
            ?
          </button>

          {/* Progress Bar */}
          <div className="fixed bottom-0 left-0 h-1 bg-yellow-bright transition-all duration-300"
               style={{ width: `${progress}%` }} />

          {/* Blackout Overlay */}
          {isBlackedOut && (
            <div className="fixed inset-0 bg-black z-[10000] transition-opacity duration-300" />
          )}

          {/* Help Overlay */}
          {showHelp && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[10001]">
              <div className="bg-gray-800 p-8 rounded-lg max-w-md">
                <h3 className="text-xl font-bold text-yellow-bright mb-6 text-center">
                  🎮 Presentation Controls
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <kbd className="bg-gray-900 px-2 py-1 rounded text-blue-bright font-mono text-sm">→</kbd>
                    <kbd className="bg-gray-900 px-2 py-1 rounded text-blue-bright font-mono text-sm">Space</kbd>
                    <span>Next slide/animation</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <kbd className="bg-gray-900 px-2 py-1 rounded text-blue-bright font-mono text-sm">←</kbd>
                    <span>Previous slide/animation</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <kbd className="bg-gray-900 px-2 py-1 rounded text-blue-bright font-mono text-sm">B</kbd>
                    <span>Toggle blackout</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <kbd className="bg-gray-900 px-2 py-1 rounded text-blue-bright font-mono text-sm">Home</kbd>
                    <span>First slide</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <kbd className="bg-gray-900 px-2 py-1 rounded text-blue-bright font-mono text-sm">End</kbd>
                    <span>Last slide</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <kbd className="bg-gray-900 px-2 py-1 rounded text-blue-bright font-mono text-sm">Esc</kbd>
                    <span>Exit presentation</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <kbd className="bg-gray-900 px-2 py-1 rounded text-blue-bright font-mono text-sm">?</kbd>
                    <span>Toggle this help</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Global styles for presentation mode */}
      {isPresenting && (
        <style jsx global>{`
          .presentation-active {
            overflow: hidden;
          }
          
          .presentation-active > *:not(.fixed) {
            display: none;
          }

          .presentation-slide {
            width: 100%;
            max-width: 100%;
            min-height: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
          }

          .presentation-slide.centered {
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .slide-title-overlay {
            position: absolute;
            top: 2rem;
            left: 2rem;
            right: 2rem;
            z-index: 1;
          }

          .slide-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            z-index: 0;
          }

          .presentation-slide h1 {
            font-size: 3rem;
            line-height: 1.2;
            margin-bottom: 1.5rem;
            color: #fabd2f;
          }

          .presentation-slide h2 {
            font-size: 2.5rem;
            line-height: 1.3;
            margin-bottom: 1rem;
            color: #83a598;
          }

          .presentation-slide h3 {
            font-size: 2rem;
            line-height: 1.4;
            margin-bottom: 0.75rem;
            color: #b8bb26;
          }

          .presentation-slide p {
            font-size: 1.5rem;
            line-height: 1.6;
            margin-bottom: 1rem;
          }

          .presentation-slide ul, .presentation-slide ol {
            font-size: 1.25rem;
            line-height: 1.8;
            margin-left: 2rem;
          }

          .presentation-slide li {
            margin-bottom: 0.5rem;
          }

          .presentation-slide code {
            background: #282828;
            padding: 0.2em 0.4em;
            border-radius: 0.25rem;
            font-family: 'Comic Code', monospace;
            color: #d3869b;
          }

          .presentation-slide pre {
            background: #282828;
            padding: 1.5rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1rem 0;
            font-size: 1.1rem;
          }

          .presentation-slide pre code {
            background: none;
            padding: 0;
            color: #ebdbb2;
          }

          [data-animate="fade-in"] {
            transition: opacity 0.5s ease, transform 0.5s ease;
          }

          @media (max-width: 768px) {
            .presentation-slide h1 { font-size: 2rem; }
            .presentation-slide h2 { font-size: 1.75rem; }
            .presentation-slide h3 { font-size: 1.5rem; }
            .presentation-slide p { font-size: 1.25rem; }
            .presentation-slide ul, .presentation-slide ol { font-size: 1.1rem; }
          }
        `}</style>
      )}
    </>
  );
};
