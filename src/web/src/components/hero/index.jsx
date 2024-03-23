"use client"

import React, { useRef } from 'react';
import { Section1, Section2, Section3 } from '@/components/hero/sections';

function Hero() {
  return (
    <div className="h-[calc(100vh-96px)] relative">
      <Section1 />
      <Section2 />
      <Section3 />
    </div>
  );
}

export default Hero;

