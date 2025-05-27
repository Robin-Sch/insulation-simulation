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

import {
    airConductivity,
    INSULATION_TYPES,
    InsulationType,
} from '@/lib/constants';
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
                    return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}°C`;
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
    const [data, setData] = useState<any>({ labels: [], datasets: [] });
    const layersString = JSON.stringify(config.layers); // used to check if array gets updated

    useEffect(() => {
        const nodes = [
            makeNode({
                name: 'Inside',
                temperatureDegC: 20,
                capacitanceJPerDegK: 10000,
                powerGenW: 0,
                isBoundary: true,
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
            makeNode({
                name: 'Outside',
                temperatureDegC: 10,
                capacitanceJPerDegK: 10000,
                powerGenW: 0,
                isBoundary: false,
            }),
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
        connections.push(
            makeConnection({
                firstNode: nodes[nodes.length - 2],
                secondNode: nodes[nodes.length - 1],
                resistanceDegKPerW: (1 / airConductivity) * 1,
                kind: 'cond',
            })
        );

        const { timeSeriesS: labels, nodeResults } = run({
            nodes,
            connections,
            timeStepS: 60 * 60,
            totalTimeS: 60 * 60 * 24,
        });

        const datasets = nodeResults.map((nodeResult) => ({
            label: nodeResult.node.name,
            data: nodeResult.tempDegC,
            borderColor:
                nodeResult.node.name === 'Inside' ||
                nodeResult.node.name === 'Outside'
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
