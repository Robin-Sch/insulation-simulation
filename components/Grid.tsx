import { Vector3 } from 'three';

export default function Grid() {
    return (
        <>
            <gridHelper args={[4, 4]} rotation={[Math.PI / 2, 0, 0]} />
            <gridHelper args={[4, 4]} rotation={[0, Math.PI / 2, 0]} />
            <gridHelper args={[4, 4]} rotation={[0, 0, Math.PI / 2]} />

            <arrowHelper
                args={[new Vector3(1, 0, 0), new Vector3(0, 0, 0), 2, 0xff0000]}
            />
            <arrowHelper
                args={[new Vector3(0, 1, 0), new Vector3(0, 0, 0), 2, 0x00ff00]}
            />
            <arrowHelper
                args={[new Vector3(0, 0, 1), new Vector3(0, 0, 0), 2, 0x0000ff]}
            />
        </>
    );
}
