"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";

import { Box } from "@/components/box";
import { OrbitControls } from "@react-three/drei";

export default function Home() {
  const [rotateX, setRotateX] = useState(true);
  const [rotateY, setRotateY] = useState(true);
  const [rotateZ, setRotateZ] = useState(true);
  const [speed, setSpeed] = useState(0.5);

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 left-4 z-10 bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-xl text-white space-y-4 w-64">
        <h2 className="text-xl font-bold mb-2">Rotation Controls</h2>
        <div className="space-y-2">
          <h3 className="font-medium">Rotation Axes</h3>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={rotateX}
              onChange={() => setRotateX(!rotateX)}
              className="h-4 w-4 accent-blue-500"
            />
            <span>X-axis</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={rotateY}
              onChange={() => setRotateY(!rotateY)}
              className="h-4 w-4 accent-blue-500"
            />
            <span>Y-axis</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={rotateZ}
              onChange={() => setRotateZ(!rotateZ)}
              className="h-4 w-4 accent-blue-500"
            />
            <span>Z-axis</span>
          </label>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Rotation Speed</h3>
          <div>
            <label className="block text-sm">Speed: {speed.toFixed(1)}</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={2} />
        <spotLight intensity={3} position={[5, 0, 0]} />
        <Box
          position={[0, 0, 0]}
          rotateX={rotateX}
          rotateY={rotateY}
          rotateZ={rotateZ}
          speed={speed}
        />

        <OrbitControls />
      </Canvas>
    </div>
  );
}
