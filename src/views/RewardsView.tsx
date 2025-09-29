import React, { useMemo } from 'react';
import { Task } from '../types';
import { trophies, healthAreas } from '../utils/config';
import { calculateStreak } from '../utils/helpers';
import ProgressBar from '../components/ProgressBar';

const ActivityCalendar = ({ tasks }: { tasks: Task[] }) => {
    const today = new Date();
    // Go back ~16 weeks to fill the calendar
    const startDate = new Date();
    startDate.setDate(today.getDate() - (16 * 7) - today.getDay());

    const tasksByDate = useMemo(() => {
        const map = new Map<string, number>();
        tasks.forEach(task => {
            if (task.completedAt) {
                const date = task.completedAt.split('T')[0];
                map.set(date, (map.get(date) || 0) + 1);
            }
        });
        return map;
    }, [tasks]);

    const days = [];
    let currentDate = new Date(startDate);
    const totalDays = 17 * 7;

    for (let i = 0; i < totalDays; i++) {
        const dateString = currentDate.toISOString().split('T')[0];
        const count = tasksByDate.get(dateString) || 0;
        let level = 0;
        if (count > 0) level = 1;
        if (count >= 3) level = 2;
        if (count >= 5) level = 3;
        if (count >= 8) level = 4;

        days.push(
            <div key={dateString} className="calendar-day-wrapper" title={`${count} tarefas em ${currentDate.toLocaleDateString()}`}>
                 <div className={`calendar-day day-level-${level}`}></div>
            </div>
        );
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return <div className="activity-calendar">{days}</div>;
};

const RewardsView = ({ tasks }: { tasks: Task[] }) => {
    const completedTasks = useMemo(() => tasks.filter(t => t.completed), [tasks]);

    const unlockedTrophies = useMemo(() => {
        const streak = calculateStreak(completedTasks);
        const unlocked: { [key: string]: number } = {};

        // Streaks
        if (streak >= 7) unlocked['streak-7'] = 1; else unlocked['streak-7'] = streak / 7;
        if (streak >= 30) unlocked['streak-30'] = 1; else unlocked['streak-30'] = streak / 30;

        // Total tasks
        if (completedTasks.length >= 100) unlocked['tasks-100'] = 1; else unlocked['tasks-100'] = completedTasks.length / 100;
        if (completedTasks.length >= 500) unlocked['tasks-500'] = 1; else unlocked['tasks-500'] = completedTasks.length / 500;

        // Area master
        const tasksByArea = completedTasks.reduce((acc, task) => {
            acc[task.areaId] = (acc[task.areaId] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });
        const maxAreaCount = Math.max(0, ...Object.values(tasksByArea));
        if (maxAreaCount >= 50) unlocked['area-master'] = 1; else unlocked['area-master'] = maxAreaCount / 50;


        // TODO: Perfect week
        unlocked['perfect-week'] = 0.3; // Placeholder

        return unlocked;
    }, [completedTasks]);

    return (
        <div className="view-container">
            <header className="view-header">
               <div className="view-header-content">
                    <h1 className="text-3xl font-bold">Conquistas</h1>
                    <p className="text-lg text-secondary">Seu Hall da Fama pessoal.</p>
                </div>
            </header>

            <section className="mb-12">
                <h2 className="section-title">Medalhas por Território</h2>
                 <div className="grid md-grid-cols-2 lg-grid-cols-3 gap-6">
                    {Object.entries(healthAreas).map(([id, area]) => {
                        const areaTasks = completedTasks.filter(t => t.areaId === id).length;
                        const progress = Math.min(areaTasks / 50, 1);
                        return (
                            <div key={id} className="card text-center reward-area-card" style={{ '--area-color': area.color } as React.CSSProperties}>
                                <div className="card-content">
                                    <div className="reward-area-icon-wrapper">
                                        <area.icon className="reward-area-icon" />
                                    </div>
                                    <h3 className="text-lg font-bold">{area.name}</h3>
                                    <p className="text-sm text-secondary mb-4">{areaTasks} tarefas concluídas</p>
                                    <ProgressBar progress={progress * 100} color={area.color} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

             <section className="mb-12">
                <h2 className="section-title">Troféus</h2>
                <div className="grid md-grid-cols-2 lg-grid-cols-3 gap-6">
                     {Object.entries(trophies).map(([id, trophy]) => {
                        const progress = unlockedTrophies[id] || 0;
                        const isUnlocked = progress >= 1;
                        const trophyColor = isUnlocked ? trophy.color : 'var(--border)';

                        return (
                             <div key={id} className={`card text-center trophy-card ${isUnlocked ? 'trophy-unlocked' : ''}`} style={{ '--trophy-color': trophy.color } as React.CSSProperties}>
                                <div className="card-content">
                                    <trophy.icon className="trophy-icon" />
                                    <h3 className={`font-bold text-lg ${isUnlocked ? 'trophy-status-unlocked' : ''}`}>{trophy.name}</h3>
                                    <p className="text-sm text-secondary h-10">{trophy.description}</p>
                                    {!isUnlocked &&
                                        <div className="mt-4 trophy-progress">
                                            <ProgressBar progress={progress * 100} color={trophy.color} />
                                        </div>
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section>
                <h2 className="section-title">Calendário de Atividade</h2>
                <div className="card">
                    <div className="card-content">
                        <ActivityCalendar tasks={completedTasks} />
                    </div>
                </div>
            </section>

        </div>
    );
};

export default RewardsView;