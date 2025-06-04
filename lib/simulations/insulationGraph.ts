import { InsulationType, ISimulation } from '../constants';

export interface InsulationGraphLayer {
    material: InsulationType;
    thickness: number; // cm
}
export interface InsulationGraphConfig {
    layers: InsulationGraphLayer[];
    insideTemp: number;
    outsideTemp: number;
    duration: number;
    steps: number;
}
export class InsulationGraph implements ISimulation {
    type = 'insulationGraph' as const;

    constructor(
        public id: string,
        public title: string,
        public active: boolean,
        public config: InsulationGraphConfig
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
