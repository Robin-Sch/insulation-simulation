import { useEffect, useMemo } from 'react';

import I2D_Layers from './insulation2d/I2D_Layers';
import I3D_HeatSimulation from './insulation3d/I3D_HeatSimulation';
import I3D_House from './insulation3d/I3D_House';

import { ISimulation } from '@/lib/constants';
import {
    Insulation2D,
    Insulation2DConfig,
} from '@/lib/simulations/insulation2d';
import { Insulation3D } from '@/lib/simulations/insulation3d';
import I2D_HeatSimulation from './insulation2d/I2D_HeatSimulation';

export default function Renderer({
    simulation,
    setCameraSettings,
}: {
    simulation: ISimulation;
    setCameraSettings: (settings: {
        position: [number, number, number];
        lookAt: [number, number, number];
        enableZoom: boolean;
        autoRotate: boolean;
        autoRotateSpeed: number;
    }) => void;
}) {
    const houseSize = useMemo(
        () => ({ width: 1.5, height: 1.5, depth: 1.5 }),
        []
    );

    useEffect(() => {
        if (simulation.type === 'insulation3d')
            setCameraSettings({
                position: [3, 3, 3],
                lookAt: [0, 0, 0],
                enableZoom: true,
                autoRotate: true,
                autoRotateSpeed: 1,
            });
        else if (simulation.type === 'insulation2d') {
            const totalThick = (
                simulation.specificConfig as Insulation2DConfig
            ).layers.reduce((sum, layer) => sum + layer.thickness / 100, 0);

            setCameraSettings({
                position: [totalThick / 2, 0, 1],
                lookAt: [totalThick / 2, 0, 0],
                enableZoom: true,
                autoRotate: false,
                autoRotateSpeed: 0,
            });
        }
    }, [setCameraSettings, simulation.type, simulation.specificConfig]);

    return (
        <>
            {simulation.type === 'insulation3d' && (
                <>
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
                </>
            )}

            {simulation.type === 'insulation2d' && (
                <>
                    <I2D_Layers
                        config={(simulation as Insulation2D).specificConfig}
                    />
                    <I2D_HeatSimulation
                        config={(simulation as Insulation2D).specificConfig}
                        running={simulation.commonConfig.running}
                    />
                </>
            )}
        </>
    );
}
