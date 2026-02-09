import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ScriptableContext
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
            const promise = dispatch(fetchCryptoHistory({ cryptoId, range }));
            return () => {
                promise.abort();
            };
        }
    }, [cryptoId, range, dispatch]);
    
    const chartData = historicalData[cryptoId || '']?.data;
    const isDataLoaded = !!chartData && historicalData[cryptoId || '']?.range === range;

    const labels = React.useMemo(() => {
        if (!isDataLoaded || !Array.isArray(chartData)) return Array.from({ length: 24 }, (_, i) => `${i}:00`); // Placeholder
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
                backgroundColor: (context: ScriptableContext<"line">) => {
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

    const tooltipRef = React.useRef<HTMLDivElement>(null);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 2500,
            easing: 'easeOutQuart' as const,
        },
        layout: {
            padding: 0
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
                external: (context: any) => {
                    // Tooltip Element
                    const { chart, tooltip } = context;
                    const tooltipEl = tooltipRef.current;

                    if (!tooltipEl) return;

                    // Hide if no tooltip
                    if (tooltip.opacity === 0) {
                        tooltipEl.style.opacity = '0';
                        tooltipEl.style.transform = 'translate(-50%, -100%) scale(0.9)';
                        return;
                    }

                    // Set Text
                    if (tooltip.body) {
                        const titleLines = tooltip.title || [];
                        const bodyLines = tooltip.body.map((b: any) => b.lines);

                        let innerHtml = '<div style="margin-bottom: 8px;">';

                        titleLines.forEach((title: string) => {
                            innerHtml += `<div style="font-weight: 700; font-size: 14px; margin-bottom: 4px; color: rgba(255,255,255,0.7);">${title}</div>`;
                        });
                        innerHtml += '</div>';

                        bodyLines.forEach((body: string, i: number) => {
                            const colors = tooltip.labelColors[i];
                            const span = `<span style="background:${colors.backgroundColor}; border-color:${colors.borderColor}; border-width: 2px; display: inline-block; height: 10px; width: 10px; border-radius: 50%; margin-right: 8px;"></span>`;
                            innerHtml += `<div style="display: flex; align-items: center; font-weight: 700; font-size: 16px;">${span}${body}</div>`;
                        });

                        tooltipEl.innerHTML = innerHtml;
                    }

                    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = '1';
                    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
                    tooltipEl.style.fontFamily = 'Inter, sans-serif';
                    // tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
                    // tooltipEl.style.transform = 'translate(-50%, -110%) scale(1)';
                    tooltipEl.style.transform = `translate(-50%, -120%) scale(1)`; 
                }
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.3)',
                    maxTicksLimit: 6,
                    maxRotation: 0
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
        <Box sx={{ width: '100%', height: 400, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{ width: '100%', height: '100%' }}
            >
                <Line options={options} data={data} key={range} />
            </motion.div>
            
            {/* Subtle Scanline Animation */}
            <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "linear",
                    repeatDelay: 2
                }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '40%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent 0%, ${color}10 50%, transparent 100%)`, // Very subtle
                    pointerEvents: 'none',
                    filter: 'blur(20px)',
                    zIndex: 1
                }}
            />
            {/* Custom Tooltip */}
            <div
                ref={tooltipRef}
                style={{
                    opacity: 0,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none',
                    transition: 'all 0.1s ease',
                    zIndex: 100,
                    background: 'rgba(10, 10, 20, 0.85)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    color: '#fff',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    minWidth: '150px'
                }}
            />
        </Box>
    );
};
