'use client';

import React, { useMemo, useState } from 'react';
import { OrbitControls, Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import Controls from '@/components/Insulation-3d/Controls';
import { House } from '@/components/Insulation-3d/House';
import { HeatSimulation } from '@/components/Insulation-3d/HeatSimulation';
import Grid from '@/components/Insulation-3d/Grid';
import { InsulationType } from '@/lib/types';

type WasteInsulationConfig = {
  id: string;
  material: InsulationType;
  thickness: number;
  yPlane: number;
  resolution: number;
  showGrid: boolean;
  running: boolean;
  active: boolean;
  title: string;
};

export default function Simulation() {
  const [simulations, setSimulations] = useState<WasteInsulationConfig[]>([
    {
      id: '1',
      material: 'eps',
      thickness: 30,
      yPlane: 0.7,
      resolution: 50,
      showGrid: false,
      running: false,
      active: true,
      title: 'Simulation 1',
    },
  ]);
  const activeSimulation = simulations.find((sim) => sim.active);

  // useMemo to make sure we don't (unncessary) change object reference on each render
  const houseSize = useMemo(
    () => ({ width: 1.5, height: 1.5, depth: 1.5 }),
    []
  );

  const addNewTab = () => {
    const newId = (simulations.length + 1).toString();
    setSimulations((prev) => [
      ...prev.map((sim) => ({ ...sim, active: false })),
      {
        id: newId,
        material: 'eps',
        thickness: 30,
        yPlane: 0.7,
        resolution: 50,
        showGrid: false,
        running: false,
        active: true,
        title: `Simulation: ${newId}`,
      },
    ]);
  };

  const switchTab = (id: string) => {
    setSimulations((prev) =>
      prev.map((sim) => ({
        ...sim,
        active: sim.id === id,
      }))
    );
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSimulations((prev) => {
      const newSims = prev.filter((sim) => sim.id !== id);
      if (newSims.length > 0 && !newSims.some((sim) => sim.active)) {
        newSims[0].active = true;
      }
      return newSims;
    });
  };

  const updateActiveSimulation = (updates: Partial<WasteInsulationConfig>) => {
    setSimulations((prev) =>
      prev.map((sim) => (sim.active ? { ...sim, ...updates } : sim))
    );
  };

  const updateTabTitle = (id: string, newTitle: string) => {
    setSimulations((prev) =>
      prev.map((sim) => (sim.id === id ? { ...sim, title: newTitle } : sim))
    );
  };

  if (!activeSimulation) return null;

  return (
    <div className="relative w-full h-screen flex flex-col">
      <div className="flex bg-gray-800 border-b border-gray-700">
        <div className="flex flex-1 overflow-x-auto">
          {simulations.map((sim) => (
            <div
              key={sim.id}
              onClick={() => switchTab(sim.id)}
              className={`flex items-center px-4 py-2 border-r border-gray-700 cursor-pointer min-w-[120px] ${
                sim.active
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              <span
                className="truncate flex-1"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  updateTabTitle(
                    sim.id,
                    e.currentTarget.textContent || sim.title
                  )
                }
              >
                {sim.title}
              </span>
              <button
                onClick={(e) => closeTab(sim.id, e)}
                className="ml-2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addNewTab}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300"
        >
          +
        </button>
      </div>

      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-xl text-white space-y-4 w-64">
          <Controls
            material={activeSimulation.material}
            setMaterial={(material) => updateActiveSimulation({ material })}
            thickness={activeSimulation.thickness}
            setThickness={(thickness) => updateActiveSimulation({ thickness })}
            yPlane={activeSimulation.yPlane}
            setYPlane={(yPlane) => updateActiveSimulation({ yPlane })}
            resolution={activeSimulation.resolution}
            setResolution={(resolution) =>
              updateActiveSimulation({ resolution })
            }
            showGrid={activeSimulation.showGrid}
            setShowGrid={(showGrid) => updateActiveSimulation({ showGrid })}
            running={activeSimulation.running}
            setRunning={(running) => updateActiveSimulation({ running })}
          />
        </div>
      </div>

      <Canvas camera={{ position: [3, 3, 3] }}>
        <ambientLight intensity={3} />

        <House houseSize={houseSize} thickness={activeSimulation.thickness} />
        <HeatSimulation
          yPlane={activeSimulation.yPlane}
          houseSize={houseSize}
          insulationMaterial={activeSimulation.material}
          insulationThickness={activeSimulation.thickness}
          resolution={activeSimulation.resolution}
          running={activeSimulation.running}
        />

        <OrbitControls
          enableZoom={true}
          autoRotate={true}
          autoRotateSpeed={1}
        />

        <Stats />
        <Grid enabled={activeSimulation.showGrid} />
      </Canvas>
    </div>
  );
}
