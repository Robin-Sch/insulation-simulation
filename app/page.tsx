'use client';

import React, { useEffect, useRef, useState } from 'react';
import { OrbitControls, Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import Controls from '@/components/Controls';
import Grid from '@/components/Grid';
import Renderer from '@/components/Renderer';
import Tab from '@/components/Tab';
import { TypeMenu } from '@/components/TypeMenu';

import { CommonConfig, ISimulation, SimulationType } from '@/lib/constants';
import { SimulationFactory } from '@/lib/simulations/factory';

export default function Simulation() {
    const [simulations, setSimulations] = useState<ISimulation[]>([
        SimulationFactory.create('insulation3d', '1', '1: 3D Insulation'),
    ]);
    const activeSimulation = simulations.find((sim) => sim.active);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cameraRef = useRef<any>(null);
    const [cameraSettings, setCameraSettings] = useState({
        position: [3, 3, 3] as [number, number, number],
        enableZoom: true,
        autoRotate: true,
        autoRotateSpeed: 1,
    });
    useEffect(() => {
        if (cameraRef.current) {
            cameraRef.current.reset();
        }
    }, [cameraSettings]);

    const addNewTab = (type: SimulationType) => {
        const newId = (simulations.length + 1).toString();
        setSimulations((prev) => [
            ...prev.map((sim) => ({ ...sim, active: false })),
            SimulationFactory.create(type, newId, `${newId}: ${type}`),
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

    const renameTab = (id: string, newTitle: string) => {
        setSimulations((prev) =>
            prev.map((sim) =>
                sim.id === id ? { ...sim, title: newTitle } : sim
            )
        );
    };

    const onCommonChange = (id: string, updates: Partial<CommonConfig>) => {
        setSimulations((prev) =>
            prev.map((sim) => {
                if (sim.id === id) {
                    sim.commonConfig = { ...sim.commonConfig, ...updates };
                    return sim;
                } else return sim;
            })
        );
    };
    const onSpecificChange = (
        id: string,
        updates: Partial<ISimulation['specificConfig']>
    ) => {
        setSimulations((prev) =>
            prev.map((sim) => {
                if (sim.id === id) {
                    // @ts-expect-error factory moment
                    sim.specificConfig = { ...sim.specificConfig, ...updates };
                    return sim;
                } else return sim;
            })
        );
    };

    if (!activeSimulation) return null;

    return (
        <div className="relative w-full h-screen flex flex-col">
            {/* Tab bar with type selection */}
            <div className="flex bg-gray-800 border-b border-gray-700">
                <div className="flex flex-1 overflow-x-auto">
                    {simulations.map((sim) => (
                        <Tab
                            key={sim.id}
                            simulation={sim}
                            onSelect={() => switchTab(sim.id)}
                            onRename={(newTitle) => renameTab(sim.id, newTitle)}
                            onClose={(e) => closeTab(sim.id, e)}
                        />
                    ))}
                </div>
                <TypeMenu onSelectType={addNewTab} />
            </div>

            {/* Main content area */}
            <div className="flex-1 relative">
                {activeSimulation && (
                    <>
                        <div className="absolute top-4 left-4 z-10 bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-xl text-white space-y-4 w-64">
                            <Controls
                                simulation={activeSimulation}
                                onCommonChange={(updates) =>
                                    onCommonChange(activeSimulation.id, updates)
                                }
                                onSpecificChange={(updates) =>
                                    onSpecificChange(
                                        activeSimulation.id,
                                        updates
                                    )
                                }
                            />
                        </div>

                        <Canvas
                            camera={{
                                position: cameraSettings.position,
                            }}
                        >
                            <ambientLight intensity={3} />

                            <Renderer
                                simulation={activeSimulation}
                                setCameraSettings={setCameraSettings}
                            />
                            <OrbitControls
                                ref={cameraRef}
                                makeDefault
                                enableZoom={true}
                                autoRotate={cameraSettings.autoRotate}
                                autoRotateSpeed={cameraSettings.autoRotateSpeed}
                            />

                            {activeSimulation.commonConfig.showFps && <Stats />}
                            {activeSimulation.commonConfig.showGrid && <Grid />}
                        </Canvas>
                    </>
                )}
            </div>
        </div>
    );
}
