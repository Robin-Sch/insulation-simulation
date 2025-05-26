import { useMemo } from 'react';

import I3D_HeatSimulation from './insulation3d/I3D_HeatSimulation';
import I3D_House from './insulation3d/I3D_House';

import { ISimulation } from '@/lib/constants';
import { Insulation3D } from '@/lib/simulations/insulation3d';

export default function Renderer({ simulation }: { simulation: ISimulation }) {
    const houseSize = useMemo(
        () => ({ width: 1.5, height: 1.5, depth: 1.5 }),
        []
    );

    switch (simulation.type) {
        case 'insulation3d':
            return (
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
            );
        case 'insulation2d':
            return (
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
            );
        default:
            return null;
    }
}
