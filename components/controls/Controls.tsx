import I2D_Controls from '../insulation2d/I2D_Controls';
import I3D_Controls from '../insulation3d/I3D_Controls';

import { ISimulation } from '@/lib/constants';
import { Insulation2D } from '@/lib/simulations/insulation2d';
import { Insulation3D } from '@/lib/simulations/insulation3d';

export default function Controls({
    simulation,
    onConfigChange,
}: {
    simulation: ISimulation;
    onConfigChange: (updates: Partial<ISimulation['config']>) => void;
}) {
    return (
        <>
            {simulation.type === 'insulation3d' && (
                <I3D_Controls
                    config={(simulation as Insulation3D).config}
                    onConfigChange={onConfigChange}
                />
            )}

            {simulation.type === 'insulation2d' && (
                <I2D_Controls
                    config={(simulation as Insulation2D).config}
                    onConfigChange={onConfigChange}
                />
            )}
        </>
    );
}
