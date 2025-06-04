import { useState } from 'react';
import { OrbitControls, Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import Grid from './Grid';
import InsulationGraph_Chart from './insulationGraph/Graph';
import InsulationGraph_Layers from './insulationGraph/Layers';
import InsulationSimulation_HeatSimulation from './insulationSimulation/Simulation';
import InsulationSimulation_House from './insulationSimulation/House';

import { ISimulation } from '@/lib/constants';
import { InsulationGraph } from '@/lib/simulations/insulationGraph';
import { InsulationSimulation } from '@/lib/simulations/insulationSimulation';

export default function Renderer({ simulation }: { simulation: ISimulation }) {
    const [insulationGraphBoundaryTemp, setInsulationGraphBoundaryTemp] =
        useState<number[]>([]);

    return (
        <>
            {simulation.type === 'insulationGraph' && (
                <div className="pl-68 flex flex-col w-full h-full">
                    <div className="p-4 flex-none">
                        <InsulationGraph_Layers
                            config={(simulation as InsulationGraph).config}
                            boundaryTemp={insulationGraphBoundaryTemp}
                        />
                    </div>

                    <div className="p-4 flex-1 w-full">
                        <InsulationGraph_Chart
                            config={(simulation as InsulationGraph).config}
                            setBoundaryTemp={setInsulationGraphBoundaryTemp}
                        />
                    </div>
                </div>
            )}

            {simulation.type === 'insulationSimulation' && (
                <Canvas camera={{ position: [3, 3, 3] }}>
                    <ambientLight intensity={3} />
                    {(simulation as InsulationSimulation).config.showHouse && (
                        <InsulationSimulation_House
                            thickness={
                                (simulation as InsulationSimulation).config
                                    .thickness
                            }
                        />
                    )}
                    <InsulationSimulation_HeatSimulation
                        config={(simulation as InsulationSimulation).config}
                    />
                    <OrbitControls
                        makeDefault
                        target={[0, 0, 0]}
                        enableZoom={true}
                        autoRotate={true}
                        autoRotateSpeed={1}
                    />
                    {(simulation as InsulationSimulation).config.showFps && (
                        <Stats />
                    )}
                    {(simulation as InsulationSimulation).config.showGrid && (
                        <Grid />
                    )}
                </Canvas>
            )}
        </>
    );
}
