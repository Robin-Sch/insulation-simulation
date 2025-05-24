import { INSULATION_TYPES } from './constants';

export type InsulationType = keyof typeof INSULATION_TYPES;

export interface ISimulation {
  id: string;
  title: string;
  active: boolean;
  type: SimulationType;
  commonConfig: {
    grid: boolean;
    enabled: boolean;
  };
  specificConfig: unknown; // Will be typed per simulation
}

export type SimulationType = 'insulation-3d' | 'insulation-2d';
