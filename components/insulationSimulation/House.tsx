import { useMemo } from 'react';

export default function InsulationSimulation_House({
    thickness,
}: {
    thickness: number;
}) {
    const houseSize = useMemo(
        () => ({ width: 1.5, height: 1.5, depth: 1.5 }),
        []
    );
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
