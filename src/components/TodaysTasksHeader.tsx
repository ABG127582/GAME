import React, { useMemo } from 'react';
import { Task } from '../types';
import { useUserLocalStorage } from '../hooks/useUserLocalStorage';
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon, TrophyIcon, CircleIcon, ArrowRightIcon } from './Icons';

type TodaysTasksHeaderProps = {
    tasks: Task[];
    onToggleTask: (id: string, completed: boolean) => void;
    onViewChange: (view: string) => void;
};

const TodaysTasksHeader = ({ tasks, onToggleTask, onViewChange }: TodaysTasksHeaderProps) => {
    const [isExpanded, setIsExpanded] = useUserLocalStorage('todaysTasksExpanded', true);

    const todaysTasks = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        return tasks.filter(task => task.dueDate === todayStr);
    }, [tasks]);

    if (todaysTasks.length === 0) {
        return null;
    }

    const completedTasks = todaysTasks.filter(t => t.completed);
    const incompleteTasks = todaysTasks.filter(t => !t.completed);
    const allCompleted = incompleteTasks.length === 0;
    const progress = todaysTasks.length > 0 ? (completedTasks.length / todaysTasks.length) * 100 : 0;

    const toggleExpansion = (e) => {
        if (e.target.closest('button')) {
            e.stopPropagation();
        }
        setIsExpanded(prev => !prev);
    };

    const handleGoToPlanner = () => {
        onViewChange('planner');
    }

    if (!isExpanded) {
        return (
            <div className="todays-tasks-header collapsed" onClick={toggleExpansion} role="button" tabIndex={0} onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && toggleExpansion(e)}>
                <div className="header-content">
                    <CalendarIcon className="icon" />
                    <span className="header-title">Tarefas de Hoje</span>
                    <span className="header-summary">{completedTasks.length}/{todaysTasks.length}</span>
                </div>
                 <div className="header-progress-bar">
                    <div className="header-progress-inner" style={{ width: `${progress}%` }}></div>
                </div>
                <button className="btn icon-btn btn-ghost" aria-label="Expandir tarefas de hoje" onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}>
                    <ChevronDownIcon />
                </button>
            </div>
        );
    }

    return (
        <div className="todays-tasks-header expanded">
            <div className="header-content">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="icon" />
                    <span className="header-title">Tarefas de Hoje</span>
                    <span className="header-summary">({completedTasks.length}/{todaysTasks.length} concluídas)</span>
                </div>
                <button onClick={() => setIsExpanded(false)} className="btn icon-btn btn-ghost" aria-label="Recolher tarefas de hoje">
                    <ChevronUpIcon />
                </button>
            </div>
            <div className="tasks-preview-list">
                {allCompleted ? (
                    <div className="all-completed-message">
                        <TrophyIcon className="icon" />
                        <p>Parabéns! Você concluiu todas as suas tarefas de hoje.</p>
                    </div>
                ) : (
                    <>
                        {incompleteTasks.slice(0, 3).map(task => (
                            <div key={task.id} className="preview-task-item">
                                <button
                                    className="planner-task-toggle"
                                    onClick={() => onToggleTask(task.id, true)}
                                    aria-label={`Marcar ${task.text} como concluída`}
                                >
                                    <CircleIcon className="icon" />
                                </button>
                                <span className="planner-task-text">{task.text}</span>
                            </div>
                        ))}
                        {incompleteTasks.length > 3 && (
                            <button className="btn btn-ghost see-all-btn" onClick={handleGoToPlanner}>
                                Ver mais {incompleteTasks.length - 3} tarefas
                                <ArrowRightIcon className="icon-right" />
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TodaysTasksHeader;