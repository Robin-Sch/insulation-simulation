import { KeyboardEvent, MouseEvent, useState } from 'react';

import { ISimulation } from '@/lib/constants';

interface SimulationTabProps {
    simulation: ISimulation;
    onSelect: () => void;
    onClose: (e: MouseEvent) => void;
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

    const handleKeyDown = (e: KeyboardEvent) => {
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
