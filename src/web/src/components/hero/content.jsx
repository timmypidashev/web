"use client"

import Typewriter from 'typewriter-effect';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

function Portrait() {
  const fadeInAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInAnimation}
      className="w-32 h-32 relative rounded-full overflow-hidden"
    >
      <Image
        src="/profile.png"
        alt="Portrait"
        width="90"
        height="90"
        className="w-full h-full rounded-full"
      />
    </motion.div>
  );
}

function Content() {
  return (
    <>
      <div className="flex justify-center items-center h-full font-bold text-4xl">
        <div className="h-screen flex flex-col items-center justify-center">
          <div className="flex items-center justify-center relative h-58 overflow-y-auto">
            <Typewriter
              options={{
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 800,
                cursor: ''
              }}
              onInit={(typewriter) => {
                typewriter.typeString("<center><span class='inline-block mb-4'>Hello, I'm</span><br><span class='inline-block mb-4'><strong class='text-light-aqua-1 dark:text-dark-aqua-1'>Timothy Pidashev</strong></span></center>")
                  .pauseFor(2500)
                  .deleteAll()
                  .start()

                typewriter.typeString("<center><span class='inline-block mb-4'>I'm a <strong class='text-light-green-1 dark:text-dark-green-1'>19 year old</strong></span><br><span class='inline-block mb-4'>on an <strong class='text-light-yellow-1 dark:text-dark-yellow-1'>epic journey</strong> to</span><br><span class='inline-block mb-4'>become a <strong class='text-light-blue-1 dark:text-dark-blue-1'>software engineer</strong>!</span></center>")
                  .pauseFor(2500)
                  .deleteAll()
                  .start()

                typewriter.typeString("<center><span class=''>Check out my <strong class='text-light-purple-1 dark:text-dark-purple-1'>blog</strong> and <strong class='text-light-aqua-1 dark:text-dark-aqua-1'>shop</strong></span><br></span><br><span class=''>or <strong class='text-light-green-1 dark:text-dark-green-1'>contact me below</strong>!</span></center>")
                  .pauseFor(2500)
                  .deleteAll()
                  .start()
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Content; 
