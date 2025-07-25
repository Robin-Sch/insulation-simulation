import { useState } from 'react';

import Select from '../controls/Select';
import Slider from '../controls/Slider';

import { INSULATION_TYPES, InsulationType } from '../../lib/constants';
import {
    InsulationGraphConfig,
    InsulationGraphLayer,
    secondsToHms,
} from '../../lib/simulations/insulationGraph';
import InfoButton from '../controls/InfoButton';

export default function InsulationGraph_Controls({
    config,
    onConfigChange,
}: {
    config: InsulationGraphConfig;
    onConfigChange: (updates: Partial<InsulationGraphConfig>) => void;
}) {
    const [showHelp, setShowHelp] = useState(false);
    const [newMaterial, setNewMaterial] =
        useState<InsulationType>('Cellulose Pulp');
    const [newThickness, setNewThickness] = useState(50);

    const handleLayerChange = <K extends keyof InsulationGraphLayer>(
        index: number,
        key: K,
        value: InsulationGraphLayer[K]
    ) => {
        config.layers[index][key] = value;
        onConfigChange({ layers: config.layers });
    };

    const handleConfigChange = <K extends keyof InsulationGraphConfig>(
        key: K,
        value: InsulationGraphConfig[K]
    ) => {
        onConfigChange({ [key]: value });
    };

    const handleLayerAdd = () => {
        const newLayer: InsulationGraphLayer = {
            material: newMaterial,
            thickness: newThickness,
        };

        onConfigChange({
            layers: [...config.layers, newLayer],
        });
    };

    if (showHelp)
        return (
            <div className="rounded-lg">
                <p className="mb-4">
                    At the top you can see a side view of your wall seeing the
                    thickness and what type of insulation you have. Below that
                    it shows the temperature in the house and the temperature of
                    each insulation layer.
                    <br />
                    <br />
                    The graph in the middle shows the temperature of the inside
                    of the house (left side) and of each insulation material
                    (over time). It is based on the work of{' '}
                    <a href="https://theleo.zone/thermal-model/">
                        http://thermalmodel.com/
                    </a>
                    , which explains how it works in depth under the
                    &quot;Theory&quot; button.
                    <br />
                    Note that we only use thermal conductivity and do not use
                    convection nor radiation, which limits the real-life
                    accuracy. Nonetheless, it allows you to easily compare
                    different types of insulation materials.
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
                <InfoButton onClick={setShowHelp} />
            </div>

            <Slider
                name="Initial inside temp"
                min={0}
                max={30}
                step={5}
                value={config.insideTemp}
                help="Initial temperature on the interior (left) side of the wall"
                unit={(value) => value.toString() + '°C'}
                onChange={(value) => handleConfigChange('insideTemp', value)}
            />

            <Slider
                name="Initial outside temp"
                min={0}
                max={30}
                step={5}
                value={config.outsideTemp}
                unit={(value) => value.toString() + '°C'}
                help="Initial temperature on the exterior (right) side of the wall"
                onChange={(value) => handleConfigChange('outsideTemp', value)}
            />

            <Slider
                name="Duration"
                min={60 * 5}
                max={60 * 60 * 24 * 1.5}
                step={60 * 5}
                value={config.duration}
                help="Duration of the graph/simulation"
                unit={(value) => secondsToHms(value, false)}
                onChange={(value) => handleConfigChange('duration', value)}
            />

            <Slider
                name="Steps"
                min={5}
                max={100}
                step={1}
                value={config.steps}
                help="Number of in-between calculation steps"
                unit={(value) => value.toString()}
                onChange={(value) => handleConfigChange('steps', value)}
            />

            <h2 className="text-xl font-bold mb-4">Add new</h2>
            <Select
                name="Insulation Type"
                value={newMaterial}
                options={INSULATION_TYPES.map((opt) => opt.name)}
                help="Material type affects thermal conductivity (λ) (lower is better)"
                onChange={(value) => setNewMaterial(value as InsulationType)}
            />

            <Slider
                name="Thickness"
                min={10}
                max={100}
                step={5}
                value={newThickness}
                help="Thickness of new layer (higher is better)"
                unit={(value) => value.toString() + ' cm'}
                onChange={setNewThickness}
            />

            <button
                onClick={handleLayerAdd}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
                Add
            </button>

            <h2 className="text-xl font-bold mb-4">Modify existing</h2>
            {config.layers.map((layer, i) => (
                <div key={`layer-${i}`}>
                    <Select
                        name="Insulation Type"
                        value={layer.material}
                        options={INSULATION_TYPES.map((opt) => opt.name)}
                        help="Material type affects thermal conductivity (λ) (lower is better)"
                        onChange={(value) =>
                            handleLayerChange(
                                i,
                                'material',
                                value as InsulationType
                            )
                        }
                    />

                    <Slider
                        name="Thickness"
                        min={10}
                        max={100}
                        step={5}
                        value={layer.thickness}
                        help="Thickness of insulation (higher is better)"
                        unit={(value) => value.toString() + ' cm'}
                        onChange={(value) =>
                            handleLayerChange(i, 'thickness', value)
                        }
                    />
                </div>
            ))}
        </>
    );
}
