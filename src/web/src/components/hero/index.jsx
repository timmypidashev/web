"use client"

import React, { useRef } from 'react';
import Content from '@/components/hero/sections';

function Hero() {
  return (
    <div className="h-[calc(100vh-96px)] relative">
      <Content />
    </div>
  );
}

export default Hero;

