import { INSULATION_TYPES, InsulationType } from '@/lib/constants';
import {
    Insulation2DConfig,
    Insulation2DLayer,
} from '@/lib/simulations/insulation2d';

export default function I2D_Controls({
    specificConfig,
    onSpecificChange,
}: {
    specificConfig: Insulation2DConfig;
    onSpecificChange: (updates: Partial<Insulation2DConfig>) => void;
}) {
    const handleSpecificChange = <K extends keyof Insulation2DConfig>(
        key: K,
        value: Insulation2DConfig[K]
    ) => {
        onSpecificChange({ [key]: value });
    };

    const handleLayerChange = <K extends keyof Insulation2DLayer>(
        index: number,
        key: K,
        value: Insulation2DLayer[K]
    ) => {
        console.log(index, key, value);
    };

    return (
        <>
            {specificConfig.layers.map((layer, i) => {
                <>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Insulation Type
                        </label>
                        <select
                            className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            value={layer.material}
                            onChange={(e) =>
                                handleLayerChange(
                                    i,
                                    'material',
                                    e.target.value as InsulationType
                                )
                            }
                        >
                            {Object.keys(INSULATION_TYPES).map((type) => (
                                <option
                                    key={type}
                                    value={type}
                                    className="text-gray-800"
                                >
                                    {type.charAt(0).toUpperCase() +
                                        type.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium">
                                Thickness
                            </label>
                            <span className="text-sm font-semibold">
                                {layer.thickness} cm
                            </span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            step="5"
                            value={layer.thickness}
                            onChange={(e) =>
                                handleLayerChange(
                                    i,
                                    'thickness',
                                    parseFloat(e.target.value)
                                )
                            }
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs mt-1">
                            <span>10cm</span>
                            <span>100cm</span>
                        </div>
                    </div>
                </>;
            })}

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">
                        Resolution
                    </label>
                    <span className="text-sm font-semibold">
                        {specificConfig.resolution}
                    </span>
                </div>
                <input
                    type="range"
                    min="5"
                    max="100"
                    step="1"
                    value={specificConfig.resolution}
                    onChange={(e) =>
                        handleSpecificChange(
                            'resolution',
                            parseFloat(e.target.value)
                        )
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs mt-1">
                    <span>5</span>
                    <span>100</span>
                </div>
            </div>
        </>
    );
}
