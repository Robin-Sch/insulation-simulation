import { useState } from 'react';

import Select from '../controls/Select';
import Slider from '../controls/Slider';

import {
    getInsulation,
    INSULATION_TYPES,
    InsulationType,
} from '../../lib/constants';
import { InsulationSimulationConfig } from '../../lib/simulations/insulationSimulation';
import InfoButton from '../controls/InfoButton';

export default function InsulationSimulation_Controls({
    config,
    onConfigChange,
}: {
    config: InsulationSimulationConfig;
    onConfigChange: (updates: Partial<InsulationSimulationConfig>) => void;
}) {
    const [showHelp, setShowHelp] = useState(false);

    const handleConfigChange = <K extends keyof InsulationSimulationConfig>(
        key: K,
        value: InsulationSimulationConfig[K]
    ) => {
        onConfigChange({ [key]: value });
    };

    if (showHelp)
        return (
            <div className="rounded-lg">
                <p className="mb-4">
                    This simulation models heat transfer through insulation
                    materials using Fourier&apos;s Law. For each point, it uses
                    the formula below to calculate the heat spread up, down,
                    left and right and changes the temperature accordingly.
                </p>
                <pre className="bg-gray-500 p-2 rounded mb-4">
                    q = -k·(ΔT/Δx)
                </pre>
                <p className="mb-2">Where:</p>
                <ul className="list-disc pl-5 mb-4">
                    <li>q = heat transfer rate (W)</li>
                    <li>k = thermal conductivity (W/mK)</li>
                    <li>ΔT = temperature difference</li>
                    <li>Δx = thickness of material</li>
                </ul>
                <p>
                    There are two cubes and a blue-red gradient plane. The
                    darker cube indicates the walls/the house, whereas the
                    lighter one indicates the insulation material. Using the
                    gradient of the plane, you can see the heat spread from the
                    house (20°C) to the outside (10°C)
                </p>
                <button
                    onClick={() => setShowHelp(false)}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Close
                </button>
            </div>
        );

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Controls</h2>
            <div className="mt-4 flex gap-2">
                <button
                    onClick={() =>
                        handleConfigChange('running', !config.running)
                    }
                    className={`${config.running ? 'bg-red-600' : 'bg-blue-600'} ${config.running ? 'hover:bg-red-700' : 'hover:bg-blue-700'} text-white px-4 py-2 rounded flex-1`}
                >
                    {config.running ? 'Stop' : 'Start'}
                </button>

                <InfoButton onClick={setShowHelp} />
            </div>

            <Select
                name="Insulation Type"
                value={config.material}
                options={INSULATION_TYPES.map((opt) => opt.name)}
                help="Material type affects thermal conductivity (λ) (lower is better)"
                onChange={(value) =>
                    handleConfigChange('material', value as InsulationType)
                }
            />

            <Slider
                name="Thickness"
                min={10}
                max={100}
                step={5}
                value={config.thickness}
                help="Thickness of insulation (higher is better)"
                unit={(value) => value.toString() + ' cm'}
                onChange={(value) => handleConfigChange('thickness', value)}
            />

            <Slider
                name="Y height"
                min={-1}
                max={1}
                step={0.1}
                value={config.yPlane}
                help="Adjusts the vertical slice position to inspect the simulation cross-section."
                unit={(value) => value.toString()}
                onChange={(value) => handleConfigChange('yPlane', value)}
            />

            <Slider
                name="Resolution"
                min={5}
                max={100}
                step={1}
                value={config.resolution}
                help="Higher values increase simulation detail but reduce performance."
                unit={(value) => value.toString()}
                onChange={(value) => handleConfigChange('resolution', value)}
            />

            <div
                className="mt-4 p-3 rounded-md"
                style={{
                    backgroundColor: getInsulation(config.material).color,
                }}
            >
                <p className="text-sm text-gray-700 font-semibold">
                    {config.material}
                </p>
                <p className="text-sm text-gray-700">
                    λ={' '}
                    <span className="font-semibold">
                        {getInsulation(config.material).conductivity}
                    </span>{' '}
                    W/mK
                </p>
            </div>

            <div className="flex items-center mt-4">
                <input
                    type="checkbox"
                    id="show-house"
                    checked={config.showHouse}
                    onChange={(e) =>
                        handleConfigChange('showHouse', e.target.checked)
                    }
                    className="h-4 w-4 border-gray-300 rounded"
                />
                <label htmlFor="show-house" className="ml-2 block text-sm">
                    Show House
                </label>
            </div>

            <div className="flex items-center mt-4">
                <input
                    type="checkbox"
                    id="rotate"
                    checked={config.rotate}
                    onChange={(e) =>
                        handleConfigChange('rotate', e.target.checked)
                    }
                    className="h-4 w-4 border-gray-300 rounded"
                />
                <label htmlFor="rotate" className="ml-2 block text-sm">
                    Rotate
                </label>
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
