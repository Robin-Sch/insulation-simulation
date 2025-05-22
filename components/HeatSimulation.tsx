import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Mesh,
  PlaneGeometry,
} from 'three';
import { airConductivity } from '@/lib/constants';

export function HeatSimulation({
  houseSize,
  insulationConductivity,
  insulationThickness,
}: {
  houseSize: { width: number; height: number; depth: number };
  insulationConductivity: number;
  insulationThickness: number;
}) {
  const meshRef = useRef<Mesh>(null);
  const [heatData, setHeatData] = useState<number[][]>([]);
  const size = 5; // Size of the plane
  const resolution = 30; // Grid resolution
  const heatIntensity = 5;

  // Determine conductivity at a specific grid point
  const getConductivityAtPoint = (x: number, y: number, z: number): number => {
    // Convert grid coordinates to world coordinates
    const worldX = (x / resolution) * size - size / 2;
    const worldY = (y / resolution) * size - size / 2;
    const worldZ = (z / resolution) * size - size / 2;

    // If inside house
    const halfWidth = houseSize.width / 2;
    const halfHeight = houseSize.height / 2;
    const halfDepth = houseSize.depth / 2;
    if (
      -halfWidth <= worldX &&
      worldX <= halfWidth &&
      -halfHeight <= worldY &&
      worldY <= halfHeight &&
      -halfDepth <= worldZ &&
      worldZ <= halfDepth
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
      -insulationHeight <= worldY &&
      worldY <= insulationHeight &&
      -insulationDepth <= worldZ &&
      worldZ <= insulationDepth
    ) {
      return insulationConductivity;
    }

    // Otherwise it's outside
    return airConductivity;
  };

  // Initialize heat data with central heat source
  useEffect(() => {
    const data: number[][] = [];
    const centerX = Math.floor(resolution / 2);
    const centerY = Math.floor(resolution / 2);

    for (let x = 0; x < resolution; x++) {
      data[x] = [];
      for (let y = 0; y < resolution; y++) {
        // Set heat source in center
        if (x === centerX && y === centerY) {
          data[x][y] = heatIntensity;
        } else {
          data[x][y] = 0; // Cold everywhere else
        }
      }
    }
    setHeatData(data);
  }, [insulationConductivity, insulationThickness, heatIntensity]);

  // Solve heat equation with central source
  useFrame(() => {
    if (!meshRef.current || heatData.length === 0) return;

    const newData = heatData.map((row) => [...row]);
    const centerX = Math.floor(resolution / 2);
    const centerY = Math.floor(resolution / 2);

    // Keep center at constant heat
    newData[centerX][centerY] = heatIntensity;

    // Diffuse heat from center
    for (let x = 1; x < resolution - 1; x++) {
      for (let y = 1; y < resolution - 1; y++) {
        // Skip the center point (constant heat source)
        if (x === centerX && y === centerY) continue;

        const conductivity = getConductivityAtPoint(x, y, resolution / 2);

        newData[x][y] =
          conductivity *
            (heatData[x + 1][y] +
              heatData[x - 1][y] +
              heatData[x][y + 1] +
              heatData[x][y - 1] -
              4 * heatData[x][y]) +
          heatData[x][y];
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
      for (let y = 0; y < resolution; y++) {
        const idx = (x * resolution + y) * 3;

        // Set color (blue to red gradient)
        colors[idx] = newData[x][y]; // R
        colors[idx + 1] = 0; // G
        colors[idx + 2] = 1 - newData[x][y]; // B
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
  }, []);

  return (
    <>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial
          vertexColors
          side={DoubleSide}
          wireframe={false}
        />
      </mesh>
    </>
  );
}
