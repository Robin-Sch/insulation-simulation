import I2D_Controls from './insulation2d/I2D_Controls';
import I3D_Controls from './insulation3d/I3D_Controls';

import { CommonConfig, ISimulation } from '@/lib/constants';
import { Insulation2D } from '@/lib/simulations/insulation2d';
import { Insulation3D } from '@/lib/simulations/insulation3d';

export default function Controls({
    simulation,
    onCommonChange,
    onSpecificChange,
}: {
    simulation: ISimulation;
    onCommonChange: (updates: Partial<CommonConfig>) => void;
    onSpecificChange: (updates: Partial<ISimulation['specificConfig']>) => void;
}) {
    const handleCommonChange = <K extends keyof CommonConfig>(
        key: K,
        value: CommonConfig[K]
    ) => {
        onCommonChange({ [key]: value });
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Controls</h2>

            {simulation.commonConfig.running !== undefined && (
                <div className="mt-4">
                    <button
                        onClick={() =>
                            handleCommonChange(
                                'running',
                                !simulation.commonConfig.running
                            )
                        }
                        className={`${simulation.commonConfig.running ? 'bg-red-600' : 'bg-blue-600'} ${simulation.commonConfig.running ? 'hover:bg-red-700' : 'hover:bg-blue-700'} text-white px-4 py-2 rounded`}
                    >
                        {simulation.commonConfig.running
                            ? 'Stop simulation'
                            : 'Start simulation'}
                    </button>
                </div>
            )}

            {simulation.type === 'insulation3d' && (
                <I3D_Controls
                    specificConfig={(simulation as Insulation3D).specificConfig}
                    onSpecificChange={onSpecificChange}
                />
            )}

            {simulation.type === 'insulation2d' && (
                <I2D_Controls
                    specificConfig={(simulation as Insulation2D).specificConfig}
                    onSpecificChange={onSpecificChange}
                />
            )}

            {simulation.commonConfig.showGrid !== undefined && (
                <div className="flex items-center mt-4">
                    <input
                        type="checkbox"
                        id="show-grid"
                        checked={simulation.commonConfig.showGrid}
                        onChange={(e) =>
                            handleCommonChange('showGrid', e.target.checked)
                        }
                        className="h-4 w-4 border-gray-300 rounded"
                    />
                    <label htmlFor="show-grid" className="ml-2 block text-sm">
                        Show Grid
                    </label>
                </div>
            )}

            {simulation.commonConfig.showFps !== undefined && (
                <div className="flex items-center mt-4">
                    <input
                        type="checkbox"
                        id="show-fps"
                        checked={simulation.commonConfig.showFps}
                        onChange={(e) =>
                            handleCommonChange('showFps', e.target.checked)
                        }
                        className="h-4 w-4 border-gray-300 rounded"
                    />
                    <label htmlFor="show-fps" className="ml-2 block text-sm">
                        Show FPS
                    </label>
                </div>
            )}
        </>
    );
}
