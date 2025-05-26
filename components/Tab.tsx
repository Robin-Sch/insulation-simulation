import React, { useState } from 'react';

import { ISimulation } from '@/lib/constants';

interface SimulationTabProps {
    simulation: ISimulation;
    onSelect: () => void;
    onClose: (e: React.MouseEvent) => void;
    onRename: (newTitle: string) => void;
}

export default function Tab({
    simulation,
    onSelect,
    onClose,
    onRename,
}: SimulationTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState(simulation.title);

    const handleTitleClick = () => {
        setIsEditing(true);
    };

    const handleTitleBlur = () => {
        setIsEditing(false);
        if (tempTitle.trim() !== simulation.title) {
            onRename(tempTitle.trim());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleTitleBlur();
        }
    };

    return (
        <div
            onClick={onSelect}
            className={`flex items-center px-4 py-2 border-r border-gray-700 cursor-pointer min-w-[120px] relative group ${
                simulation.active
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
            }`}
        >
            {/* Simulation type icon */}
            <div className="mr-2">
                {simulation.type === 'insulation3d' && (
                    <FireIcon className="w-4 h-4" />
                )}
                {simulation.type === 'insulation2d' && (
                    <CubeIcon className="w-4 h-4" />
                )}
            </div>

            {/* Editable title */}
            {isEditing ? (
                <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="bg-transparent border-none outline-none w-full"
                />
            ) : (
                <span
                    className="truncate flex-1"
                    onDoubleClick={handleTitleClick}
                >
                    {simulation.title}
                </span>
            )}

            {/* Close button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose(e);
                }}
                className="ml-2 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
                ×
            </button>

            {/* Active indicator */}
            {simulation.active && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
        </div>
    );
}

// Example icon components (you can use your own or from a library like Heroicons)
const FireIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path
            fillRule="evenodd"
            d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
            clipRule="evenodd"
        />
    </svg>
);

const CubeIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
    </svg>
);
