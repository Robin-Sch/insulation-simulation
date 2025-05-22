import React from 'react';

import { INSULATION_TYPES, InsulationType } from '@/lib/constants';
import { HeatSimulation } from './HeatSimulation';

export function House({
  yPlane,
  material,
  thickness,
  resolution,
}: {
  yPlane: number;
  material: InsulationType;
  thickness: number;
  resolution: number;
}) {
  const houseSize = { width: 1.5, height: 1.5, depth: 1.5 };
  const insulationProps = INSULATION_TYPES[material];

  return (
    <group>
      <mesh>
        <boxGeometry
          args={[houseSize.width, houseSize.height, houseSize.depth]}
        />
        <meshStandardMaterial
          color="#ffffff"
          transparent={true}
          opacity={0.5}
          roughness={0.8}
        />
      </mesh>

      <mesh>
        <boxGeometry
          args={[
            houseSize.width + thickness / 100,
            houseSize.height + thickness / 100,
            houseSize.depth + thickness / 100,
          ]}
        />
        <meshStandardMaterial
          color={insulationProps.color}
          transparent={true}
          opacity={0.5}
          roughness={0.2}
        />
      </mesh>

      <HeatSimulation
        yPlane={yPlane}
        houseSize={houseSize}
        insulationConductivity={insulationProps.conductivity}
        insulationThickness={thickness}
        resolution={resolution}
      />
    </group>
  );
}
