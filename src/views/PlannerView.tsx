import React, { useState } from 'react';
import { Task } from '../types';
import { getStartOfWeek } from '../utils/helpers';
import { healthAreas } from '../utils/config';
import { CalendarDaysIcon, ArrowLeftIcon, ArrowRightIcon, CheckCircle2Icon, CircleIcon } from '../components/Icons';

const PlannerTaskItem = ({ task, onToggle, onShowModal }) => {
    const AreaIcon = healthAreas[task.areaId]?.icon;
    const areaColor = healthAreas[task.areaId]?.color || 'var(--primary)';

    return (
        <div
            className={`planner-task-item ${task.completed ? 'completed' : ''}`}
            style={{ '--area-color': areaColor } as React.CSSProperties}
            onClick={() => onShowModal('recurrence', task)}
        >
            <div className="planner-task-content">
                <button
                    className="planner-task-toggle"
                    onClick={(e) => { e.stopPropagation(); onToggle(task.id, !task.completed); }}
                    aria-label={`Marcar ${task.text} como ${task.completed ? 'não concluída' : 'concluída'}`}
                >
                    {task.completed ? <CheckCircle2Icon className="icon icon-check" /> : <CircleIcon className="icon" />}
                </button>
                <span className="planner-task-text">{task.text}</span>
            </div>
        </div>
    );
};

const PlannerView = ({ tasks, onToggleTask, onShowModal }) => {
    const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()));

    const changeWeek = (amount: number) => {
        setWeekStart(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + (7 * amount));
            return newDate;
        });
    };

    const goToToday = () => {
        setWeekStart(getStartOfWeek(new Date()));
    };

    const days = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        return day;
    });

    const today = new Date();
    const isCurrentWeek = getStartOfWeek(today).getTime() === weekStart.getTime();

    return (
        <div className="view-container planner-container">
             <header className="view-header">
               <div className="view-header-content">
                 <div className="flex items-center gap-4">
                     <div className="task-header-icon-wrapper" style={{ backgroundColor: 'var(--primary)' }}>
                        <CalendarDaysIcon className="icon" style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
                     </div>
                     <div>
                         <h1 className="text-3xl font-bold">Planejador Semanal</h1>
                         <p className="text-lg text-secondary">Planeje seus pequenos passos para a semana.</p>
                     </div>
                 </div>
               </div>
            </header>

            <div className="card">
                <div className="card-content">
                    <div className="planner-header">
                        <h2 className="planner-month-year">
                           {weekStart.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        </h2>
                        <div className="planner-nav">
                            <button onClick={() => changeWeek(-1)} className="btn icon-btn btn-ghost" aria-label="Semana anterior"><ArrowLeftIcon /></button>
                            <button onClick={goToToday} className={`btn btn-ghost today-btn ${isCurrentWeek ? 'disabled': ''}`} disabled={isCurrentWeek}>Hoje</button>
                            <button onClick={() => changeWeek(1)} className="btn icon-btn btn-ghost" aria-label="Próxima semana"><ArrowRightIcon /></button>
                        </div>
                    </div>

                    <div className="planner-grid">
                        {days.map(day => {
                            const dateString = day.toISOString().split('T')[0];
                            const tasksForDay = tasks.filter(t => t.dueDate === dateString);
                            const isToday = day.toDateString() === today.toDateString();

                            return (
                                <div key={dateString} className={`planner-day-column ${isToday ? 'is-today' : ''}`}>
                                    <div className="planner-day-header">
                                        <span className="planner-day-name">{day.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0,3)}</span>
                                        <span className="planner-day-date">{day.getDate()}</span>
                                    </div>
                                    <div className="planner-tasks-list">
                                        {tasksForDay.length > 0 ? tasksForDay.map(task =>
                                            <PlannerTaskItem key={task.id} task={task} onToggle={onToggleTask} onShowModal={onShowModal} />
                                        ) : <div className="planner-no-tasks"></div>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlannerView;