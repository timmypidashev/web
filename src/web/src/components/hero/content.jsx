"use client"

import Typewriter from 'typewriter-effect';
import React from 'react';


function Content() {
  return (
    <div className="relative h-screen overflow-y-scroll font-bold text-4xl">
      <div className="h-screen flex flex-col items-center justify-center">
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
              typewriter.typeString("<center><span class=''>Hello, I'm</span><br><span class=''>Timothy Pidashev</span></center>")
                .callFunction(() => {
                  console.log('Change the background element to a portrait of my face');
                })
                .pauseFor(2500)
                .deleteAll()
                .callFunction(() => {
                  console.log('Wipe the background element');
                })
                .start()

              typewriter.typeString("<center><span class=''>I'm a 19 year old</span><br><span class=''>on an epic journey to</span><br><span class=''>become a software engineer!</span></center>")
                .pauseFor(2500)
                .deleteAll()
                .start()

              typewriter.typeString("<center><span class=''>I enjoy:</span><br><span class=''>writing code</span><br><span class=''>hiking and camping</span><br><span class=''>driving cars</span><br><span class=''>and much more!</span></center>")
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
  );
};

export default Content; 
