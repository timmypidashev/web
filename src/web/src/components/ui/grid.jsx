"use client"

import React, { useState } from 'react';

const Grid = () => {
  const [squares, setSquares] = useState([]);

  const handleClick = (event) => {
    const { clientX, clientY } = event;
    const newSquares = [];

    for (let i = 0; i < 25; i++) {
      const left = clientX - 50 + Math.random() * 100;
      const top = clientY - 50 + Math.random() * 100;
      const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;

      newSquares.push({ left, top, color });
    }

    setSquares(newSquares);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden" onClick={handleClick}>
      {squares.map((square, index) => (
        <div
          key={index}
          className="absolute w-8 h-8 bg-gray-300 rounded-md opacity-0 transition-transform transition-opacity duration-500 transform scale-0"
          style={{ left: square.left, top: square.top, backgroundColor: square.color }}
        />
      ))}
    </div>
  );
};

export default Grid;

