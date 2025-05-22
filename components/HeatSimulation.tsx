import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Mesh,
  PlaneGeometry,
} from 'three';

import {
  airConductivity,
  INSULATION_TYPES,
  InsulationType,
} from '@/lib/constants';

function insideHouse(
  x: number,
  y: number,
  z: number,
  houseSize: { width: number; height: number; depth: number }
) {
  const w = houseSize.width / 2;
  const h = houseSize.height / 2;
  const d = houseSize.depth / 2;
  // -w <= x <= w && -h <= y <= h && -d <= z <= d
  // makes sure x, y and z coordinates are within the cube
  return -w <= x && x <= w && -h <= y && y <= h && -d <= z && z <= d;
}

function insideHouseOrInsulation(
  x: number,
  y: number,
  z: number,
  houseSize: { width: number; height: number; depth: number },
  thickness: number
) {
  const w = houseSize.width / 2 + thickness / 2 / 100;
  const h = houseSize.height / 2 + thickness / 2 / 100;
  const d = houseSize.depth / 2 + thickness / 2 / 100;
  // -w <= x <= w && -h <= y <= h && -d <= z <= d
  // makes sure x, y and z coordinates are within the insulation cube
  return -w <= x && x <= w && -d <= y && y <= d && -h <= z && z <= h;
}

export function HeatSimulation({
  houseSize,
  yPlane,
  insulationMaterial,
  insulationThickness,
  resolution,
  enabled,
}: {
  houseSize: { width: number; height: number; depth: number };
  yPlane: number;
  insulationMaterial: InsulationType;
  insulationThickness: number;
  resolution: number;
  enabled: boolean;
}) {
  const meshRef = useRef<Mesh>(null);
  const [heatData, setHeatData] = useState<number[][]>([]);
  const [insulationConductivity, setIC] = useState<number>(0);
  const size = 4; // Size of the plane
  const heatIntensity = 1;

  // Determine conductivity at a specific grid point
  const getConductivityAtPoint = (x: number, z: number): number => {
    // Convert grid coordinates to world coordinates
    const worldX = (x / resolution) * size - size / 2;
    const worldZ = (z / resolution) * size - size / 2;

    if (insideHouse(worldX, yPlane, worldZ, houseSize)) return airConductivity;

    if (
      insideHouseOrInsulation(
        worldX,
        yPlane,
        worldZ,
        houseSize,
        insulationThickness
      )
    ) {
      return insulationConductivity;
    }

    // Otherwise it's outside
    return airConductivity;
  };

  useFrame(() => {
    if (!meshRef.current || heatData.length === 0) return;

    if (enabled) {
      const newData = heatData.map((row) => [...row]);

      for (let x = 1; x < resolution - 1; x++) {
        for (let z = 1; z < resolution - 1; z++) {
          const k = getConductivityAtPoint(x, z);

          const dT_up = heatData[x][z] - heatData[x + 1][z];
          const dT_down = heatData[x][z] - heatData[x - 1][z];
          const dT_left = heatData[x][z] - heatData[x][z + 1];
          const dT_right = heatData[x][z] - heatData[x][z - 1];
          const dT = dT_up + dT_down + dT_left + dT_right;
          const dX = size;

          // -k * deltaT / deltaX
          newData[x][z] = (-k * dT) / dX + heatData[x][z];
        }
      }

      setHeatData(newData);
    }

    // Update visualization
    const geometry = meshRef.current.geometry as BufferGeometry;
    const positionAttribute = geometry.attributes.position;
    const colorAttribute = geometry.attributes.color;

    if (!positionAttribute || !colorAttribute) return;
    const colors = colorAttribute.array as Float32Array;

    for (let x = 0; x < resolution; x++) {
      for (let z = 0; z < resolution; z++) {
        const idx = (x * resolution + z) * 3;

        // Set color (blue to red gradient)
        colors[idx] = heatData[x][z]; // R
        colors[idx + 1] = 0; // G
        colors[idx + 2] = 1 - heatData[x][z]; // B
      }
    }

    positionAttribute.needsUpdate = true;
    colorAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  // Initialize geometry
  useEffect(() => {
    if (!meshRef.current) return;

    const geometry = new PlaneGeometry(
      size,
      size,
      resolution - 1,
      resolution - 1
    );

    // Add color attribute
    const colors = new Float32Array(resolution * resolution * 3);
    geometry.setAttribute('color', new BufferAttribute(colors, 3));

    meshRef.current.geometry = geometry;
  }, [resolution]);

  // Initialize heat data with central heat source
  useEffect(() => {
    setIC(INSULATION_TYPES[insulationMaterial].conductivity);
    // resolution x resolution array with 0's
    const data: number[][] = new Array(resolution)
      .fill(0)
      .map(() => new Array(resolution).fill(0));

    for (let x = 0; x < resolution; x++) {
      for (let z = 0; z < resolution; z++) {
        // Convert grid coordinates to world coordinates
        const worldX = (x / resolution) * size - size / 2;
        const worldZ = (z / resolution) * size - size / 2;

        if (insideHouse(worldX, yPlane, worldZ, houseSize))
          data[x][z] = heatIntensity;
        else if (
          insideHouseOrInsulation(
            worldX,
            yPlane,
            worldZ,
            houseSize,
            insulationThickness
          )
        ) {
          data[x][z] = heatIntensity * 0.5; // TODO: use some kind of gradient
        }
      }
    }
    setHeatData(data);
  }, [houseSize, yPlane, insulationMaterial, insulationThickness, resolution]);

  return (
    <>
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, yPlane, 0]}
      >
        <meshStandardMaterial
          vertexColors
          side={DoubleSide}
          wireframe={false}
        />
      </mesh>
    </>
  );
}
