import { InsulationType, ISimulation } from '../constants';

export interface Insulation2DConfig {
    material: InsulationType;
    thickness: number; // cm
}
export class Insulation2D implements ISimulation {
    type = 'insulation2d' as const;

    constructor(
        public id: string,
        public title: string,
        public active: boolean,
        public commonConfig: {
            showGrid: boolean;
            showFps: boolean;
            running: boolean;
        },
        public specificConfig: Insulation2DConfig
    ) {}
}
