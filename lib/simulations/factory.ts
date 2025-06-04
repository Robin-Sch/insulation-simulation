import { ISimulation, SimulationType } from '../constants';
import { InsulationGraph } from './insulationGraph';
import { InsulationSimulation } from './insulationSimulation';

export class SimulationFactory {
    static create(
        type: SimulationType,
        id: string,
        title: string,
        active: boolean
    ): ISimulation {
        switch (type) {
            case 'insulationGraph':
                return new InsulationGraph(id, title, active, {
                    layers: [
                        {
                            material: 'Molded Expanded Polystyrene',
                            thickness: 30,
                        },
                    ],
                    insideTemp: 20,
                    outsideTemp: 10,
                    duration: 60 * 60 * 24,
                    steps: 24,
                });
            case 'insulationSimulation':
                return new InsulationSimulation(id, title, active, {
                    showGrid: false,
                    showFps: false,
                    running: false,
                    material: 'Molded Expanded Polystyrene',
                    thickness: 30,
                    yPlane: 0.7,
                    resolution: 50,
                    houseSize: { width: 1.5, height: 1.5, depth: 1.5 },
                });
            default:
                throw new Error(`Unknown simulation type: ${type}`);
        }
    }
}
