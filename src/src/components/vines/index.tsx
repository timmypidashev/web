import React, { useState, useEffect, useCallback } from 'react';

const VineAnimation = ({ side }) => {
  const [vines, setVines] = useState([]);
  const VINE_COLOR = '#b8bb26'; // Gruvbox green
  const VINE_LIFETIME = 8000; // Time before fade starts
  const FADE_DURATION = 3000; // How long the fade takes
  const MAX_VINES = Math.max(3, Math.floor(window.innerWidth / 400)); // Adjust to screen width
  const isMobile = window.innerWidth <= 768;

  const getDistance = (pointA, pointB) => {
    return Math.sqrt(
      Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
    );
  };

  // Function to create a new branch
  const createBranch = (startX, startY, baseRotation) => ({
    id: Date.now() + Math.random(),
    points: [{
      x: startX,
      y: startY,
      rotation: baseRotation
    }],
    leaves: [],
    growing: true,
    phase: Math.random() * Math.PI * 2,
    amplitude: Math.random() * 0.5 + 1.2
  });

  // Function to create a new vine
  const createNewVine = useCallback(() => ({
    id: Date.now() + Math.random(),
    mainBranch: createBranch(
      side === 'left' ? 0 : window.innerWidth,
      Math.random() * (window.innerHeight * 0.8) + (window.innerHeight * 0.1),
      side === 'left' ? 0 : Math.PI
    ),
    subBranches: [],
    growing: true,
    createdAt: Date.now(),
    fadingOut: false,
    opacity: 1
  }), [side]);

  // Update branch function
  const updateBranch = (branch, isSubBranch = false) => {
    if (!branch.growing) return branch;

    const lastPoint = branch.points[branch.points.length - 1];
    const progress = branch.points.length * 0.15;
    
    const safetyMargin = window.innerWidth * 0.2;
    const minX = safetyMargin;
    const maxX = window.innerWidth - safetyMargin;
    
    const baseAngle = side === 'left' ? 0 : Math.PI;
    let curve = Math.sin(progress + branch.phase) * branch.amplitude;
    
    const distanceFromCenter = Math.abs(window.innerWidth/2 - lastPoint.x);
    const centerRepulsion = Math.max(0, 1 - (distanceFromCenter / (window.innerWidth/4)));
    curve += (side === 'left' ? -1 : 1) * centerRepulsion * 0.5;
    
    if (side === 'left' && lastPoint.x > minX) {
      curve -= Math.pow((lastPoint.x - minX) / safetyMargin, 2);
    } else if (side === 'right' && lastPoint.x < maxX) {
      curve += Math.pow((maxX - lastPoint.x) / safetyMargin, 2);
    }
    
    const currentAngle = baseAngle + curve;
    const distance = isSubBranch ? 12 : 18;
    const newX = lastPoint.x + Math.cos(currentAngle) * distance;
    const newY = lastPoint.y + Math.sin(currentAngle) * distance;

    const newPoint = {
      x: newX,
      y: newY,
      rotation: currentAngle
    };

    let newLeaves = [...branch.leaves];
    if (Math.random() < 0.2 && branch.points.length > 2) {
      const maxLength = isSubBranch ? 15 : 30;
      const progress = branch.points.length / maxLength;
      const baseSize = isSubBranch ? 20 : 35;
      const sizeGradient = Math.pow(1 - progress, 2);
      const leafSize = Math.max(8, baseSize * sizeGradient);

      // Ensure leaves don't grow on the last point
      const leafPosition = Math.min(branch.points.length - 2, Math.floor(Math.random() * branch.points.length));

      newLeaves.push({
        position: leafPosition, // Use the selected point
        size: leafSize,
        side: Math.random() > 0.5 ? 'left' : 'right'
      });
    }

    return {
      ...branch,
      points: [...branch.points, newPoint],
      leaves: newLeaves,
      growing: branch.points.length < (isSubBranch ? 15 : 30)
    };
  };

  // Update vine function
  const updateVine = useCallback((vine) => {
    const now = Date.now();
    const age = now - vine.createdAt;
    
    // Calculate opacity based on age
    let newOpacity = vine.opacity;
    if (age > VINE_LIFETIME) {
      const fadeProgress = (age - VINE_LIFETIME) / FADE_DURATION;
      newOpacity = Math.max(0, 1 - fadeProgress);
    }

    // Update main branch
    const newMainBranch = updateBranch(vine.mainBranch);
    let newSubBranches = [...vine.subBranches];

    // Add new branches with random probability
    if (
      !vine.fadingOut &&
      age < VINE_LIFETIME &&
      Math.random() < 0.05 &&
      newMainBranch.points.length > 4
    ) {
      // Choose a random point, excluding the last point
      const allBranches = [newMainBranch, ...newSubBranches];
      const sourceBranch = allBranches[Math.floor(Math.random() * allBranches.length)];

      const branchPointIndex = Math.floor(Math.random() * (sourceBranch.points.length - 1)); // Exclude the last point
      const branchPoint = sourceBranch.points[branchPointIndex];

      const rotationOffset = Math.random() * 0.8 - 0.4;
      newSubBranches.push(
        createBranch(
          branchPoint.x,
          branchPoint.y,
          branchPoint.rotation + rotationOffset
        )
      );
    }

    // Update existing branches
    newSubBranches = newSubBranches.map(branch => updateBranch(branch, true));

    return {
      ...vine,
      mainBranch: newMainBranch,
      subBranches: newSubBranches,
      growing: newMainBranch.growing || newSubBranches.some(b => b.growing),
      opacity: newOpacity,
      fadingOut: age > VINE_LIFETIME
    };
  }, [side]);

  // Render functions for leaves and branches
  const renderLeaf = (point, size, leafSide, parentOpacity = 1) => {
    const sideMultiplier = leafSide === 'left' ? -1 : 1;
    const angle = point.rotation + (Math.PI / 3) * sideMultiplier;

    const tipX = point.x + Math.cos(angle) * size * 2;
    const tipY = point.y + Math.sin(angle) * size * 2;
    
    const ctrl1X = point.x + Math.cos(angle - Math.PI/8) * size * 1.8;
    const ctrl1Y = point.y + Math.sin(angle - Math.PI/8) * size * 1.8;
    
    const ctrl2X = point.x + Math.cos(angle + Math.PI/8) * size * 1.8;
    const ctrl2Y = point.y + Math.sin(angle + Math.PI/8) * size * 1.8;
    
    const baseCtrl1X = point.x + Math.cos(angle - Math.PI/4) * size * 0.5;
    const baseCtrl1Y = point.y + Math.sin(angle - Math.PI/4) * size * 0.5;
    
    const baseCtrl2X = point.x + Math.cos(angle + Math.PI/4) * size * 0.5;
    const baseCtrl2Y = point.y + Math.sin(angle + Math.PI/4) * size * 0.5;

    return (
      <path
        d={`
          M ${point.x} ${point.y}
          C ${baseCtrl1X} ${baseCtrl1Y} ${ctrl1X} ${ctrl1Y} ${tipX} ${tipY}
          C ${ctrl2X} ${ctrl2Y} ${baseCtrl2X} ${baseCtrl2Y} ${point.x} ${point.y}
        `}
        fill={VINE_COLOR}
        opacity={parentOpacity * 0.8}
      />
    );
  };

  const renderBranch = (branch, parentOpacity = 1) => {
    if (branch.points.length < 2) return null;

    const points = branch.points;
    
    const getStrokeWidth = (index) => {
      const maxWidth = 5;
      const progress = index / (points.length - 1);
      const startTaper = Math.min(1, index / 3);
      const endTaper = Math.pow(1 - progress, 1.5);
      return maxWidth * startTaper * endTaper;
    };

    return (
      <g key={branch.id}>
        {points.map((point, i) => {
          if (i === 0) return null;
          const prev = points[i - 1];
          const dx = point.x - prev.x;
          const dy = point.y - prev.y;
          const controlX = prev.x + dx * 0.7;
          const controlY = prev.y + dy * 0.7;
          
          return (
            <path
              key={`segment-${i}`}
              d={`M ${prev.x} ${prev.y} Q ${controlX} ${controlY} ${point.x} ${point.y}`}
              fill="none"
              stroke={VINE_COLOR}
              strokeWidth={getStrokeWidth(i)}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={parentOpacity * 0.9}
            />
          );
        })}
        {branch.leaves.map((leaf, i) => {
          const point = points[Math.floor(leaf.position)];
          if (!point) return null;
          return (
            <g key={`${branch.id}-leaf-${i}`}>
              {renderLeaf(point, leaf.size, leaf.side, parentOpacity)}
            </g>
          );
        })}
      </g>
    );
  };

  // Animation loop effect
  useEffect(() => {
    if (isMobile) return;

    // Initialize with staggered vines
    if (vines.length === 0) {
      setVines([
        createNewVine(),
        { ...createNewVine(), createdAt: Date.now() - 2000 },
        { ...createNewVine(), createdAt: Date.now() - 4000 }
      ]);
    }

    const interval = setInterval(() => {
      setVines(currentVines => {
        // Update all vines
        const updatedVines = currentVines
          .map(vine => updateVine(vine))
          .filter(vine => vine.opacity > 0.01);

        // Add new vines to maintain constant activity
        if (updatedVines.length < 3) {
          return [...updatedVines, createNewVine()];
        }

        return updatedVines;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [createNewVine, updateVine]);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
      <svg 
        className="w-full h-full"
        viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {vines.map(vine => (
          <g key={vine.id}>
            {renderBranch(vine.mainBranch, vine.opacity)}
            {vine.subBranches.map(branch => renderBranch(branch, vine.opacity))}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default VineAnimation;
