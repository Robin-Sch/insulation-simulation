import Tooltip from './Tooltip';

export default function Slider({
    name,
    min,
    max,
    step,
    value,
    help,
    unit,
    onChange,
}: {
    name: string;
    min: number;
    max: number;
    step: number;
    value: number;
    help: string;
    unit: (value: number) => string;
    onChange: (value: number) => void;
}) {
    return (
        <>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">
                    {name}
                    <Tooltip help={help} />
                </label>
                <span className="text-sm font-semibold">{unit(value)}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs mt-1">
                <span>{unit(min)}</span>
                <span>{unit(max)}</span>
            </div>
        </>
    );
}
