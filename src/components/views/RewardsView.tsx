import React, { useMemo } from 'react';
import { TrophyIcon, ArrowLeftIcon, CalendarIcon } from '../../icons';
import { healthAreas } from '../../data/healthAreas';
import ProgressBar from '../shared/ProgressBar';
import ProgressChart from './ProgressChart';

const RewardsView = ({ userData, setCurrentView, onOpenCalendar }: any) => {
    const totalMedals = Number(Object.values(userData.medals || {}).reduce((total: number, areaMedals: any) => total + Object.keys(areaMedals || {}).length, 0));
    const maxStreak = Math.max(...Object.values(userData.streaks || {}).map((s: any) => Number(s) || 0), 0);

    const medalTrophies = useMemo(() => {
        const trophies = [
            { level: 'Bronze', threshold: 10, color: 'var(--trophy-bronze)' },
            { level: 'Prata', threshold: 50, color: 'var(--trophy-silver)' },
            { level: 'Ouro', threshold: 100, color: 'var(--trophy-gold)' },
        ];
        return trophies.map(trophy => {
            const unlocked = totalMedals >= trophy.threshold;
            return { ...trophy, unlocked };
        });
    }, [totalMedals]);

    const streakTrophies = useMemo(() => {
        const trophies = [
            { level: 'Bronze', threshold: 7, color: 'var(--trophy-bronze)' },
            { level: 'Prata', threshold: 30, color: 'var(--trophy-silver)' },
            { level: 'Ouro', threshold: 100, color: 'var(--trophy-gold)' },
        ];
        return trophies.map(trophy => {
            const unlocked = maxStreak >= trophy.threshold;
            return { ...trophy, unlocked };
        });
    }, [maxStreak]);

    const renderActivityCalendar = (areaKey: string) => {
        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 1); // include today
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 365); // last year

        const dates = Array.from({ length: 366 }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            return date;
        });

        const medalsForArea = userData.medals[areaKey] || {};
        const contributions: { [key: string]: number } = {};
        Object.keys(medalsForArea).forEach(dateStr => {
            contributions[dateStr] = 1; // Simple count, could be more complex
        });

        const maxLevel = 1; // For now just 0 or 1
        const getLevel = (count: number) => {
            if (count === 0) return 0;
            const percentage = count / maxLevel;
            if (percentage < 0.25) return 1;
            if (percentage < 0.5) return 2;
            if (percentage < 0.75) return 3;
            return 4;
        };

        const firstDay = dates[0].getDay();

        return (
            <div className="activity-calendar">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                {dates.map((date, index) => {
                    const count = contributions[date.toDateString()] || 0;
                    const level = getLevel(count);
                    return (
                       <div key={index} className="calendar-day-wrapper" title={`${date.toDateString()}: ${count} medalha(s)`}>
                          <div className={`calendar-day day-level-${level}`}></div>
                       </div>
                    )
                })}
            </div>
        );
    };

    return (
        <div className="view-container">
            <header className="view-header">
                <div className="view-header-content">
                    <button onClick={() => setCurrentView('dashboard')} className="btn btn-ghost" aria-label="Voltar ao painel principal">
                        <ArrowLeftIcon />
                    </button>
                    <div className="text-center mt-6">
                        <TrophyIcon className="mx-auto" style={{width: '4rem', height: '4rem', color: 'var(--accent-yellow)'}}/>
                        <h1 className="text-4xl font-bold mt-4">Suas Conquistas</h1>
                        <p className="text-lg mt-2" style={{color: 'var(--text-secondary)'}}>Celebre seu progresso e visualize sua jornada.</p>
                    </div>
                </div>
            </header>
            <main>
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-center mb-6">Suas Medalhas por Área</h2>
                    <div className="grid md-grid-cols-2 gap-6">
                        {Object.entries(healthAreas).map(([key, area]) => (
                            <div key={key} className="card reward-area-card" style={{'--area-color': `var(--accent-${area.color.split('-')[1]}-500)`} as React.CSSProperties}>
                                <div className="card-content">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="reward-area-icon-wrapper">
                                                <area.icon className="reward-area-icon"/>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{area.name}</h3>
                                                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>
                                                    {userData.medals[key] ? Object.keys(userData.medals[key]).length : 0} medalhas
                                                </p>
                                            </div>
                                        </div>
                                        <button onClick={() => onOpenCalendar(key)} className="btn btn-ghost" aria-label={`Ver calendário de ${area.name}`}>
                                            <CalendarIcon />
                                        </button>
                                    </div>
                                    {renderActivityCalendar(key)}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-center mb-6">Troféus por Medalhas Totais</h2>
                    <div className="grid md-grid-cols-3 gap-6">
                        {medalTrophies.map(trophy => (
                             <div key={trophy.level} className={`card trophy-card ${trophy.unlocked ? 'trophy-unlocked' : ''}`} style={{'--trophy-color': trophy.color} as React.CSSProperties}>
                                <div className="card-content text-center">
                                    <TrophyIcon className="trophy-icon" />
                                    <h3 className="font-bold">Medalhista de {trophy.level}</h3>
                                    <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{trophy.threshold} Medalhas</p>
                                    {trophy.unlocked
                                        ? <span className="trophy-status-unlocked">Conquistado!</span>
                                        : <ProgressBar percentage={(totalMedals / trophy.threshold) * 100} className="mt-2" color={trophy.color} />
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-center mb-6">Troféus por Sequência de Dias</h2>
                    <div className="grid md-grid-cols-3 gap-6">
                        {streakTrophies.map(trophy => (
                             <div key={trophy.level} className={`card trophy-card ${trophy.unlocked ? 'trophy-unlocked' : ''}`} style={{'--trophy-color': trophy.color} as React.CSSProperties}>
                                <div className="card-content text-center">
                                    <TrophyIcon className="trophy-icon" />
                                    <h3 className="font-bold">Sequência de {trophy.level}</h3>
                                    <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{trophy.threshold} Dias Consecutivos</p>
                                    {trophy.unlocked
                                        ? <span className="trophy-status-unlocked">Conquistado!</span>
                                        : <ProgressBar percentage={(maxStreak / trophy.threshold) * 100} className="mt-2" color={trophy.color} />
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <ProgressChart userData={userData} />
            </main>
        </div>
    );
};

export default RewardsView;
