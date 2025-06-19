export const INSULATION_TYPES = [
    {
        name: 'Cellulose Pulp',
        color: '#8FA9FD', // Light blue-purpleish
        conductivity: 0.06,
    },
    {
        name: 'Molded Expanded Polystyrene',
        color: '#1E88E5', // Bright blue
        conductivity: 0.046, // Average of 0.037–0.055
    },
    {
        name: 'Extruded Expanded Polystyrene',
        color: '#43A047', // Green
        conductivity: 0.037,
    },
    {
        name: 'Mineral Wool',
        color: '#E53935', // Red
        conductivity: 0.043, // Average of 0.040–0.045
    },
    {
        name: 'Granules of Clay/Vermiculite/Perlite',
        color: '#795548', // Brown
        conductivity: 0.11, // Average of 0.060–0.160
    },
    {
        name: 'Air Gap',
        color: '#80DEEA', // Light blue
        conductivity: 0.333,
    },
    {
        name: 'Ceramic Brick',
        color: '#BF360C', // Deep orange
        conductivity: 0.427, // Average of 0.407–0.446
    },
    {
        name: 'Concrete Block',
        color: '#9E9E9E', // Gray
        conductivity: 0.81,
    },
    {
        name: 'Woven Fabric Waste',
        color: '#7B1FA2', // Purple
        conductivity: 0.044,
    },
    {
        name: 'Woven Fabric Subwaste',
        color: '#AB47BC', // Light purple
        conductivity: 0.103,
    },
    {
        name: 'Cellulose (Blown)',
        color: '#5D4037', // Dark brown
        conductivity: 0.04,
    },
    {
        name: 'Cellulose (Spray)',
        color: '#00695C', // Deep teal
        conductivity: 0,
    },
    {
        name: 'PET Flakes/Fibers',
        color: '#00897B', // Teal
        conductivity: 0.195, // Average of 0.15–0.24
    },
] as const;
export type InsulationType = (typeof INSULATION_TYPES)[number]['name'];

export function getInsulation(name: InsulationType) {
    const details = INSULATION_TYPES.find((type) => type.name === name);
    if (details) return details;
    else
        return {
            short: 'unknown',
            name: 'unknown',
            color: '#FFFFFF',
            conductivity: 1,
        };
}

export const airConductivity = 0.25;

export type SimulationType = 'insulationGraph' | 'insulationSimulation';
export interface CommonConfig {
    showGrid?: boolean;
    showFps?: boolean;
    running?: boolean;
}
export interface ISimulation {
    id: string;
    title: string;
    active: boolean;
    type: SimulationType;
    config: unknown;
}
