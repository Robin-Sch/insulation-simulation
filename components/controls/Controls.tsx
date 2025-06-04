import InsulationGraph_Controls from '../insulationGraph/Controls';
import InsulationSimulation_Controls from '../insulationSimulation/Controls';

import { ISimulation } from '@/lib/constants';
import { InsulationGraph } from '@/lib/simulations/insulationGraph';
import { InsulationSimulation } from '@/lib/simulations/insulationSimulation';

export default function Controls({
    simulation,
    onConfigChange,
}: {
    simulation: ISimulation;
    onConfigChange: (updates: Partial<ISimulation['config']>) => void;
}) {
    return (
        <>
            {simulation.type === 'insulationGraph' && (
                <InsulationGraph_Controls
                    config={(simulation as InsulationGraph).config}
                    onConfigChange={onConfigChange}
                />
            )}

            {simulation.type === 'insulationSimulation' && (
                <InsulationSimulation_Controls
                    config={(simulation as InsulationSimulation).config}
                    onConfigChange={onConfigChange}
                />
            )}
        </>
    );
}
