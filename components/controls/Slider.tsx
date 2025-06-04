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
                    <span className="help-tooltip group relative ml-1">
                        <span className="text-xs cursor-help"> (?)</span>
                        <span className="help-tooltip-text hidden group-hover:block absolute z-10 w-48 p-2 mt-1 text-xs bg-gray-800 text-white rounded shadow-lg">
                            {help}
                        </span>
                    </span>
                </label>
                <span className="text-sm font-semibold">{unit(value)}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs mt-1">
                <span>{unit(min)}</span>
                <span>{unit(max)}</span>
            </div>
        </>
    );
}
