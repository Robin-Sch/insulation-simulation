import React from 'react';

import { INSULATION_TYPES, InsulationType } from '@/lib/constants';

export function House({
  houseSize,
  material,
  thickness,
}: {
  houseSize: { width: number; height: number; depth: number };
  material: InsulationType;
  thickness: number;
}) {
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
    </group>
  );
}
