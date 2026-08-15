// 1-Gestión de estado local para chart type
// 2-Estructuración y renderizado visual del componente UI

import React from 'react';
import { Doughnut, Radar, PolarArea, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { PieChart, Gauge, BarChart3, Target } from 'lucide-react';
import { motion, LegacyAnimationControls } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Typography } from '../ui/Typography';
import { Asset } from '../../lib/types/portfolio';

ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Filler);

interface PortfolioChartProps {
    assets: Asset[];
    controls: LegacyAnimationControls;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ assets, controls }) => {
    
    //# 1-Gestión de estado local para chart type
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

    
    
    //# 2-Estructuración y renderizado visual del componente UI
    const toggleOptions: { value: string; icon: React.ReactNode }[] = [
        { value: 'doughnut', icon: <PieChart size={18} /> },
        { value: 'radar', icon: <Target size={18} /> },
        { value: 'polar', icon: <Gauge size={18} /> },
        { value: 'bar', icon: <BarChart3 size={18} /> },
    ];

    return (
        <motion.div animate={controls}>
            <div className="relative flex h-[400px] w-full flex-col items-center">
                <div
                    role="group"
                    aria-label="chart type"
                    className="mb-4 flex gap-1 rounded-lg bg-white/5 p-1"
                >
                    {toggleOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setChartType(opt.value)}
                            className={cn(
                                'rounded px-2 py-1.5 text-white/50 transition-colors',
                                chartType === opt.value && 'bg-[#00f3ff]/10 text-[#00f3ff]'
                            )}
                        >
                            {opt.icon}
                        </button>
                    ))}
                </div>

                <div className="relative h-[350px] w-full">
                    {chartType === 'doughnut' && <Doughnut data={chartData} options={chartOptions} />}
                    {chartType === 'radar' && <Radar data={chartData} options={radarChartOptions} />}
                    {chartType === 'polar' && <PolarArea data={chartData} options={{ ...chartOptions, scales: { r: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { display: false } } } }} />}
                    {chartType === 'bar' && <Bar data={chartData} options={barChartOptions} />}

                    {chartType === 'doughnut' && (
                        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                            <Typography variant="h6" className="text-primary">PORTAFOLIO</Typography>
                            <Typography variant="caption" className="text-foreground-muted">DIVERSIFICACIÓN</Typography>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
