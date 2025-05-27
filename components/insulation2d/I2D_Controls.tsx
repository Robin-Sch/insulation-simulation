import { INSULATION_TYPES, InsulationType } from '@/lib/constants';
import {
    Insulation2DConfig,
    Insulation2DLayer,
} from '@/lib/simulations/insulation2d';

export default function I2D_Controls({
    config,
    onConfigChange,
}: {
    config: Insulation2DConfig;
    onConfigChange: (updates: Partial<Insulation2DConfig>) => void;
}) {
    const handleLayerChange = <K extends keyof Insulation2DLayer>(
        index: number,
        key: K,
        value: Insulation2DLayer[K]
    ) => {
        config.layers[index][key] = value;
        onConfigChange({ layers: config.layers });
    };

    const handleLayerAdd = () => {
        const selectedMaterial = document.querySelector<HTMLSelectElement>(
            'select[name="newLayerMaterial"]'
        )?.value as InsulationType;
        const selectedThickness =
            document.querySelector<HTMLInputElement>(
                'input[name="newLayerThickness"]'
            )?.valueAsNumber || 50;

        if (!selectedMaterial) return; // No material selected

        const newLayer: Insulation2DLayer = {
            material: selectedMaterial,
            thickness: selectedThickness,
        };

        onConfigChange({
            layers: [...config.layers, newLayer],
        });
    };

    return (
        <>
            <h2 className="text-xl font-bold mb-4">Add new</h2>
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                    Insulation Type
                </label>
                <select
                    name="newLayerMaterial"
                    defaultValue="Select material"
                    className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                >
                    <option value="" disabled>
                        Select material
                    </option>
                    {Object.keys(INSULATION_TYPES).map((type) => (
                        <option
                            key={type}
                            value={type}
                            className="text-gray-800"
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">
                        Thickness
                    </label>
                    <span className="text-sm font-semibold">50 cm</span>
                </div>
                <input
                    name="newLayerThickness"
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    defaultValue="50"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs mt-1">
                    <span>10cm</span>
                    <span>100cm</span>
                </div>
            </div>

            <button
                onClick={handleLayerAdd}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
                Add
            </button>

            <h2 className="text-xl font-bold mb-4">Modify existing</h2>
            {config.layers.map((layer, i) => (
                <div key={`layer-${i}`}>
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
                </div>
            ))}
        </>
    );
}
