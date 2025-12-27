import React from 'react';
import { Box } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchCryptoHistory } from '../../lib/features/market/actions';

interface CryptoChartProps {
    color: string;
    cryptoId?: string;
    range?: string;
}

export const CryptoChart = ({ color, cryptoId, range = '1d' }: CryptoChartProps) => {
    const dispatch = useAppDispatch();
    const { historicalData } = useAppSelector((state) => state.market);
    
    // Fetch Data on Change
    React.useEffect(() => {
        if (cryptoId) {
            dispatch(fetchCryptoHistory({ cryptoId, range }));
        }
    }, [cryptoId, range, dispatch]);
    
    const chartData = historicalData[cryptoId || '']?.data;
    const isDataLoaded = !!chartData && historicalData[cryptoId || '']?.range === range;

    const labels = React.useMemo(() => {
        if (!isDataLoaded) return Array.from({ length: 24 }, (_, i) => `${i}:00`); // Placeholder
        return chartData.map(d => new Date(d.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    }, [chartData, isDataLoaded]);
    
    const dataPoints = React.useMemo(() => {
        if (!isDataLoaded) {
             // Fallback Simulation logic if no data - using deterministic sine wave
            return Array.from({ length: 24 }).map((_, i) => {
                const base = 100;
                // Create a deterministic pattern based on index
                const change = Math.sin(i * 0.5) * 10 + (i % 2 === 0 ? 5 : -5);
                return base + change;
            });
        }
        return chartData.map(d => d.price);
    }, [chartData, isDataLoaded]);

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Price',
                data: dataPoints,
                borderColor: color,
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, `${color}40`);
                    gradient.addColorStop(1, `${color}00`);
                    return gradient;
                },
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: color,
                tension: 0.4
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: 'rgba(10, 10, 20, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.3)',
                    maxTicksLimit: 6
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                ticks: {
                     color: 'rgba(255, 255, 255, 0.3)',
                }
            },
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false
        }
    };

    return (
        <Box sx={{ width: '100%', height: 400, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 4, p: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
            <Line options={options} data={data} />
        </Box>
    );
};
