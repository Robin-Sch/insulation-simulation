import { useEffect, useState } from 'react';

import { getInsulation } from '@/lib/constants';
import { InsulationGraphConfig } from '@/lib/simulations/insulationGraph';

export default function InsulationGraph_Layers({
    config,
    boundaryTemp,
}: {
    config: InsulationGraphConfig;
    boundaryTemp: number[];
}) {
    const [totalThick, setTotalThick] = useState<number>(0.3);
    const layersString = JSON.stringify(config.layers); // used to check if array gets updated

    useEffect(() => {
        setTotalThick(
            config.layers.reduce((sum, layer) => sum + layer.thickness, 0)
        );
    }, [layersString, config.layers]);

    return (
        <div className="flex flex-col">
            <div className="flex h-24 items-center border rounded-md shadow-sm">
                {config.layers.map((layer, i) => {
                    const details = getInsulation(layer.material);
                    const { name, color } = details;
                    const width = (layer.thickness / totalThick) * 100;

                    return (
                        <div
                            key={`layer-${i}`}
                            className={`h-full flex items-center justify-center text-white font-bold border-r border-white relative group`}
                            style={{
                                width: `${width}%`,
                                backgroundColor: color,
                            }}
                            title={`${name} (${width}mm)`}
                        >
                            {/* Layer label */}
                            <span className="text-xs p-1 text-center">
                                {name}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center">
                <div className="h-full flex items-center justify-end text-black font-bold border-r border-white relative group:">
                    <span className="text-xs p-1 text-right">
                        {(boundaryTemp[0] || 0).toFixed(2)}°C
                    </span>
                </div>

                {config.layers.map((layer, i) => {
                    const width = (layer.thickness / totalThick) * 100;
                    const temperature = boundaryTemp[i + 1] || 0;

                    return (
                        <div
                            key={`layer-${i}`}
                            className={`h-full flex items-center justify-end text-black font-bold border-r border-white relative group`}
                            style={{
                                width: `${width}%`,
                            }}
                        >
                            {/* Layer label */}
                            <span className="text-xs p-1 text-right">
                                {temperature.toFixed(2)}°C
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
