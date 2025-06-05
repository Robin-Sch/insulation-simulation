'use client';

import { MouseEvent, useState } from 'react';

import Controls from '../components/controls/Controls';
import Renderer from '../components/Renderer';
import Tab from '../components/Tab';
import { TypeMenu } from '../components/TypeMenu';

import { CommonConfig, ISimulation, SimulationType } from '../lib/constants';
import { SimulationFactory } from '../lib/simulations/factory';

export default function Simulation() {
    const [simulations, setSimulations] = useState<ISimulation[]>([
        SimulationFactory.create(
            'insulationGraph',
            '1',
            '1: Insulation Graph',
            true
        ),
        SimulationFactory.create(
            'insulationSimulation',
            '2',
            '2: Insulation Simulation',
            false
        ),
    ]);
    const activeSimulation = simulations.find((sim) => sim.active);

    const addNewTab = (type: SimulationType, name: string) => {
        const newId = (simulations.length + 1).toString();
        setSimulations((prev) => [
            ...prev.map((sim) => ({ ...sim, active: false })),
            SimulationFactory.create(type, newId, `${newId}: ${name}`, true),
        ]);
    };

    const switchTab = (id: string) => {
        setSimulations((prev) =>
            prev.map((sim) => ({
                ...sim,
                active: sim.id === id,
            }))
        );
    };

    const closeTab = (id: string, e: MouseEvent) => {
        e.stopPropagation();
        setSimulations((prev) => {
            const newSims = prev.filter((sim) => sim.id !== id);
            if (newSims.length > 0 && !newSims.some((sim) => sim.active)) {
                newSims[0].active = true;
            }
            return newSims;
        });
    };

    const renameTab = (id: string, newTitle: string) => {
        setSimulations((prev) =>
            prev.map((sim) =>
                sim.id === id ? { ...sim, title: newTitle } : sim
            )
        );
    };

    const onConfigChange = (id: string, updates: Partial<CommonConfig>) => {
        setSimulations((prev) =>
            prev.map((sim) => {
                if (sim.id === id) {
                    // @ts-expect-error factory moment
                    sim.config = { ...sim.config, ...updates };
                    return sim;
                } else return sim;
            })
        );
    };

    if (!activeSimulation) return null;

    return (
        <div className="relative w-full h-screen flex flex-col">
            {/* Tab bar with type selection */}
            <div className="flex bg-gray-800 border-b border-gray-700">
                <div className="flex flex-1 overflow-x-auto">
                    {simulations.map((sim) => (
                        <Tab
                            key={sim.id}
                            simulation={sim}
                            onSelect={() => switchTab(sim.id)}
                            onRename={(newTitle) => renameTab(sim.id, newTitle)}
                            onClose={(e) => closeTab(sim.id, e)}
                        />
                    ))}
                </div>
                <TypeMenu onSelectType={addNewTab} />
                <a
                    href="https://github.com/Robin-Sch/insulation-simulation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center"
                    aria-label="Gi1Hub repository"
                >
                    <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                        />
                    </svg>
                </a>
            </div>

            {/* Main content area */}
            <div className="flex-1 relative">
                {activeSimulation && (
                    <>
                        <div className="absolute top-4 left-4 z-1 bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-xl text-white space-y-4 w-64">
                            <Controls
                                simulation={activeSimulation}
                                onConfigChange={(updates) =>
                                    onConfigChange(activeSimulation.id, updates)
                                }
                            />
                        </div>

                        <Renderer simulation={activeSimulation} />
                    </>
                )}
            </div>
        </div>
    );
}
