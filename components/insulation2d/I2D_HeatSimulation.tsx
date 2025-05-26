import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import {
    BufferAttribute,
    BufferGeometry,
    DoubleSide,
    Mesh,
    PlaneGeometry,
} from 'three';

import { INSULATION_TYPES } from '@/lib/constants';
import { Insulation2DConfig } from '@/lib/simulations/insulation2d';

export default function I2D_HeatSimulation({
    config,
    running,
}: {
    config: Insulation2DConfig;
    running: boolean;
}) {
    const meshRef = useRef<Mesh>(null);
    const [heatData, setHeatData] = useState<number[]>([]);
    const [cumThick, setCumThick] = useState<number[]>([]); // Cumulative thickness
    const [size, setSize] = useState<number>(0); // Size (total thickness)
    const heatIntensity = 1;

    // Determine conductivity at a specific grid point
    const getConductivityAtPoint = (x: number): number => {
        // Convert grid coordinates to world coordinates
        const worldX = (x / config.resolution) * size - size / 2;
        const layerIndex = cumThick.findLastIndex((t) => worldX < t);

        if (layerIndex < 0) return 0;
        const layer = config.layers[layerIndex];
        return INSULATION_TYPES[layer.material].conductivity;
    };

    useFrame(() => {
        if (!meshRef.current || heatData.length === 0) return;

        if (running) {
            const newData = [...heatData];

            for (let x = 1; x < config.resolution - 1; x++) {
                const k = getConductivityAtPoint(x);

                const dT_left = heatData[x] - heatData[x + 1];
                const dT_right = heatData[x] - heatData[x - 1];
                const dT = dT_left + dT_right;
                const dX = size;

                // -k * deltaT / deltaX
                newData[x] = (-k * dT) / dX + newData[x];
            }
            setHeatData(newData);
        }

        // Update visualization
        const geometry = meshRef.current.geometry as BufferGeometry;
        const colorAttribute = geometry.attributes.color;

        if (!colorAttribute) return;
        const colors = colorAttribute.array as Float32Array;

        for (let x = 0; x < config.resolution; x++) {
            // Set color (blue to red gradient)
            colors[x] = heatData[x]; // R
            colors[x + 1] = 0; // G
            colors[x + 2] = 1 - heatData[x]; // B
        }

        colorAttribute.needsUpdate = true;
    });

    // Initialize geometry & Heat source
    useEffect(() => {
        if (!meshRef.current) return;

        // Compute the cumulative thicknesses
        const array: number[] = [];
        for (const layer of config.layers) {
            const length = array.length;
            const previous = length > 0 ? array[length - 1] : 0;
            const cumValue = previous + layer.thickness / 100;
            array.push(cumValue);
        }
        setCumThick(array);
        setSize(array[array.length - 1]);
        console.log(array[array.length - 1]);

        const geometry = new PlaneGeometry(
            array[array.length - 1],
            0.3,
            config.resolution - 1,
            1
        );

        // Add color attribute
        const colors = new Float32Array(config.resolution * 3);
        geometry.setAttribute('color', new BufferAttribute(colors, 3));

        meshRef.current.geometry = geometry;

        // Heat source is heatIntensity, rest is 0
        const data: number[] = new Array(config.resolution).fill(0);
        data[0] = heatIntensity;

        setHeatData(data);
    }, [config.resolution, config.layers]);

    return (
        <>
            <mesh ref={meshRef} position={[size / 2, 0, 0.001]}>
                <meshStandardMaterial
                    vertexColors
                    side={DoubleSide}
                    transparent={true}
                    opacity={0.7}
                />
            </mesh>
        </>
    );
}
