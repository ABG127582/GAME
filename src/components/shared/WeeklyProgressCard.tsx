import React, { useMemo } from 'react';
import { healthAreas } from '../../data/healthAreas';

const WeeklyProgressCard = ({ areaKey, userData, onOpenCalendar }: any) => {
    const area = healthAreas[areaKey as keyof typeof healthAreas];

    const weeklyMedals = useMemo(() => {
        const medals = userData.medals[areaKey] || {};
        let count = 0;
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0=Sun, 6=Sat
        const startOfWeek = new Date(today);
        // Set to Monday of the current week
        startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        startOfWeek.setHours(0, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(startOfWeek);
            currentDay.setDate(startOfWeek.getDate() + i);
            if (medals[currentDay.toDateString()]) {
                count++;
            }
        }
        return count;
    }, [userData.medals, areaKey]);

    const IconComponent = area.icon;

    return (
        <div className="card weekly-progress-card" style={{'--area-color': `var(--accent-${area.color.split('-')[1]}-500)`} as React.CSSProperties}>
            <div className="card-content">
                <div className="weekly-progress-header">
                    <div className="weekly-progress-icon-wrapper">
                       <IconComponent className="weekly-progress-icon" />
                    </div>
                    <div>
                        <h3 className="weekly-progress-title">Progresso da Semana</h3>
                        <p className="weekly-progress-area-name">{area.name}</p>
                    </div>
                </div>
                <div className="weekly-progress-body">
                     <div className="weekly-progress-dots">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div key={i} className={`progress-dot ${i < weeklyMedals ? 'filled' : ''}`}></div>
                        ))}
                    </div>
                    <p className="weekly-progress-text">{weeklyMedals} de 7 dias com medalha</p>
                </div>
                <button className="btn weekly-progress-button" onClick={() => onOpenCalendar(areaKey)}>
                    Ver Calendário de Atividade
                </button>
            </div>
        </div>
    );
};

export default WeeklyProgressCard;
