import { InsulationType, ISimulation } from '../constants';

export interface Insulation2DLayer {
    material: InsulationType;
    thickness: number; // cm
}
export interface Insulation2DConfig {
    layers: Insulation2DLayer[];
    insideTemp: number;
    outsideTemp: number;
    duration: number;
    steps: number;
}
export class Insulation2D implements ISimulation {
    type = 'insulation2d' as const;

    constructor(
        public id: string,
        public title: string,
        public active: boolean,
        public config: Insulation2DConfig
    ) {}
}

export function secondsToHms(d: number): string {
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);

    const hDisplay = h > 0 ? h + (h == 1 ? ' hour ' : ' hours ') : '';
    const mDisplay = m > 0 ? m + (m == 1 ? ' minute ' : ' minutes ') : '';
    const sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
    return hDisplay + mDisplay + sDisplay;
}
