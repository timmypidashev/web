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
      <div className="relative h-screen overflow-y-scroll font-bold text-4xl">
        <div className="h-screen flex flex-col items-center justify-center">
          <Portrait />
          <div className="relative h-48 overflow-y-auto">
            <Typewriter
              options={{
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 25,
                cursor: ''
              }}
              onInit={(typewriter) => {
                typewriter.typeString("<center><span class='inline-block mb-4'>Hello, I'm</span><br><span class='inline-block mb-4'><strong class='text-light-aqua-1 dark:text-dark-aqua-1'>Timothy Pidashev</strong></span></center>")
                  .callFunction(() => {
                    console.log('Change the background element to a portrait of my face');
                  })
                  .pauseFor(2500)
                  .deleteAll()
                  .callFunction(() => {
                    console.log('Wipe the background element');
                  })
                  .start()

                typewriter.typeString("<center><span class='inline-block mb-4'>I'm a <strong class='text-light-green-1 dark:text-dark-green-1'>19 year old</strong></span><br><span class='inline-block mb-4'>on an <strong class='text-light-yellow-1 dark:text-dark-yellow-1'>epic journey</strong> to</span><br><span class='inline-block mb-4'>become a <strong class='text-light-blue-1 dark:text-dark-blue-1'>software engineer</strong>!</span></center>")
                  .pauseFor(2500)
                  .deleteAll()
                  .start()

                typewriter.typeString("<center><span class=''>I enjoy</span><br><span class=''>writing code</span><br><span class=''>hiking and camping</span><br><span class=''>driving cars</span><br><span class=''>and much more!</span></center>")
                  .pauseFor(2500)
                  .deleteAll()
                  .start()

                typewriter.typeString("<center><span class=''>Fun facts about me:</span><br><span class=''>I keep a journal</span><br><span class=''>I love rust lang!</span><br><span class=''>I use a corebooted thinkpad</span></center>")
                  .pauseFor(2500)
                  .deleteAll()
                  .start()

                typewriter.typeString("<center><span class=''>Wait your still here?</span></center>")
                  .pauseFor(2500)
                  .deleteAll()
                  .start()

                typewriter.typeString("<center><span class=''>Check out my blog and shop</span><br><span class=''>for many goodies!</span><br><span class=''>or contact me below!</span></center>")
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
