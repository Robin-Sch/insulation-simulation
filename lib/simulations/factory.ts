import { ISimulation, SimulationType } from '../constants';
import { Insulation2D } from './insulation2d';
import { Insulation3D } from './insulation3d';

export class SimulationFactory {
    static create(
        type: SimulationType,
        id: string,
        title: string
    ): ISimulation {
        switch (type) {
            case 'insulation3d':
                return new Insulation3D(
                    id,
                    title,
                    true,
                    {
                        showGrid: false,
                        showFps: false,
                        running: false,
                    },
                    {
                        material: 'eps',
                        thickness: 30,
                        yPlane: 0.7,
                        resolution: 50,
                        houseSize: { width: 1.5, height: 1.5, depth: 1.5 },
                    }
                );
            case 'insulation2d':
                return new Insulation2D(
                    id,
                    title,
                    true,
                    {},
                    {
                        layers: [
                            {
                                material: 'eps',
                                thickness: 30,
                            },
                        ],
                        resolution: 50,
                    }
                );
            default:
                throw new Error(`Unknown simulation type: ${type}`);
        }
    }
}
