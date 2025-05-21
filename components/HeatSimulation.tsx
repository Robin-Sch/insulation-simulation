import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, DoubleSide, Mesh, ShaderMaterial } from 'three';

export function HeatSimulation({ conductivity }: { conductivity: number }) {
  const ref = useRef<Mesh>(null!);

  useFrame(() => {
    if (ref.current.material) {
      const material = ref.current.material as ShaderMaterial;
      // Create heatmap pattern based on conductivity
      material.uniforms.heatFactor.value = conductivity * 10;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 1.51]}>
      <planeGeometry args={[3.5, 2.5]} />
      <shaderMaterial
        uniforms={{
          heatFactor: { value: 0 },
          coolColor: { value: new Color(0x0000ff) },
          hotColor: { value: new Color(0xff0000) },
        }}
        vertexShader={`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `}
        fragmentShader={`
      uniform float heatFactor;
      uniform vec3 coolColor;
      uniform vec3 hotColor;
      varying vec2 vUv;

      void main() {
        float gradient = sin(vUv.x * 10.0 + heatFactor) * 0.5 + 0.5;
        vec3 color = mix(coolColor, hotColor, gradient);
        gl_FragColor = vec4(color, 0.6);
      }
    `}
        transparent
        side={DoubleSide}
      />
    </mesh>
  );
}
