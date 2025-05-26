import { InsulationType, ISimulation } from '../constants';

export interface Insulation3DConfig {
    material: InsulationType;
    thickness: number; // cm
    yPlane: number;
    resolution: number;
    houseSize: { width: number; height: number; depth: number };
}
export class Insulation3D implements ISimulation {
    type = 'insulation3d' as const;

    constructor(
        public id: string,
        public title: string,
        public active: boolean,
        public commonConfig: {
            showGrid: boolean;
            showFps: boolean;
            running: boolean;
        },
        public specificConfig: Insulation3DConfig
    ) {}
}
