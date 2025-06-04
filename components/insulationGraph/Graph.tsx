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

import { getInsulation, InsulationType } from '@/lib/constants';
import {
    InsulationGraphConfig,
    secondsToHms,
} from '@/lib/simulations/insulationGraph';

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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                label: (context: any) => {
                    return `${secondsToHms(context.dataset.label)}: ${context.parsed.y.toFixed(2)}°C`;
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

export default function InsulationGraph_Graph({
    config,
    setBoundaryTemp,
}: {
    config: InsulationGraphConfig;
    setBoundaryTemp: (boundaryTemp: number[]) => void;
}) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any>({ labels: [], datasets: [] });
    const layersString = JSON.stringify(config.layers); // used to check if array gets updated

    useEffect(() => {
        const nodes = [
            makeNode({
                name: 'Inside',
                temperatureDegC: config.insideTemp,
                capacitanceJPerDegK: 10000,
                powerGenW: 0,
                isBoundary: false,
            }),
            ...config.layers.map((layer) =>
                makeNode({
                    name: layer.material,
                    temperatureDegC: config.outsideTemp,
                    capacitanceJPerDegK: 10000,
                    powerGenW: 0,
                    isBoundary: false,
                })
            ),
        ];

        const connections = [];
        for (let i = 0; i < config.layers.length; i++) {
            const layer = config.layers[i];
            const material = getInsulation(layer.material);

            const connection = makeConnection({
                firstNode: nodes[i],
                secondNode: nodes[i + 1],
                resistanceDegKPerW:
                    (1 / material.conductivity) * (layer.thickness / 100),
                kind: 'cond',
            });
            connections.push(connection);
        }

        const { timeSeriesS, nodeResults } = run({
            nodes,
            connections,
            timeStepS: config.duration / config.steps,
            totalTimeS: config.duration,
        });

        const labels = timeSeriesS.map((time) => secondsToHms(time));
        const datasets = nodeResults.map((nodeResult) => ({
            label: nodeResult.node.name,
            data: nodeResult.tempDegC,
            borderColor:
                nodeResult.node.name === 'Inside'
                    ? 'black'
                    : getInsulation(nodeResult.node.name as InsulationType)
                          .color,
        }));
        setData({
            labels,
            datasets,
        });
        setBoundaryTemp(
            datasets.map((dataset) => dataset.data[dataset.data.length - 1])
        );
    }, [
        setBoundaryTemp,
        layersString,
        config.layers,
        config.insideTemp,
        config.outsideTemp,
        config.duration,
        config.steps,
    ]);

    return <Line options={options} data={data} />;
}
