import React, { useState, useEffect, useRef } from 'react';

interface CursorState {
  x: number;
  y: number;
  isPointer: boolean;
  isClicking: boolean;
  isOverBackground: boolean;
  isOverIframe: boolean;
}

const Cursor: React.FC = () => {
  const [state, setState] = useState<CursorState>({
    x: 0,
    y: 0,
    isPointer: false,
    isClicking: false,
    isOverBackground: false,
    isOverIframe: false
  });
  
  const cursorRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const targetX = useRef(0);
  const targetY = useRef(0);

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      targetX.current = e.clientX;
      targetY.current = e.clientY;
      
      const target = e.target as HTMLElement;
      
      // Check if we're over an iframe
      const isOverIframe = target.tagName === 'IFRAME' || 
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
        isOverIframe: isOverIframe
      }));
    };

    const handleMouseDown = (e: MouseEvent) => {
      setState(prev => ({ ...prev, isClicking: true }));
    };

    const handleMouseUp = () => {
      setState(prev => ({ ...prev, isClicking: false }));
    };

    const handleMouseLeave = () => {
      setState(prev => ({ ...prev, x: -100, y: -100, isClicking: false }));
    };

    // Handle iframe mouse enter/leave
    const handleFrameEnter = () => {
      setState(prev => ({ ...prev, isOverIframe: true }));
    };

    const handleFrameLeave = () => {
      setState(prev => ({ ...prev, isOverIframe: false }));
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
      requestRef.current = requestAnimationFrame(animate);
    };

    // Add event listeners
    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Add iframe detection listeners
    const iframes = document.getElementsByTagName('iframe');
    Array.from(iframes).forEach(iframe => {
      iframe.addEventListener('mouseenter', handleFrameEnter);
      iframe.addEventListener('mouseleave', handleFrameLeave);
    });
    
    // Start animation
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
      // Remove iframe listeners
      Array.from(iframes).forEach(iframe => {
        iframe.removeEventListener('mouseenter', handleFrameEnter);
        iframe.removeEventListener('mouseleave', handleFrameLeave);
      });
      
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
  
  // Hide custom cursor when over iframe
  if (state.isOverIframe) {
    return null;
  }
  
  return (
    <>
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
