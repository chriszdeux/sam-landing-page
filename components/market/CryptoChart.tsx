// 1-Definir componente de gráfico de criptomonedas
// 2-Obtener despachador y selector de Redux
// 3-Efecto para cargar historial de precios
// 4-Preparar datos y configuración del gráfico
// 5-Renderizar gráfico con tooltip personalizado

'use client';

import React from 'react';
import { Button } from '../ui/Button';
import { Typography } from '../ui/Typography';
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

interface Candle {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    label: string;
}

const CandlestickChart = ({ data, color }: { data: Candle[], color: string }) => {
    const [hoveredCandle, setHoveredCandle] = React.useState<Candle | null>(null);
    const [hoverX, setHoverX] = React.useState<number | null>(null);
    const [hoverY, setHoverY] = React.useState<number | null>(null);
    const svgRef = React.useRef<SVGSVGElement>(null);

    const padding = { top: 20, right: 70, bottom: 30, left: 10 };
    const width = 800;
    const height = 350;

    if (data.length === 0) return null;

    const prices = data.flatMap(c => [c.high, c.low]);
    const maxPrice = Math.max(...prices) * 1.002;
    const minPrice = Math.min(...prices) * 0.998;
    const priceRange = maxPrice - minPrice || 1;

    const getY = (val: number) => {
        return height - padding.bottom - ((val - minPrice) / priceRange) * (height - padding.top - padding.bottom);
    };

    const getX = (idx: number) => {
        const chartWidth = width - padding.left - padding.right;
        return padding.left + (idx / Math.max(1, data.length - 1)) * chartWidth;
    };

    const gridCount = 5;
    const gridValues = Array.from({ length: gridCount }).map((_, i) => {
        return minPrice + (priceRange / (gridCount - 1)) * i;
    });

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        const svgX = (clientX / rect.width) * width;
        const svgY = (clientY / rect.height) * height;

        const chartWidth = width - padding.left - padding.right;
        const pct = (svgX - padding.left) / chartWidth;
        const rawIdx = pct * (data.length - 1);
        const idx = Math.max(0, Math.min(data.length - 1, Math.round(rawIdx)));

        setHoveredCandle(data[idx]);
        setHoverX(getX(idx));
        setHoverY(svgY);
    };

    const handleMouseLeave = () => {
        setHoveredCandle(null);
        setHoverX(null);
        setHoverY(null);
    };

    const candleWidth = Math.max(4, (width - padding.left - padding.right) / data.length * 0.6);

    return (
        <div className="relative h-full w-full">
            <svg
                ref={svgRef}
                viewBox={`0 0 ${width} ${height}`}
                width="100%"
                height="100%"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ overflow: 'visible', background: 'rgba(255,255,255,0.01)', borderRadius: '8px' }}
            >
                {/* Horizontal Grid Lines */}
                {gridValues.map((val, i) => {
                    const y = getY(val);
                    return (
                        <g key={i}>
                            <line
                                x1={padding.left}
                                y1={y}
                                x2={width - padding.right}
                                y2={y}
                                stroke="rgba(255, 255, 255, 0.05)"
                                strokeDasharray="3 3"
                            />
                            <text
                                x={width - padding.right + 5}
                                y={y + 4}
                                fill="rgba(255, 255, 255, 0.3)"
                                fontSize="10"
                                fontFamily="monospace"
                            >
                                {val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                            </text>
                        </g>
                    );
                })}

                {/* Candles */}
                {data.map((candle, idx) => {
                    const cx = getX(idx);
                    const yOpen = getY(candle.open);
                    const yClose = getY(candle.close);
                    const yHigh = getY(candle.high);
                    const yLow = getY(candle.low);
                    
                    const isBullish = candle.close >= candle.open;
                    const candleColor = isBullish ? '#00ff88' : '#ff0055';

                    return (
                        <g key={idx}>
                            {/* Wick */}
                            <line
                                x1={cx}
                                y1={yHigh}
                                x2={cx}
                                y2={yLow}
                                stroke={candleColor}
                                strokeWidth="1.5"
                            />
                            {/* Body */}
                            <rect
                                x={cx - candleWidth / 2}
                                y={Math.min(yOpen, yClose)}
                                width={candleWidth}
                                height={Math.max(2, Math.abs(yOpen - yClose))}
                                fill={isBullish ? 'transparent' : candleColor}
                                stroke={candleColor}
                                strokeWidth="1.5"
                            />
                        </g>
                    );
                })}

                {/* Crosshairs */}
                {hoveredCandle && hoverX !== null && (
                    <g>
                        <line
                            x1={hoverX}
                            y1={padding.top}
                            x2={hoverX}
                            y2={height - padding.bottom}
                            stroke="rgba(255, 255, 255, 0.15)"
                            strokeDasharray="2 2"
                        />
                        <circle cx={hoverX} cy={getY(hoveredCandle.close)} r={4} fill="#00f3ff" />
                    </g>
                )}
            </svg>

            {/* Candlestick Tooltip */}
            {hoveredCandle && hoverX !== null && (
                <div
                    className="absolute z-10 flex flex-col gap-1 rounded-lg border border-white/10 p-3 font-mono text-xs text-white shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md"
                    style={{
                        top: 10,
                        left: hoverX > width / 2 ? '10px' : 'auto',
                        right: hoverX <= width / 2 ? '10px' : 'auto',
                        backgroundColor: 'rgba(10, 10, 20, 0.9)',
                        pointerEvents: 'none',
                        borderLeft: `3px solid ${hoveredCandle.close >= hoveredCandle.open ? '#00ff88' : '#ff0055'}`,
                    }}
                >
                    <Typography variant="caption" className="font-bold text-white/50">
                        {hoveredCandle.label}
                    </Typography>
                    <div className="flex gap-4">
                        <span style={{ color: '#00ff88' }}>O: {hoveredCandle.open.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                        <span style={{ color: '#ff0055' }}>C: {hoveredCandle.close.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                    </div>
                    <div className="flex gap-4">
                        <span>H: {hoveredCandle.high.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                        <span>L: {hoveredCandle.low.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export const CryptoChart = ({ color, cryptoId, range = '1d' }: CryptoChartProps) => {
    const dispatch = useAppDispatch();
    const { historicalData, isLoading } = useAppSelector((state) => state.market);
    const [chartType, setChartType] = React.useState<'line' | 'candles'>('candles');

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
        if (!isDataLoaded || !Array.isArray(chartData)) return Array.from({ length: 24 }, (_, i) => `${i}:00`);
        return chartData.map(d => new Date(d.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    }, [chartData, isDataLoaded]);
    
    const dataPoints = React.useMemo(() => {
        if (!isDataLoaded) {
            return Array.from({ length: 24 }).map((_, i) => {
                const base = 100;
                const change = Math.sin(i * 0.5) * 10 + (i % 2 === 0 ? 5 : -5);
                return base + change;
            });
        }
        return chartData.map(d => d.price);
    }, [chartData, isDataLoaded]);

    const candles = React.useMemo(() => {
        if (!isDataLoaded || !Array.isArray(chartData)) return [];
        
        return chartData.map((d, i) => {
            const close = d.price;
            const open = i > 0 ? (chartData[i - 1]?.price || d.price) : d.price * 0.998;
            const diff = Math.abs(close - open) || d.price * 0.002;
            const high = Math.max(open, close) + diff * (0.2 + Math.random() * 0.5);
            const low = Math.min(open, close) - diff * (0.2 + Math.random() * 0.5);
            
            return {
                timestamp: d.timestamp,
                open,
                high,
                low,
                close,
                label: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
        });
    }, [chartData, isDataLoaded]);

    const tooltipRef = React.useRef<HTMLDivElement>(null);

    if (isLoading && !isDataLoaded) {
        return (
            <div className="flex h-[400px] w-full items-center justify-center rounded-2xl bg-white/[0.02]">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            </div>
        );
    }

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
                external: (context: { chart: ChartJS; tooltip: any }) => {
                    const { chart, tooltip } = context;
                    const tooltipEl = tooltipRef.current;

                    if (!tooltipEl) return;
                    if (tooltip.opacity === 0) {
                        tooltipEl.style.opacity = '0';
                        tooltipEl.style.transform = 'translate(-50%, -100%) scale(0.9)';
                        return;
                    }

                    if (tooltip.body) {
                        const titleLines = tooltip.title || [];
                        const bodyLines = tooltip.body.map((b: { lines: string[] }) => b.lines);

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
                    tooltipEl.style.opacity = '1';
                    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
                    tooltipEl.style.fontFamily = 'Inter, sans-serif';
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
        <div className="flex w-full flex-col gap-4">
            <div className="flex justify-end gap-2">
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setChartType('line')}
                    sx={{
                        color: chartType === 'line' ? '#00f3ff' : 'rgba(255,255,255,0.5)',
                        borderColor: chartType === 'line' ? '#00f3ff' : 'rgba(255,255,255,0.1)',
                        bgcolor: chartType === 'line' ? 'rgba(0, 243, 255, 0.05)' : 'transparent',
                        fontWeight: 'bold',
                        '&:hover': {
                            borderColor: '#00f3ff',
                            bgcolor: 'rgba(0, 243, 255, 0.1)'
                        }
                    }}
                >
                    LÍNEA
                </Button>
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setChartType('candles')}
                    sx={{
                        color: chartType === 'candles' ? '#00f3ff' : 'rgba(255,255,255,0.5)',
                        borderColor: chartType === 'candles' ? '#00f3ff' : 'rgba(255,255,255,0.1)',
                        bgcolor: chartType === 'candles' ? 'rgba(0, 243, 255, 0.05)' : 'transparent',
                        fontWeight: 'bold',
                        '&:hover': {
                            borderColor: '#00f3ff',
                            bgcolor: 'rgba(0, 243, 255, 0.1)'
                        }
                    }}
                >
                    VELAS
                </Button>
            </div>

            <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                {chartType === 'line' ? (
                    <div className="h-full w-full">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            style={{ width: '100%', height: '100%' }}
                        >
                            <Line options={options} data={data} key={range} />
                        </motion.div>
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
                                background: `linear-gradient(90deg, transparent 0%, ${color}10 50%, transparent 100%)`,
                                pointerEvents: 'none',
                                filter: 'blur(20px)',
                                zIndex: 1
                            }}
                        />
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
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <CandlestickChart data={candles} color={color} />
                    </motion.div>
                )}
            </div>
        </div>
    );
};
