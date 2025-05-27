import { INSULATION_TYPES, InsulationType } from '@/lib/constants';
import { Insulation3DConfig } from '@/lib/simulations/insulation3d';

export default function I3D_Controls({
    config,
    onConfigChange,
}: {
    config: Insulation3DConfig;
    onConfigChange: (updates: Partial<Insulation3DConfig>) => void;
}) {
    const handleConfigChange = <K extends keyof Insulation3DConfig>(
        key: K,
        value: Insulation3DConfig[K]
    ) => {
        onConfigChange({ [key]: value });
    };

    return (
        <>
            <div className="mt-4">
                <button
                    onClick={() =>
                        handleConfigChange('running', !config.running)
                    }
                    className={`${config.running ? 'bg-red-600' : 'bg-blue-600'} ${config.running ? 'hover:bg-red-700' : 'hover:bg-blue-700'} text-white px-4 py-2 rounded`}
                >
                    {config.running ? 'Stop simulation' : 'Start simulation'}
                </button>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                    Insulation Type
                </label>
                <select
                    className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    value={config.material}
                    onChange={(e) =>
                        handleConfigChange(
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
                    <span className="text-sm font-semibold">
                        {config.thickness} cm
                    </span>
                </div>
                <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={config.thickness}
                    onChange={(e) =>
                        handleConfigChange(
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

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">
                        Y height
                    </label>
                    <span className="text-sm font-semibold">
                        {config.yPlane}
                    </span>
                </div>
                <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.1"
                    value={config.yPlane}
                    onChange={(e) =>
                        handleConfigChange('yPlane', parseFloat(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs mt-1">
                    <span>-1</span>
                    <span>1</span>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">
                        Resolution
                    </label>
                    <span className="text-sm font-semibold">
                        {config.resolution}
                    </span>
                </div>
                <input
                    type="range"
                    min="5"
                    max="100"
                    step="1"
                    value={config.resolution}
                    onChange={(e) =>
                        handleConfigChange(
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

            <div
                className="mt-4 p-3 rounded-md"
                style={{
                    backgroundColor: INSULATION_TYPES[config.material].color,
                }}
            >
                <p className="text-sm text-gray-700 font-semibold">
                    {INSULATION_TYPES[config.material].name}
                </p>
                <p className="text-sm text-gray-700">
                    λ={' '}
                    <span className="font-semibold">
                        {INSULATION_TYPES[config.material].conductivity}
                    </span>{' '}
                    W/mK
                </p>
            </div>

            <div className="flex items-center mt-4">
                <input
                    type="checkbox"
                    id="show-grid"
                    checked={config.showGrid}
                    onChange={(e) =>
                        handleConfigChange('showGrid', e.target.checked)
                    }
                    className="h-4 w-4 border-gray-300 rounded"
                />
                <label htmlFor="show-grid" className="ml-2 block text-sm">
                    Show Grid
                </label>
            </div>

            <div className="flex items-center mt-4">
                <input
                    type="checkbox"
                    id="show-fps"
                    checked={config.showFps}
                    onChange={(e) =>
                        handleConfigChange('showFps', e.target.checked)
                    }
                    className="h-4 w-4 border-gray-300 rounded"
                />
                <label htmlFor="show-fps" className="ml-2 block text-sm">
                    Show FPS
                </label>
            </div>
        </>
    );
}
