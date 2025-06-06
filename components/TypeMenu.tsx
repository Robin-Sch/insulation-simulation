import { useState } from 'react';

import { SimulationType } from '../lib/constants';

interface TypeMenuProps {
    onSelectType: (type: SimulationType, name: string) => void;
}

export const TypeMenu = ({ onSelectType }: TypeMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const simulationTypes: {
        type: SimulationType;
        name: string;
        description: string;
    }[] = [
        {
            type: 'insulationGraph',
            name: 'Insulation Graph',
            description:
                'Graph showing temperature inside insulation material over time',
        },
        {
            type: 'insulationSimulation',
            name: 'Insulation Simulation',
            description:
                'Simulation showing heat spread through insulation material',
        },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center"
            >
                <PlusIcon className="w-4 h-4 mr-1" />
                <span>New tab</span>
            </button>

            {isOpen && (
                <>
                    {/* Click outside to close */}
                    <div
                        className="fixed inset-0 z-1"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown menu */}
                    <div className="absolute right-0 mt-1 z-20 w-64 bg-gray-800 rounded-md shadow-lg border border-gray-700">
                        <div className="p-2 text-gray-400 text-sm font-medium">
                            Select simulation type
                        </div>
                        <ul className="py-1">
                            {simulationTypes.map((simType) => (
                                <li key={simType.type}>
                                    <button
                                        onClick={() => {
                                            onSelectType(
                                                simType.type,
                                                simType.name
                                            );
                                            setIsOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-start space-x-3"
                                    >
                                        <div>
                                            <div className="text-white">
                                                {simType.name}
                                            </div>
                                            <div className="text-gray-400 text-xs">
                                                {simType.description}
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

const PlusIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
    </svg>
);
