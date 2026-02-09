import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Doughnut, Radar, PolarArea, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { motion, LegacyAnimationControls } from 'framer-motion';
import { Asset } from '../../lib/types/portfolio';

ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Filler);

interface PortfolioChartProps {
    assets: Asset[];
    controls: LegacyAnimationControls;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ assets, controls }) => {
    const [chartType, setChartType] = React.useState('doughnut');

    const chartData = {
        labels: assets.map(a => a.name),
        datasets: [
            {
                data: assets.map(a => a.value),
                backgroundColor: assets.map(a => a.color),
                borderColor: 'rgba(0,0,0,0)',
                borderWidth: 0,
                hoverOffset: 10
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#00f3ff',
                bodyColor: '#fff',
                borderColor: 'rgba(0, 243, 255, 0.3)',
                borderWidth: 1,
            }
        },
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: false
    };

    const barChartOptions = {
        ...chartOptions,
        cutout: undefined,
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.1)' },
                ticks: { color: 'rgba(255,255,255,0.7)' }
            },
            x: {
                grid: { display: false },
                ticks: { color: 'rgba(255,255,255,0.7)' }
            }
        }
    };

    const radarChartOptions = {
        ...chartOptions,
        cutout: undefined,
        scales: {
            r: {
                angleLines: { color: 'rgba(255,255,255,0.1)' },
                grid: { color: 'rgba(255,255,255,0.1)' },
                pointLabels: { color: 'rgba(255,255,255,0.7)', font: { size: 12 } },
                ticks: { display: false, backdropColor: 'transparent' }
            }
        },
        elements: {
            line: {
                borderWidth: 2,
                borderColor: '#00f3ff',
                backgroundColor: 'rgba(0, 243, 255, 0.2)'
            }
        }
    };

    return (
        <motion.div animate={controls}>
            <Box sx={{ position: 'relative', height: 400, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ToggleButtonGroup
                    value={chartType}
                    exclusive
                    onChange={(e, newType) => { if(newType) setChartType(newType) }}
                    aria-label="chart type"
                    sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}
                    size="small"
                >
                    <ToggleButton value="doughnut" sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-selected': { color: '#00f3ff', bgcolor: 'rgba(0, 243, 255, 0.1)' } }}>
                        <DonutLargeIcon />
                    </ToggleButton>
                    <ToggleButton value="radar" sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-selected': { color: '#00f3ff', bgcolor: 'rgba(0, 243, 255, 0.1)' } }}>
                        <TrackChangesIcon />
                    </ToggleButton>
                    <ToggleButton value="polar" sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-selected': { color: '#00f3ff', bgcolor: 'rgba(0, 243, 255, 0.1)' } }}>
                        <DataUsageIcon />
                    </ToggleButton>
                    <ToggleButton value="bar" sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-selected': { color: '#00f3ff', bgcolor: 'rgba(0, 243, 255, 0.1)' } }}>
                        <BarChartIcon />
                    </ToggleButton>
                </ToggleButtonGroup>

                <Box sx={{ position: 'relative', height: 350, width: '100%' }}>
                    {chartType === 'doughnut' && <Doughnut data={chartData} options={chartOptions} />}
                    {chartType === 'radar' && <Radar data={chartData} options={radarChartOptions} />}
                    {chartType === 'polar' && <PolarArea data={chartData} options={{ ...chartOptions, scales: { r: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { display: false } } } }} />}
                    {chartType === 'bar' && <Bar data={chartData} options={barChartOptions} />}
                    
                    {chartType === 'doughnut' && (
                        <Box sx={{ 
                            position: 'absolute', 
                            top: '50%', 
                            left: '50%', 
                            transform: 'translate(-50%, -50%)', 
                            textAlign: 'center',
                            pointerEvents: 'none'
                        }}>
                            <Typography variant="h6" color="primary.main">PORTAFOLIO</Typography>
                            <Typography variant="caption" color="text.secondary">DIVERSIFICACIÓN</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </motion.div>
    );
};
