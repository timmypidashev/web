"use client"

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import React, { useRef } from 'react';


function Section1() {
  const [ref, inView] = useInView();
  const containerRef = useRef(null);
  
  return (
    <div className="relative h-screen overflow-y-scroll font-bold text-4xl">
      <div className="h-screen flex flex-col items-center justify-center" ref={containerRef}>
        <motion.div
          className="text-center"
          ref={ref}
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h1>Hello, I'm</h1>
        </motion.div>
        <motion.div
          className="text-center"
          ref={ref}
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2>Timothy Pidashev</h2>
        </motion.div>
      </div>
    </div>
  );
};

function Section2() {
  const [ref, inView] = useInView();
  const containerRef = useRef(null);

  return (
    <div className="relative h-screen overflow-y-scroll font-bold text-4xl">
      <div className="h-screen flex flex-col items-center justify-center" ref={containerRef}>
        <motion.div
          className="text-center"
          ref={ref}
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h1>I'm a 19 year old</h1>
        </motion.div>
        <motion.div
          className="text-center"
          ref={ref}
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2>On an epic journey</h2>
        </motion.div>
      </div>
    </div>
  );
};

function Section3() {
  const [ref, inView] = useInView();
  const containerRef = useRef(null);
  
  return (
    <div className="relative h-screen overflow-y-scroll font-bold text-4xl">
      <div className="h-screen flex flex-col items-center justify-center" ref={containerRef}>
        <motion.div
          className="text-center"
          ref={ref}
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h1>To become</h1>
        </motion.div>
        <motion.div
          className="text-center"
          ref={ref}
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2>A software engineer!</h2>
        </motion.div>
      </div>
    </div>
  );
};

export { 
  Section1,
  Section2,
  Section3,
}