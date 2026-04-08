import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SIMPLEX_3D, PLANE_VERT } from "../shaders/noise";

interface VoidWaterProps {
  segment: number;
  corruption: number; // 0-1, drives RGB split + color noise
}

const waterFrag = `
${SIMPLEX_3D}

uniform float uTime;
uniform float uOpacity;
uniform float uCorruption;
varying vec2 vUv;

// Sample the water height field — broad, slow waves
float waterHeight(vec2 p) {
  float t = uTime;

  // Large primary waves — slow, dominant
  float h  = snoise(vec3(p * 0.4, t * 0.08)) * 0.6;
  // Medium secondary swell — different direction via offset
        h += snoise(vec3(p.yx * 0.7 + 2.0, t * 0.12)) * 0.3;
  // Small surface detail
        h += snoise(vec3(p * 1.5 + 5.0, t * 0.2)) * 0.1;

  return h;
}

// Compute lighting for a given UV position
float computeLight(vec2 p) {
  float eps = 0.08;
  float h   = waterHeight(p);
  float hx  = waterHeight(p + vec2(eps, 0.0));
  float hy  = waterHeight(p + vec2(0.0, eps));

  vec3 normal = normalize(vec3(
    (h - hx) / eps * 2.0,
    (h - hy) / eps * 2.0,
    1.0
  ));

  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 lightDir = normalize(vec3(0.4, 0.3, 1.0));
  vec3 halfDir = normalize(lightDir + viewDir);

  float diffuse = max(dot(normal, lightDir), 0.0);
  float spec1 = pow(max(dot(normal, halfDir), 0.0), 12.0);
  float spec2 = pow(max(dot(normal, halfDir), 0.0), 40.0);
  float tilt = 1.0 - normal.z;

  return tilt * 0.12 + diffuse * 0.2 + spec1 * 0.5 + spec2 * 0.6;
}

void main() {
  vec2 p = (vUv - 0.5) * 4.0;

  // Circular vignette
  float dist = length(vUv - 0.5) * 2.0;
  float vignette = 1.0 - smoothstep(0.5, 1.0, dist);

  if (uCorruption < 0.01) {
    // Clean path — original water
    float light = computeLight(p);
    float intensity = light * vignette * uOpacity;
    vec3 color = vec3(0.3, 0.38, 0.5) * intensity;
    gl_FragColor = vec4(color, intensity);
  } else {
    // Corrupted path — RGB channel separation + color noise

    // Chromatic offset increases with corruption
    float offset = uCorruption * 0.15;

    // Sample lighting at offset positions for each channel
    float lightR = computeLight(p + vec2(offset, offset * 0.5));
    float lightG = computeLight(p);
    float lightB = computeLight(p - vec2(offset * 0.7, offset));

    // Base water color per channel
    vec3 baseColor = vec3(0.3, 0.38, 0.5);
    float r = lightR * baseColor.r;
    float g = lightG * baseColor.g;
    float b = lightB * baseColor.b;

    // Color static — high-frequency noise injecting random color
    float staticR = snoise(vec3(vUv * 80.0, uTime * 3.0)) * 0.5 + 0.5;
    float staticG = snoise(vec3(vUv * 80.0 + 50.0, uTime * 3.5)) * 0.5 + 0.5;
    float staticB = snoise(vec3(vUv * 80.0 + 100.0, uTime * 4.0)) * 0.5 + 0.5;

    float staticMix = uCorruption * 0.3;
    r = mix(r, staticR * 0.4, staticMix);
    g = mix(g, staticG * 0.3, staticMix);
    b = mix(b, staticB * 0.5, staticMix);

    // Scan line glitch — horizontal bands that flicker
    float scanline = step(0.92, snoise(vec3(0.0, vUv.y * 40.0, uTime * 5.0)));
    r += scanline * uCorruption * 0.15;

    float avgLight = (lightR + lightG + lightB) / 3.0;
    float intensity = avgLight * vignette * uOpacity;

    gl_FragColor = vec4(vec3(r, g, b) * vignette * uOpacity, intensity);
  }
}
`;

function getOpacityTarget(segment: number): number {
  if (segment < 2) return 0;
  if (segment === 2) return 0.5;
  if (segment === 3) return 0.7;
  if (segment === 4) return 0.85;
  return 1.0;
}

export default function VoidWater({ segment, corruption }: VoidWaterProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const opacityRef = useRef(0);
  const corruptionRef = useRef(0);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uOpacity: { value: 0 },
    uCorruption: { value: 0 },
  }), []);

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: PLANE_VERT,
    fragmentShader: waterFrag,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [uniforms]);

  useFrame((state, delta) => {
    const target = getOpacityTarget(segment);
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, target, delta * 0.4);
    corruptionRef.current = THREE.MathUtils.lerp(corruptionRef.current, corruption, delta * 2.0);

    const mesh = meshRef.current;
    if (!mesh) return;

    if (opacityRef.current < 0.001) {
      mesh.visible = false;
      return;
    }

    mesh.visible = true;
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = t;

    // Gentle pulse — slow breathing modulation on opacity
    const pulse = 1.0 + Math.sin(t * 0.4) * 0.08 + Math.sin(t * 0.7) * 0.04;
    uniforms.uOpacity.value = opacityRef.current * pulse;
    uniforms.uCorruption.value = corruptionRef.current;
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      visible={false}
      material={material}
    >
      <planeGeometry args={[20, 20, 1, 1]} />
    </mesh>
  );
}
