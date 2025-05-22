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
  const size = 5; // Size of the plane
  const heatIntensity = 5;

  // Determine conductivity at a specific grid point
  const getConductivityAtPoint = (x: number, z: number): number => {
    // Convert grid coordinates to world coordinates
    const worldX = (x / resolution) * size - size / 2;
    const worldZ = (z / resolution) * size - size / 2;

    // If inside house
    const halfWidth = houseSize.width / 2;
    const halfHeight = houseSize.height / 2;
    const halfDepth = houseSize.depth / 2;
    if (
      -halfWidth <= worldX &&
      worldX <= halfWidth &&
      -halfDepth <= yPlane &&
      yPlane <= halfDepth &&
      -halfHeight <= worldZ &&
      worldZ <= halfHeight
    ) {
      return airConductivity;
    }

    // If inside insulation
    const insulationWidth = halfWidth + insulationThickness / 2 / 100;
    const insulationHeight = halfHeight + insulationThickness / 2 / 100;
    const insulationDepth = halfDepth + insulationThickness / 2 / 100;
    if (
      -insulationWidth <= worldX &&
      worldX <= insulationWidth &&
      -insulationDepth <= yPlane &&
      yPlane <= insulationDepth &&
      -insulationHeight <= worldZ &&
      worldZ <= insulationHeight
    ) {
      return insulationConductivity;
    }

    // Otherwise it's outside
    return airConductivity;
  };

  // Initialize heat data with central heat source
  useEffect(() => {
    setIC(INSULATION_TYPES[insulationMaterial].conductivity);

    const data: number[][] = [];
    const centerX = Math.floor(resolution / 2);
    const centerZ = Math.floor(resolution / 2);

    for (let x = 0; x < resolution; x++) {
      data[x] = [];
      for (let z = 0; z < resolution; z++) {
        // Set heat source in center
        if (x === centerX && z === centerZ) {
          data[x][z] = heatIntensity;
        } else {
          data[x][z] = 0; // Cold everywhere else
        }
      }
    }
    setHeatData(data);
  }, [yPlane, insulationMaterial, insulationThickness, resolution]);

  // Solve heat equation with central source
  useFrame(() => {
    if (!meshRef.current || heatData.length === 0 || !enabled) return;

    const newData = heatData.map((row) => [...row]);
    const centerX = Math.floor(resolution / 2);
    const centerZ = Math.floor(resolution / 2);

    // Diffuse heat from center
    for (let x = 1; x < resolution - 1; x++) {
      for (let z = 1; z < resolution - 1; z++) {
        // Skip the center point (constant heat source)
        if (x === centerX && z === centerZ) continue;

        const conductivity = getConductivityAtPoint(x, z);

        newData[x][z] =
          conductivity *
            (heatData[x + 1][z] +
              heatData[x - 1][z] +
              heatData[x][z + 1] +
              heatData[x][z - 1] -
              4 * heatData[x][z]) +
          heatData[x][z];
      }
    }

    setHeatData(newData);

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
        colors[idx] = newData[x][z]; // R
        colors[idx + 1] = 0; // G
        colors[idx + 2] = 1 - newData[x][z]; // B
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
