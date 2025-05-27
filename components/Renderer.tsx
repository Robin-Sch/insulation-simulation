import { useEffect, useMemo, useState } from 'react';
import { OrbitControls, Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import Grid from './Grid';
import I2D_Chart from './insulation2d/I2D_Chart';
import I2D_Layers from './insulation2d/I2D_Layers';
import I3D_HeatSimulation from './insulation3d/I3D_HeatSimulation';
import I3D_House from './insulation3d/I3D_House';

import { ISimulation } from '@/lib/constants';
import {
    Insulation2D,
    Insulation2DConfig,
} from '@/lib/simulations/insulation2d';
import { Insulation3D } from '@/lib/simulations/insulation3d';

export default function Renderer({ simulation }: { simulation: ISimulation }) {
    const houseSize = useMemo(
        () => ({ width: 1.5, height: 1.5, depth: 1.5 }),
        []
    );

    const [totalThick, setTotalThick] = useState<number>(0);
    useEffect(() => {
        if (simulation.type === 'insulation2d') {
            const { layers } = simulation.specificConfig as Insulation2DConfig;
            setTotalThick(
                layers.reduce((sum, layer) => sum + layer.thickness / 100, 0)
            );
        }
    }, [simulation.type, simulation.specificConfig]);

    return (
        <>
            {simulation.type === 'insulation2d' && (
                <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
                    <div className="lg:w-1/2 p-4">
                        <Canvas camera={{ position: [totalThick / 2, 0, 1] }}>
                            <ambientLight intensity={3} />
                            <I2D_Layers
                                config={
                                    (simulation as Insulation2D).specificConfig
                                }
                            />
                            <OrbitControls
                                makeDefault
                                target={[totalThick / 2, 0, 0]}
                                enableZoom={true}
                            />
                            {simulation.commonConfig.showFps && <Stats />}
                            {simulation.commonConfig.showGrid && <Grid />}
                        </Canvas>
                    </div>

                    <div className="lg:w-1/2 p-4 h-[500px] lg:h-auto">
                        <I2D_Chart
                            config={(simulation as Insulation2D).specificConfig}
                            running={simulation.commonConfig.running}
                        />
                    </div>
                </div>
            )}

            {simulation.type === 'insulation3d' && (
                <Canvas camera={{ position: [3, 3, 3] }}>
                    <ambientLight intensity={3} />
                    <I3D_House
                        houseSize={houseSize}
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
