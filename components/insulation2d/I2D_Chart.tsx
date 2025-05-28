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

import { INSULATION_TYPES, InsulationType } from '@/lib/constants';
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

function secondsToHms(d: number) {
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);

    const hDisplay = h > 0 ? h + (h == 1 ? ' hour ' : ' hours ') : '';
    const mDisplay = m > 0 ? m + (m == 1 ? ' minute ' : ' minutes ') : '';
    const sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
    return hDisplay + mDisplay + sDisplay;
}

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

export default function I2D_Chart({
    config,
    setBoundaryTemp,
}: {
    config: Insulation2DConfig;
    setBoundaryTemp: (boundaryTemp: number[]) => void;
}) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any>({ labels: [], datasets: [] });
    const layersString = JSON.stringify(config.layers); // used to check if array gets updated

    useEffect(() => {
        const nodes = [
            makeNode({
                name: 'Inside',
                temperatureDegC: 20,
                capacitanceJPerDegK: 10000,
                powerGenW: 0,
                isBoundary: false,
            }),
            ...config.layers.map((layer) =>
                makeNode({
                    name: layer.material,
                    temperatureDegC: 10,
                    capacitanceJPerDegK: 10000,
                    powerGenW: 0,
                    isBoundary: false,
                })
            ),
        ];

        const connections = [];
        for (let i = 0; i < config.layers.length; i++) {
            const layer = config.layers[i];
            const material = INSULATION_TYPES[layer.material];

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
            timeStepS: 60 * 60,
            totalTimeS: 60 * 60 * 24,
        });

        const labels = timeSeriesS.map((time) => secondsToHms(time));
        const datasets = nodeResults.map((nodeResult) => ({
            label: nodeResult.node.name,
            data: nodeResult.tempDegC,
            borderColor:
                nodeResult.node.name === 'Inside'
                    ? 'black'
                    : INSULATION_TYPES[nodeResult.node.name as InsulationType]
                          .color,
        }));
        setData({
            labels,
            datasets,
        });
        setBoundaryTemp(
            datasets.map((dataset) => dataset.data[dataset.data.length - 1])
        );
    }, [setBoundaryTemp, layersString, config.layers]);

    return <Line options={options} data={data} />;
}
