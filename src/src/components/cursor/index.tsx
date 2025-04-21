import React, { useState, useEffect, useRef } from 'react';

interface CursorState {
  x: number;
  y: number;
  isPointer: boolean;
  isClicking: boolean;
  isOverBackground: boolean;
  isMobile: boolean;
  isOverGiscus: boolean;
}

interface TrailPoint {
  x: number;
  y: number;
  id: number;
  color: string;
  opacity: number;
  scale: number;
}

const Cursor: React.FC = () => {
  const [state, setState] = useState<CursorState>({
    x: 0,
    y: 0,
    isPointer: false,
    isClicking: false,
    isOverBackground: false,
    isMobile: false,
    isOverGiscus: false
  });
  
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const cursorRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const targetX = useRef(0);
  const targetY = useRef(0);
  const trailIdCounter = useRef(0);
  const lastTrailTime = useRef(0);

  useEffect(() => {
    // Check if device is mobile or tablet
    const checkMobile = () => {
      const isMobileOrTablet = window.matchMedia('(max-width: 1024px)').matches || 
                              ('ontouchstart' in window) || 
                              (navigator.maxTouchPoints > 0);
      setState(prev => ({ ...prev, isMobile: isMobileOrTablet }));
    };
    
    checkMobile();
    
    // Add resize listener to detect device changes
    window.addEventListener('resize', checkMobile);

    const updateCursorPosition = (e: MouseEvent) => {
      targetX.current = e.clientX;
      targetY.current = e.clientY;
      
      const target = e.target as HTMLElement;
      
      // Check if we're over Giscus
      const isOverGiscus = target.closest('.giscus') !== null || 
                          target.closest('#inject-comments') !== null ||
                          target.closest('.giscus-frame') !== null ||
                          target.closest('iframe') !== null;
      
      // Check if the element is interactive
      const isInteractive = target.tagName === 'A' || target.tagName === 'BUTTON' || 
        target.closest('a') !== null || target.closest('button') !== null ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setState(prev => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
        isPointer: isInteractive,
        isOverBackground: target.tagName === 'CANVAS' || 
                         target.closest('canvas') !== null,
        isOverGiscus: isOverGiscus
      }));

      // Add trail points
      const now = Date.now();
      if (now - lastTrailTime.current > 10) { // Control trail density
        const cursorColor = getCursorColor();
        setTrail(prevTrail => {
          const newTrail = [
            {
              x: e.clientX,
              y: e.clientY,
              id: trailIdCounter.current++,
              color: cursorColor,
              opacity: 0.8,
              scale: 1
            },
            ...prevTrail.slice(0, 20) // Keep last 20 points
          ];
          return newTrail;
        });
        lastTrailTime.current = now;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setState(prev => ({ ...prev, isClicking: true }));
    };

    const handleMouseUp = () => {
      setState(prev => ({ ...prev, isClicking: false }));
    };

    const handleMouseLeave = () => {
      setState(prev => ({ ...prev, x: -100, y: -100, isClicking: false }));
      setTrail([]); // Clear trail when mouse leaves
    };

    // Smooth cursor movement animation
    const animate = () => {
      if (cursorRef.current) {
        const currentX = parseFloat(cursorRef.current.style.left || '0');
        const currentY = parseFloat(cursorRef.current.style.top || '0');
        
        // Smooth interpolation
        const newX = currentX + (targetX.current - currentX) * 0.2;
        const newY = currentY + (targetY.current - currentY) * 0.2;
        
        cursorRef.current.style.left = newX + 'px';
        cursorRef.current.style.top = newY + 'px';
      }

      // Update trail points
      setTrail(prevTrail => 
        prevTrail.map(point => ({
          ...point,
          opacity: point.opacity * 0.95, // Fade out
          scale: point.scale * 0.97 // Shrink
        })).filter(point => point.opacity > 0.01) // Remove faded points
      );

      requestRef.current = requestAnimationFrame(animate);
    };

    // Add event listeners
    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Start animation
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', checkMobile);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Helper function to get color from class names
  const getColorFromClass = (element: Element) => {
    const classes = element.className;
    if (typeof classes !== 'string') return null;
    
    // Map of class names to color values
    const colorMap: { [key: string]: string } = {
      'text-aqua': '#689d6a',
      'text-green': '#98971a',
      'text-yellow': '#d79921',
      'text-blue': '#458588',
      'text-purple': '#b16286',
      'text-red': '#cc241d',
      'text-orange': '#d65d0e',
      // Bright variants
      'hover:text-aqua': '#8ec07c',
      'hover:text-green': '#b8bb26',
      'hover:text-yellow': '#fabd2f',
      'hover:text-blue': '#83a598',
      'hover:text-purple': '#d3869b',
      'hover:text-red': '#fb4934',
      'hover:text-orange': '#fe8019',
    };
    
    // Find the first matching color class
    for (const [className, color] of Object.entries(colorMap)) {
      if (classes.includes(className)) {
        return color;
      }
    }
    
    return null;
  };

  // Determine cursor color based on element and state
  const getCursorColor = () => {
    if (state.isOverBackground) return '#ebdbb2';
    
    // Get the element under cursor
    const elementUnderCursor = document.elementFromPoint(state.x, state.y);
    if (!elementUnderCursor) return '#ebdbb2';
    
    // Check element type and apply appropriate color
    if (elementUnderCursor.tagName === 'A' || elementUnderCursor.closest('a')) {
      const linkElement = elementUnderCursor.tagName === 'A' ? elementUnderCursor : elementUnderCursor.closest('a')!;
      
      // First try to get color from class
      const classColor = getColorFromClass(linkElement);
      if (classColor) return classColor;
      
      // Fallback to computed style
      const computedStyle = window.getComputedStyle(linkElement);
      return computedStyle.color;
    }
    
    if (elementUnderCursor.tagName === 'BUTTON' || elementUnderCursor.closest('button')) {
      return '#fabd2f'; // yellow.bright
    }
    
    if (elementUnderCursor.tagName === 'INPUT' || elementUnderCursor.tagName === 'TEXTAREA') {
      return '#8ec07c'; // aqua.bright
    }
    
    // Check for any element with color classes
    const classColor = getColorFromClass(elementUnderCursor);
    if (classColor) return classColor;
    
    return '#ebdbb2'; // default foreground color
  };

  const cursorColor = getCursorColor();
  const scale = state.isClicking ? 0.8 : (state.isPointer ? 1.2 : 1);

  // Hide cursor completely on mobile or when over Giscus
  if (state.isMobile || state.isOverGiscus) {
    return null;
  }
  
  return (
    <>
      {/* Trail effect */}
      {trail.map(point => (
        <div
          key={point.id}
          className="pointer-events-none fixed z-[9997]"
          style={{
            left: point.x,
            top: point.y,
            transform: 'translate(-50%, -50%)',
            opacity: point.opacity,
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: `${8 * point.scale}px`,
              height: `${8 * point.scale}px`,
              backgroundColor: point.color,
              boxShadow: `0 0 ${4 * point.scale}px ${point.color}`,
              filter: 'blur(1px)',
            }}
          />
        </div>
      ))}

      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed z-[9999]"
        style={{
          left: state.x,
          top: state.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="rounded-full border transition-all duration-150 ease-out"
          style={{
            width: '16px',
            height: '16px',
            borderColor: cursorColor || '#ebdbb2',
            borderWidth: '2px',
            backgroundColor: state.isClicking ? cursorColor : 'transparent',
            transform: `scale(${scale})`,
            boxShadow: state.isPointer ? `0 0 8px ${cursorColor}40` : 'none',
          }}
        />
      </div>
      
      {/* Inner cursor dot (for better visibility) */}
      <div
        className="pointer-events-none fixed z-[9999]"
        style={{
          left: state.x,
          top: state.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: '4px',
            height: '4px',
            backgroundColor: cursorColor || '#ebdbb2',
            transform: `scale(${scale})`,
            transition: 'all 0.15s ease-out',
            boxShadow: state.isPointer ? `0 0 6px ${cursorColor}` : 'none',
          }}
        />
      </div>
      
      {/* Hover glow effect */}
      {state.isPointer && !state.isOverBackground && (
        <div
          className="pointer-events-none fixed z-[9998]"
          style={{
            left: state.x,
            top: state.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="rounded-full animate-pulse"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: `${cursorColor}10`,
              filter: 'blur(4px)',
              transform: `scale(${scale})`,
              transition: 'all 0.2s ease-out',
            }}
          />
        </div>
      )}
    </>
  );
};

export default Cursor;
