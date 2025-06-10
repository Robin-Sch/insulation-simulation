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

function parseTime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor((seconds % 3600) % 60);

    return { h, m, s };
}

function pad(unit: number) {
    return String(unit).padStart(2, '0');
}

export function secondsToHms(seconds: number, short: boolean): string {
    const { h, m, s } = parseTime(seconds);

    if (short) {
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    } else {
        if (seconds === 0) return '0 seconds';
        const hDisplay = h > 0 ? h + (h == 1 ? ' hour ' : ' hours ') : '';
        const mDisplay = m > 0 ? m + (m == 1 ? ' minute ' : ' minutes ') : '';
        const sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
        return hDisplay + mDisplay + sDisplay;
    }
}
