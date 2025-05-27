import { InsulationType, ISimulation } from '../constants';

export interface Insulation2DLayer {
    material: InsulationType;
    thickness: number; // cm
}
export interface Insulation2DConfig {
    layers: Insulation2DLayer[];
}
export class Insulation2D implements ISimulation {
    type = 'insulation2d' as const;

    constructor(
        public id: string,
        public title: string,
        public active: boolean,
        public commonConfig: object,
        public specificConfig: Insulation2DConfig
    ) {}
}
