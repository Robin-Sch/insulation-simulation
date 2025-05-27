import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { makeConnection, makeNode, run } from 'hotstuff-network';
import { useEffect, useState } from 'react';

import { INSULATION_TYPES } from '@/lib/constants';
import { Insulation2DConfig } from '@/lib/simulations/insulation2d';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Temperature Over Time',
        },
        tooltip: {
            callbacks: {
                label: (context) => {
                    return `${context.dataset.label}: ${context.parsed.y}°C`;
                },
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Temperature (°C)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Time',
                },
            },
        },
    },
};

export default function I2D_Chart({
    config,
    running,
}: {
    config: Insulation2DConfig;
    running: boolean;
}) {
    const [data, setData] = useState<any>({ labels: [], datasets: [] });

    useEffect(() => {
        const nodes = [
            makeNode({
                name: '0',
                temperatureDegC: 20,
                capacitanceJPerDegK: 10000,
                powerGenW: 0,
                isBoundary: true,
            }),
        ];
        const connections = [];
        for (let i = 0; i < config.layers.length; i++) {
            const layer = config.layers[i];
            const material = INSULATION_TYPES[layer.material];

            const node = makeNode({
                name: (i + 1).toString(),
                temperatureDegC: 10,
                capacitanceJPerDegK: 10000,
                powerGenW: 0,
                isBoundary: false,
            });
            nodes.push(node);

            const connection = makeConnection({
                firstNode: nodes[i], // (i + 1) - 1 = i
                secondNode: node,
                resistanceDegKPerW:
                    1 / (material.conductivity * (layer.thickness / 100)),
                kind: 'cond',
            });
            connections.push(connection);
        }

        const { timeSeriesS: labels, nodeResults } = run({
            nodes,
            connections,
            timeStepS: 60 * 60,
            totalTimeS: 60 * 60 * 24,
        });

        const datasets = nodeResults.map((nodeResult, i) => ({
            label: `${nodeResult.node.name}`,
            data: nodeResult.tempDegC,
            borderColor: `hsl(${(i * 360) / nodeResults.length}, 70%, 50%)`,
            backgroundColor: `hsla(${(i * 360) / nodeResults.length}, 70%, 50%, 0.1)`,
            tension: 0.4,
        }));
        setData({
            labels,
            datasets,
        });
    }, [config.layers, running]);

    return (
        <div className="w-full">
            <Line options={options} data={data} />;
        </div>
    );
}
