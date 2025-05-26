import { INSULATION_TYPES } from '@/lib/constants';
import { Insulation2DConfig } from '@/lib/simulations/insulation2d';

export default function I2D_Layers({ config }: { config: Insulation2DConfig }) {
    let currentX = 0;

    return (
        <>
            {config.layers.map((layer, i) => {
                const xPosition = currentX + layer.thickness / 100 / 2;
                currentX += layer.thickness / 100;
                return (
                    <mesh key={`layer-${i}`} position={[xPosition, 0, 0]}>
                        <planeGeometry args={[layer.thickness / 100, 1]} />
                        <meshStandardMaterial
                            color={INSULATION_TYPES[layer.material].color}
                        />
                    </mesh>
                );
            })}
        </>
    );
}
