import { InsulationType, ISimulation } from '../constants';

export interface InsulationSimulationConfig {
    showGrid: boolean;
    showFps: boolean;
    running: boolean;
    material: InsulationType;
    thickness: number; // cm
    yPlane: number;
    resolution: number;
    houseSize: { width: number; height: number; depth: number };
}
export class InsulationSimulation implements ISimulation {
    type = 'insulationSimulation' as const;

    constructor(
        public id: string,
        public title: string,
        public active: boolean,
        public config: InsulationSimulationConfig
    ) {}
}
