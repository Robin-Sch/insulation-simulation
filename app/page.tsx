'use client';

import React, { useState } from 'react';
import { OrbitControls, Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import Controls from '@/components/Controls';
import { House } from '@/components/House';
import { InsulationType } from '@/lib/constants';

export default function Simulation() {
  const [material, setMaterial] = useState<InsulationType>('eps');
  const [thickness, setThickness] = useState<number>(10); // in cm
  const [yPlane, setYPlane] = useState<number>(0.7);
  const [resolution, setResolution] = useState<number>(30);
  const [grid, setGrid] = useState<boolean>(false);

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 left-4 z-10 bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-xl text-white space-y-4 w-64">
        <Controls
          material={material}
          setMaterial={setMaterial}
          thickness={thickness}
          setThickness={setThickness}
          yPlane={yPlane}
          setYPlane={setYPlane}
          resolution={resolution}
          setResolution={setResolution}
          grid={grid}
          setGrid={setGrid}
        />
      </div>

      <Canvas camera={{ position: [3, 3, 3] }}>
        <ambientLight intensity={2} />
        {/* <pointLight position={[3, 3, 3]} /> */}

        <House
          yPlane={yPlane}
          material={material}
          thickness={thickness}
          resolution={resolution}
        />

        <OrbitControls
          enableZoom={true}
          autoRotate={true}
          autoRotateSpeed={1}
        />

        <Stats />

        {grid && (
          <>
            <gridHelper args={[5, 5]} rotation={[Math.PI / 2, 0, 0]} />
            <gridHelper args={[5, 5]} rotation={[0, Math.PI / 2, 0]} />
            <gridHelper args={[5, 5]} rotation={[0, 0, Math.PI / 2]} />
          </>
        )}
      </Canvas>
    </div>
  );
}
