import React from 'react';
import { Box, Typography } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
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

interface MarketLineChartProps {
    color?: string;
    height?: number;
    showLabel?: boolean;
}

export const MarketLineChart = ({ color = '#00f3ff', height = 300, showLabel = true }: MarketLineChartProps) => {
    
    // Generate simulated data
    const labels = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'];
    const dataPoints = [80, 75, 78, 90, 60, 95, 85, 30, 60];

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Tendencia del Mercado',
                data: dataPoints,
                borderColor: color,
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, height);
                    gradient.addColorStop(0, `${color}40`); // 40 = 25% opacity hex
                    gradient.addColorStop(1, `${color}00`); // 00 = 0% opacity hex
                    return gradient;
                },
                borderWidth: 3,
                tension: 0.4, // Smooth curve
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: color,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: { // Typed as any to avoid complex type errors if strict
                backgroundColor: 'rgba(10, 10, 25, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.5)',
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                ticks: {
                    display: false // Hide Y axis labels for cleaner look or keep them? User said "visual styling". Cleaner is usually better for "Trend".
                },
                border: {
                    display: false
                }
            }
        }
    };

    return (
        <Box sx={{ width: '100%', height: height, bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 2, p: 2, position: 'relative', overflow: 'hidden', mb: 8, border: `1px solid ${color}20` }}>
            {showLabel && <Typography variant="h6" sx={{ color: color, mb: 1 }}>Tendencia General del Mercado (24h)</Typography>}
            <Box sx={{ height: 'calc(100% - 30px)', width: '100%' }}>
                <Line data={data} options={options} />
            </Box>
        </Box>
    );
};
