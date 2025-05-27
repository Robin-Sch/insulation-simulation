import { useState } from 'react';
import { OrbitControls, Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import Grid from './Grid';
import I2D_Chart from './insulation2d/I2D_Chart';
import I2D_Layers from './insulation2d/I2D_Layers';
import I3D_HeatSimulation from './insulation3d/I3D_HeatSimulation';
import I3D_House from './insulation3d/I3D_House';

import { ISimulation } from '@/lib/constants';
import { Insulation2D } from '@/lib/simulations/insulation2d';
import { Insulation3D } from '@/lib/simulations/insulation3d';

export default function Renderer({ simulation }: { simulation: ISimulation }) {
    const [insulation2dBoundaryTemp, setInsulation2dBoundaryTemp] = useState<
        number[]
    >([]);

    return (
        <>
            {simulation.type === 'insulation2d' && (
                <div className="pl-68 flex flex-col w-full">
                    <div className="p-4">
                        <I2D_Layers
                            config={(simulation as Insulation2D).specificConfig}
                            boundaryTemp={insulation2dBoundaryTemp}
                        />
                    </div>

                    <div className="p-4 w-full h-full">
                        <I2D_Chart
                            config={(simulation as Insulation2D).specificConfig}
                            setBoundaryTemp={setInsulation2dBoundaryTemp}
                        />
                    </div>
                </div>
            )}

            {simulation.type === 'insulation3d' && (
                <Canvas camera={{ position: [3, 3, 3] }}>
                    <ambientLight intensity={3} />
                    <I3D_House
                        thickness={
                            (simulation as Insulation3D).specificConfig
                                .thickness
                        }
                    />
                    <I3D_HeatSimulation
                        config={(simulation as Insulation3D).specificConfig}
                        running={simulation.commonConfig.running}
                    />
                    <OrbitControls
                        makeDefault
                        target={[0, 0, 0]}
                        enableZoom={true}
                        autoRotate={true}
                        autoRotateSpeed={1}
                    />
                    {simulation.commonConfig.showFps && <Stats />}
                    {simulation.commonConfig.showGrid && <Grid />}
                </Canvas>
            )}
        </>
    );
}
