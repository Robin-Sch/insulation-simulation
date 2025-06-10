export default function InfoButton({
    onClick,
}: {
    onClick: (value: boolean) => void;
}) {
    return (
        <button
            onClick={() => onClick(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center space-x-2"
            title="Information"
        >
            <svg width="24px" height="24px" viewBox="0 0 24 24">
                <g>
                    <circle
                        cx="12"
                        cy="12"
                        fill="none"
                        r="10"
                        stroke="#ffffff"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                    />

                    <line
                        fill="none"
                        stroke="#ffffff"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        x1="12"
                        x2="12"
                        y1="12"
                        y2="16"
                    />

                    <line
                        fill="none"
                        stroke="#ffffff"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        x1="12"
                        x2="12"
                        y1="8"
                        y2="8"
                    />
                </g>
            </svg>
            <span>Info</span>
        </button>
    );
}
