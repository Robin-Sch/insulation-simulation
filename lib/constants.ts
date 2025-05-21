export const INSULATION_TYPES = {
  fiberglass: { color: '#4a90e2', conductivity: 0.04 },
  cellulose: { color: '#8b4513', conductivity: 0.05 },
  foam: { color: '#ff69b4', conductivity: 0.03 },
};

export type InsulationMaterial = 'fiberglass' | 'cellulose' | 'foam';
