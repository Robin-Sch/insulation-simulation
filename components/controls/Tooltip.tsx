export default function Tooltip({ help }: { help: string }) {
    return (
        <span className="help-tooltip group relative ml-1">
            <span className="text-xs cursor-help"> (?)</span>
            <span className="help-tooltip-text hidden group-hover:block absolute z-10 w-48 p-2 mt-1 text-xs bg-gray-800 text-white rounded shadow-lg">
                {help}
            </span>
        </span>
    );
}
