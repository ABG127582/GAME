import React, { useState, useMemo } from 'react';
import { Task } from '../types';
import { healthAreas } from '../utils/config';

const ProgressChart = ({ tasks }) => {
    const [timeframe, setTimeframe] = useState('week'); // 'week', 'month', 'all'

    const data = useMemo(() => {
        // This is a simplified data processing logic
        const completed = tasks.filter(t => t.completed && t.completedAt);
        const grouped = completed.reduce((acc, task) => {
            const date = new Date(task.completedAt!).toLocaleDateString('pt-BR');
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        // Return last 7 days for 'week'
        const chartData = Object.entries(grouped).slice(-7).map(([label, value]) => ({ label, value: value as number }));

        return chartData;
    }, [tasks, timeframe]);

    const maxValue = Math.max(...data.map(d => d.value), 1);
    const barWidth = 90 / (data.length || 1);

    return (
        <div>
            <div className="chart-header">
                <h3 className="text-lg font-bold">Tarefas Concluídas</h3>
                {/* Timeframe toggle buttons would go here */}
            </div>
            <div className="chart-wrapper">
                <svg className="chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Y-axis lines (simplified) */}
                    <line x1="5" y1="10" x2="95" y2="10" className="grid-line" />
                    <line x1="5" y1="50" x2="95" y2="50" className="grid-line" />
                    <line x1="5" y1="90" x2="95" y2="90" className="grid-line" />
                    {/* Bars */}
                    {data.map(({ label, value }, index) => (
                        <rect
                            key={label}
                            x={5 + index * barWidth}
                            y={90 - (value / maxValue) * 80}
                            width={barWidth * 0.8}
                            height={(value / maxValue) * 80}
                            fill={healthAreas.physical.color}
                            className="chart-bar"
                        />
                    ))}
                    {/* X-axis labels (simplified) */}
                     {data.map(({ label }, index) => (
                         <text key={label} x={5 + index * barWidth + barWidth * 0.4} y="98" className="axis-label">
                            {label.substring(0,5)}
                         </text>
                     ))}
                </svg>
            </div>
             {/* Legend would go here */}
        </div>
    );
};

const ProgressView = ({ tasks }: { tasks: Task[] }) => {
    return (
        <div className="view-container">
            <header className="view-header">
               <div className="view-header-content">
                <h1 className="text-3xl font-bold">Meu Progresso</h1>
                <p className="text-lg text-secondary">Visualize sua jornada de crescimento.</p>
                </div>
            </header>
            <div className="card">
                <div className="card-content progress-chart-container">
                    <ProgressChart tasks={tasks} />
                </div>
            </div>
        </div>
    );
};

export default ProgressView;