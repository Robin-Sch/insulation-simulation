import I3D_Controls from './insulation3d/I3D_Controls';

import { CommonConfig, ISimulation } from '@/lib/constants';
import { Insulation3D } from '@/lib/simulations/insulation3d';

export default function Controls({
    simulation,
    onCommonChange,
    onSpecificChange,
}: {
    simulation: ISimulation;
    onCommonChange: (updates: Partial<CommonConfig>) => void;
    onSpecificChange: (updates: Partial<ISimulation['specificConfig']>) => void;
}) {
    switch (simulation.type) {
        case 'insulation3d':
            return (
                <I3D_Controls
                    commonConfig={(simulation as Insulation3D).commonConfig}
                    specificConfig={(simulation as Insulation3D).specificConfig}
                    onCommonChange={onCommonChange}
                    onSpecificChange={onSpecificChange}
                />
            );
        case 'insulation2d':
            return (
                <I3D_Controls
                    commonConfig={(simulation as Insulation3D).commonConfig}
                    specificConfig={(simulation as Insulation3D).specificConfig}
                    onCommonChange={onCommonChange}
                    onSpecificChange={onSpecificChange}
                />
            );
        default:
            return null;
    }
}
