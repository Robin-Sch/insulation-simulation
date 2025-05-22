import React from 'react';

export function House({
  houseSize,
  thickness,
}: {
  houseSize: { width: number; height: number; depth: number };
  thickness: number;
}) {
  return (
    <group>
      <mesh>
        <boxGeometry
          args={[houseSize.width, houseSize.height, houseSize.depth]}
        />
        <meshStandardMaterial
          color="#888888"
          transparent={true}
          depthWrite={false}
          depthTest={false}
          opacity={0.5}
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
          color="#888888"
          transparent={true}
          depthWrite={false}
          depthTest={false}
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}
