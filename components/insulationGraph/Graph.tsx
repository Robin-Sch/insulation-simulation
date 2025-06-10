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
    getInsulation,
    InsulationType,
} from '../../lib/constants';
import {
    InsulationGraphConfig,
    secondsToHms,
} from '../../lib/simulations/insulationGraph';

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
                title: (labels: { label: string }[]) => {
                    const label = parseInt(labels[0].label);
                    return `${secondsToHms(label, false)}`;
                },
                label: (context: {
                    dataset: { label?: string };
                    parsed: { y: number };
                }) => {
                    console.log(context);
                    return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}°C`;
                },
            },
        },
    },
    interaction: {
        intersect: false, // show tooltip even when not exactly hovering on line
        mode: 'index' as const, // show all tooltips at the same time
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
                text: 'Time elapsed (hh:mm:ss)',
            },
            ticks: {
                callback(index: string | number): string {
                    // @ts-expect-error it does exists on config
                    const value = this.getLabelForValue(index);
                    return `${secondsToHms(value, true)}`;
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
                    temperatureDegC:
                        (config.insideTemp + config.outsideTemp) / 2,
                    capacitanceJPerDegK: 10000,
                    powerGenW: 0,
                    isBoundary: false,
                })
            ),
            makeNode({
                name: 'Outside',
                temperatureDegC: config.outsideTemp,
                capacitanceJPerDegK: 10000,
                powerGenW: 0,
                isBoundary: true,
            }),
        ];

        const connections = [
            makeConnection({
                firstNode: nodes[nodes.length - 2],
                secondNode: nodes[nodes.length - 1],
                resistanceDegKPerW: 1 / airConductivity,
                kind: 'cond',
            }),
        ];
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

        const datasets = nodeResults.map((nodeResult) => ({
            label: nodeResult.node.name,
            data: nodeResult.tempDegC,
            borderColor:
                nodeResult.node.name === 'Inside' ||
                nodeResult.node.name === 'Outside'
                    ? 'black'
                    : getInsulation(nodeResult.node.name as InsulationType)
                          .color,
        }));
        setData({
            labels: timeSeriesS,
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
