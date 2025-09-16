import React, { useState, useMemo, useRef } from 'react';
import { healthAreas } from '../../data/healthAreas';

const ProgressChart = ({ userData }: any) => {
    const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
    const chartData = useMemo(() => {
        const data: { [key: string]: { [key: string]: number } } = {};
        const today = new Date();
        const days = timeframe === 'week' ? 7 : 30;

        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            data[dateString] = {};
            for (const areaKey in healthAreas) {
                data[dateString][areaKey] = 0;
            }
        }

        if(userData.medals) {
            for (const areaKey in userData.medals) {
                for (const dateStr in userData.medals[areaKey]) {
                    const medalDate = new Date(dateStr);
                    const diffDays = Math.floor((today.getTime() - medalDate.getTime()) / (1000 * 3600 * 24));
                    if (diffDays < days) {
                        const formattedDate = medalDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                        if(data[formattedDate]) {
                           data[formattedDate][areaKey] = 1;
                        }
                    }
                }
            }
        }

        return Object.entries(data).reverse().map(([label, values]) => ({ label, values }));

    }, [timeframe, userData.medals]);

    const Chart = () => {
        const [tooltip, setTooltip] = useState<any>(null);
        const svgRef = useRef(null);

        const width = 800;
        const height = 400;
        const margin = { top: 20, right: 20, bottom: 40, left: 40 };

        const xScale = (index: number) => margin.left + (index * (width - margin.left - margin.right)) / (chartData.length - 1);
        const yScale = (value: number) => height - margin.bottom - value * (height - margin.top - margin.bottom);

        const areaKeys = Object.keys(healthAreas);

        return (
            <div className="chart-wrapper">
                <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="chart-svg">
                    {/* Y-axis grid lines */}
                    {Array.from({ length: 9 }).map((_, i) => (
                        <line
                            key={`grid-${i}`}
                            className="grid-line"
                            x1={margin.left}
                            x2={width - margin.right}
                            y1={yScale(i)}
                            y2={yScale(i)}
                        />
                    ))}

                    {/* Bars */}
                    {chartData.map((d, i) => {
                        let yOffset = 0;
                        return (
                            <g key={d.label} onMouseMove={(e) => {
                                const total = Object.values(d.values).reduce((s: number, v: number) => s + v, 0);
                                if (total > 0) {
                                  const svgRect = (svgRef.current as any).getBoundingClientRect();
                                  setTooltip({ x: e.clientX - svgRect.left, y: e.clientY - svgRect.top, label: d.label, values: d.values });
                                }
                            }} onMouseLeave={() => setTooltip(null)}>
                                {areaKeys.map(key => {
                                    const value = d.values[key];
                                    if (value === 0) return null;
                                    const barHeight = (height - margin.top - margin.bottom) / Object.keys(healthAreas).length;
                                    const y = yScale(yOffset + value);
                                    yOffset += value;
                                    const area = healthAreas[key as keyof typeof healthAreas];
                                    const color = `var(--accent-${area.color.split('-')[1]}-500)`;
                                    return (
                                        <rect
                                            key={key}
                                            className="chart-bar"
                                            x={xScale(i) - 10}
                                            y={y - barHeight + 1}
                                            width={20}
                                            height={barHeight - 2}
                                            fill={color}
                                            rx="2"
                                        />
                                    );
                                })}
                            </g>
                        );
                    })}
                     {/* X-axis labels */}
                    {chartData.map((d, i) => (
                       i % Math.floor(chartData.length / 10) === 0 && (
                        <text key={`label-${i}`} className="axis-label" x={xScale(i)} y={height - 15}>
                            {d.label}
                        </text>
                       )
                    ))}
                    {/* Tooltip */}
                    {tooltip && (
                        <g transform={`translate(${tooltip.x + 10}, ${tooltip.y - 60})`}>
                            <rect className="chart-tooltip-bg" width="150" height="130" rx="5" />
                            <text className="chart-tooltip-text" x="10" y="20" fontWeight="bold">{tooltip.label}</text>
                            {Object.entries(tooltip.values).filter(([, value]) => value > 0).map(([key, value], i) => (
                                <text key={key} className="chart-tooltip-text" x="10" y={40 + i * 18}>
                                    - {healthAreas[key as keyof typeof healthAreas].name}
                                </text>
                            ))}
                        </g>
                    )}
                </svg>
            </div>
        );
    };

    return (
        <section>
            <div className="card">
                <div className="card-content">
                    <div className="chart-header">
                        <h2 className="text-2xl font-bold">Gráfico de Progresso</h2>
                        <div className="timeframe-toggle">
                            <button onClick={() => setTimeframe('week')} className={`toggle-btn ${timeframe === 'week' ? 'active' : ''}`}>7 Dias</button>
                            <button onClick={() => setTimeframe('month')} className={`toggle-btn ${timeframe === 'month' ? 'active' : ''}`}>30 Dias</button>
                        </div>
                    </div>
                    <div className="progress-chart-container">
                        <Chart />
                    </div>
                     <div className="chart-legend">
                        {Object.entries(healthAreas).map(([key, area]) => (
                            <div key={key} className="legend-item">
                                <div className="legend-color-box" style={{backgroundColor: `var(--accent-${area.color.split('-')[1]}-500)`}}></div>
                                <span>{area.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProgressChart;
