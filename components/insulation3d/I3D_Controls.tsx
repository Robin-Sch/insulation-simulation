import {
    CommonConfig,
    INSULATION_TYPES,
    InsulationType,
} from '@/lib/constants';
import { Insulation3DConfig } from '@/lib/simulations/insulation3d';

interface I3D_ControlsProps {
    commonConfig: CommonConfig;
    specificConfig: Insulation3DConfig;
    onCommonChange: (updates: Partial<CommonConfig>) => void;
    onSpecificChange: (updates: Partial<Insulation3DConfig>) => void;
}

export default function I3D_Controls({
    commonConfig,
    specificConfig,
    onCommonChange,
    onSpecificChange,
}: I3D_ControlsProps) {
    const handleCommonChange = <K extends keyof CommonConfig>(
        key: K,
        value: CommonConfig[K]
    ) => {
        onCommonChange({ [key]: value });
    };

    const handleSpecificChange = <K extends keyof Insulation3DConfig>(
        key: K,
        value: Insulation3DConfig[K]
    ) => {
        onSpecificChange({ [key]: value });
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Controls</h2>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                    Insulation Type
                </label>
                <select
                    className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    value={specificConfig.material}
                    onChange={(e) =>
                        handleSpecificChange(
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
                        {specificConfig.thickness} cm
                    </span>
                </div>
                <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={specificConfig.thickness}
                    onChange={(e) =>
                        handleSpecificChange(
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
                        {specificConfig.yPlane}
                    </span>
                </div>
                <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.1"
                    value={specificConfig.yPlane}
                    onChange={(e) =>
                        handleSpecificChange(
                            'yPlane',
                            parseFloat(e.target.value)
                        )
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

            <div className="flex items-center mt-4">
                <input
                    type="checkbox"
                    id="show-grid"
                    checked={commonConfig.showGrid}
                    onChange={(e) =>
                        handleCommonChange('showGrid', e.target.checked)
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
                    checked={commonConfig.showFps}
                    onChange={(e) =>
                        handleCommonChange('showFps', e.target.checked)
                    }
                    className="h-4 w-4 border-gray-300 rounded"
                />
                <label htmlFor="show-fps" className="ml-2 block text-sm">
                    Show FPS
                </label>
            </div>

            <div className="mt-4">
                <button
                    onClick={() =>
                        handleCommonChange('running', !commonConfig.running)
                    }
                    className={`${commonConfig.running ? 'bg-red-600' : 'bg-blue-600'} ${commonConfig.running ? 'hover:bg-red-700' : 'hover:bg-blue-700'} text-white px-4 py-2 rounded`}
                >
                    {commonConfig.running
                        ? 'Stop simulation'
                        : 'Start simulation'}
                </button>
            </div>

            <div
                className="mt-4 p-3 rounded-md"
                style={{
                    backgroundColor:
                        INSULATION_TYPES[specificConfig.material].color,
                }}
            >
                <p className="text-sm text-gray-700 font-semibold">
                    {INSULATION_TYPES[specificConfig.material].name}
                </p>
                <p className="text-sm text-gray-700">
                    λ={' '}
                    <span className="font-semibold">
                        {INSULATION_TYPES[specificConfig.material].conductivity}
                    </span>{' '}
                    W/mK
                </p>
            </div>
        </>
    );
}
