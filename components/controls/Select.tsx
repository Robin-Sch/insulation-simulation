export default function Select({
    name,
    value,
    options,
    help,
    onChange,
}: {
    name: string;
    value: string;
    options: string[];
    help: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
                {name}
                <span className="help-tooltip group relative ml-1">
                    <span className="text-xs cursor-help"> (?)</span>
                    <span className="help-tooltip-text hidden group-hover:block absolute z-10 w-48 p-2 mt-1 text-xs bg-gray-800 text-white rounded shadow-lg">
                        {help}
                    </span>
                </span>
            </label>
            <select
                className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {!options.includes(value) && (
                    <option value="" disabled>
                        {value}
                    </option>
                )}

                {options.map((option) => (
                    <option
                        key={option}
                        value={option}
                        className="text-gray-800"
                    >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
}
