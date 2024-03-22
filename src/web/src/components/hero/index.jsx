"use client"

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import * as THREE from 'three';
import Particles from '@/components/hero/particles';
import Sections from '@/components/hero/sections';

function Hero() {
  const cameraRef = useRef();

  return (
    <div className="w-full h-screen">
      <Canvas>
        <ScrollControls pages={3}>
          <Scroll>
            <Particles />
          </Scroll>
          <Scroll html>
            <Sections />
          </Scroll>
        </ScrollControls>
        <perspectiveCamera ref={cameraRef} position={[0, 0, 5]} />
        <SceneUpdater cameraRef={cameraRef} />
      </Canvas>
    </div>
  );
}

function SceneUpdater({ cameraRef }) {
  useFrame(({ pointer }) => {
    const camera = cameraRef.current;
    if (!camera) return;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.5, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.8, 0.01);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, Math.max(4, Math.abs(pointer.x * pointer.y * 8)), 0.01);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, pointer.x * -Math.PI * 0.025, 0.001);
  });

  return null;
}

export default Hero;

