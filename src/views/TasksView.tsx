import React, { useState, useMemo, useEffect } from 'react';
import { Task, RunLog } from '../types';
import { healthAreas } from '../utils/config';
import { getStartOfWeek, getEndOfWeek } from '../utils/helpers';
import { ArrowLeftIcon, UsersIcon } from '../components/Icons';
import TaskManagement from '../components/TaskManagement';
import RunningTab from '../components/RunningTab';
import StretchingTab from '../components/StretchingTab';
import FocusMusicTab from '../components/FocusMusicTab';

type TasksViewProps = {
    tasks: Task[];
    currentArea: keyof typeof healthAreas | null;
    onAddTask: (task: Partial<Task>) => void;
    onToggleTask: (id: string, completed: boolean) => void;
    onEditTask: (id: string, newText: string) => void;
    onDeleteTask: (id: string) => void;
    onUpdateTaskSettings: (id: string, settings: Partial<Task>) => void;
    onBack: () => void;
    onShowModal: (modalName: string, data?: any) => void;
    runLogs: RunLog[];
    onAddRunLog: (log: Omit<RunLog, 'id'>) => void;
};

const TasksView = ({
    tasks,
    currentArea,
    onAddTask,
    onToggleTask,
    onEditTask,
    onDeleteTask,
    onUpdateTaskSettings,
    onBack,
    onShowModal,
    runLogs,
    onAddRunLog
}: TasksViewProps) => {
    const area = currentArea ? healthAreas[currentArea] : null;
    const areaColor = area?.color || 'var(--primary)';
    const AreaIcon = currentArea ? healthAreas[currentArea]?.icon : null;

    const today = new Date();
    const [viewDate, setViewDate] = useState(today);

    const filteredTasks = useMemo(() => {
        let tasksForDate = tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate + 'T00:00:00'); // Ensure local timezone
            return taskDate.toDateString() === viewDate.toDateString();
        });

        if (currentArea) {
            tasksForDate = tasksForDate.filter(task => task.areaId === currentArea);
        }
        return tasksForDate;
    }, [tasks, viewDate, currentArea]);

    const changeDate = (amount: number) => {
        setViewDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + amount);
            return newDate;
        });
    };

    const [activeTab, setActiveTab] = useState('tasks');
    const isSpecialArea = ['physical', 'mental'].includes(currentArea || '');

    useEffect(() => {
        if (!isSpecialArea) {
            setActiveTab('tasks');
        }
    }, [currentArea, isSpecialArea]);

    const weeklyProgress = useMemo(() => {
        if (!currentArea) return { completed: 0, total: 0 };
        const startOfWeek = getStartOfWeek(new Date());
        const endOfWeek = getEndOfWeek(new Date());

        const weeklyTasks = tasks.filter(t =>
            t.areaId === currentArea &&
            new Date(t.createdAt) >= startOfWeek &&
            new Date(t.createdAt) <= endOfWeek
        );
        const completed = weeklyTasks.filter(t => t.completed).length;
        return { completed, total: weeklyTasks.length };
    }, [tasks, currentArea]);

    return (
        <div className="view-container">
            <header className="view-header">
               <div className="view-header-content">
                 <button className="btn btn-ghost" onClick={onBack} aria-label="Voltar para o dashboard">
                    <ArrowLeftIcon className="icon" />
                 </button>
                 <div className="flex items-center gap-4 mt-4">
                     <div className="task-header-icon-wrapper" style={{ backgroundColor: areaColor }}>
                         {AreaIcon ?
                             <AreaIcon className="icon" style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} /> :
                             <UsersIcon className="icon" style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
                         }
                     </div>
                     <div>
                         <h1 className="text-3xl font-bold">{area ? area.name : 'Todas as Tarefas'}</h1>
                         <p className="text-lg text-secondary">{area ? `Gerencie seus ${area.name.toLowerCase()}` : 'Veja todas as suas atividades'}</p>
                     </div>
                 </div>
               </div>
            </header>

            {currentArea && (
                <div className="card weekly-progress-card" style={{ '--area-color': areaColor } as React.CSSProperties}>
                    <div className="card-content">
                       <div className="weekly-progress-header">
                            <div className="weekly-progress-icon-wrapper">
                                {AreaIcon && <AreaIcon className="weekly-progress-icon" />}
                            </div>
                            <div>
                                <h3 className="weekly-progress-title">Progresso da Meta Semanal</h3>
                                <p className="weekly-progress-area-name">{healthAreas[currentArea].name}</p>
                            </div>
                        </div>
                        <div className="weekly-progress-body">
                            <div className="weekly-progress-dots">
                                {Array.from({ length: 7 }).map((_, i) => (
                                    <div key={i} className={`progress-dot ${i < weeklyProgress.completed ? 'filled' : ''}`}></div>
                                ))}
                            </div>
                            <p className="weekly-progress-text">{weeklyProgress.completed} de 7 dias de atividade nesta semana</p>
                        </div>
                        <button className="btn weekly-progress-button">
                            Ver Relatório de Progresso
                        </button>
                    </div>
                </div>
            )}

            <div className="tabs">
                 <div className="tabs-list">
                    <button className="tab-trigger" role="tab" aria-selected={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')}>Tarefas</button>
                    {currentArea === 'physical' && (
                        <>
                            <button className="tab-trigger" role="tab" aria-selected={activeTab === 'running'} onClick={() => setActiveTab('running')}>Corrida</button>
                            <button className="tab-trigger" role="tab" aria-selected={activeTab === 'stretching'} onClick={() => setActiveTab('stretching')}>Alongamento</button>
                        </>
                    )}
                    {currentArea === 'mental' && (
                        <button className="tab-trigger" role="tab" aria-selected={activeTab === 'focus'} onClick={() => setActiveTab('focus')}>Música Foco</button>
                    )}
                </div>
            </div>

            {activeTab === 'tasks' &&
                <TaskManagement
                    tasks={filteredTasks}
                    onAddTask={onAddTask}
                    onToggleTask={onToggleTask}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onUpdateTaskSettings={onUpdateTaskSettings}
                    currentArea={currentArea}
                    onShowModal={onShowModal}
                    viewDate={viewDate}
                    onChangeDate={changeDate}
                    onSetDate={setViewDate}
                />
            }
            {activeTab === 'running' && <RunningTab runLogs={runLogs} onAddRunLog={onAddRunLog} />}
            {activeTab === 'stretching' && <StretchingTab />}
            {activeTab === 'focus' && <FocusMusicTab />}
        </div>
    );
};

export default TasksView;