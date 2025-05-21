'use client';

import React, { useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import Controls from '@/components/Controls';
import { House } from '@/components/House';
import { InsulationType } from '@/lib/constants';

export default function Simulation() {
  const [material, setMaterial] = useState<InsulationType>('eps');
  const [thickness, setThickness] = useState(10); // in cm

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 left-4 z-10 bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-xl text-white space-y-4 w-64">
        <Controls
          material={material}
          setMaterial={setMaterial}
          thickness={thickness}
          setThickness={setThickness}
        />
      </div>

      <Canvas camera={{ position: [3, 3, 3] }}>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        <House material={material} thickness={thickness} />

        <OrbitControls
          enableZoom={true}
          autoRotate={true}
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
}
