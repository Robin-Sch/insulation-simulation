import React from "react";

import { HeatSimulation } from "./HeatSimulation";
import { INSULATION_TYPES, InsulationMaterial } from "@/lib/constants";

export function House({
  material,
  thickness,
}: {
  material: InsulationMaterial;
  thickness: number;
}) {
  const houseSize = { width: 2, height: 2, depth: 2 };
  const insulationProps = INSULATION_TYPES[material];

  return (
    <group>
      <mesh>
        <boxGeometry
          args={[houseSize.width, houseSize.height, houseSize.depth]}
        />
        <meshStandardMaterial color="#ff0000" roughness={0.8} />
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

      <HeatSimulation conductivity={insulationProps.conductivity} />
    </group>
  );
}
