import React, { useState } from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';
import TaskInspiration from './TaskInspiration';
import { PlusIcon, BellIcon, ArrowLeftIcon, ArrowRightIcon, CalendarIcon } from './Icons';

type TaskManagementProps = {
    tasks: Task[];
    onAddTask: (task: Partial<Task>) => void;
    onToggleTask: (id: string, completed: boolean) => void;
    onEditTask: (id: string, newText: string) => void;
    onDeleteTask: (id: string) => void;
    onUpdateTaskSettings: (id: string, settings: Partial<Task>) => void;
    currentArea: keyof typeof import('../utils/config').healthAreas | null;
    onShowModal: (modalName: string, data?: any) => void;
    viewDate: Date;
    onChangeDate: (amount: number) => void;
    onSetDate: (date: Date) => void;
};

const TaskManagement = ({
    tasks,
    onAddTask,
    onToggleTask,
    onEditTask,
    onDeleteTask,
    onUpdateTaskSettings,
    currentArea,
    onShowModal,
    viewDate,
    onChangeDate,
    onSetDate,
}: TaskManagementProps) => {
    const [newTaskText, setNewTaskText] = useState('');

    const handleAddTask = () => {
        if (newTaskText.trim()) {
            onAddTask({
                text: newTaskText,
                areaId: currentArea || 'social',
                dueDate: viewDate.toISOString().split('T')[0]
            });
            setNewTaskText('');
        }
    };

    const today = new Date();
    const isToday = viewDate.toDateString() === today.toDateString();

    const formatDate = (date: Date) => {
        if(date.toDateString() === today.toDateString()) return "Hoje";
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        if(date.toDateString() === tomorrow.toDateString()) return "Amanhã";
        return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric' });
    }

    return (
        <>
            {currentArea && <TaskInspiration area={currentArea} onSelectSuggestion={setNewTaskText} />}
            <div className="card">
                <div className="card-content">
                    <div className="card-header-with-nav">
                        <h2 className="text-xl font-bold">Tarefas para {formatDate(viewDate)}</h2>
                         <div className="date-navigator">
                            <button onClick={() => onChangeDate(-1)} className="btn icon-btn btn-ghost" aria-label="Dia anterior"><ArrowLeftIcon /></button>
                            <span
                                className={`current-date-display ${!isToday ? 'clickable' : ''}`}
                                onClick={() => !isToday && onSetDate(today)}
                                aria-label="Voltar para hoje"
                            >
                                {viewDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                            </span>
                            <button onClick={() => onChangeDate(1)} className="btn icon-btn btn-ghost" aria-label="Próximo dia"><ArrowRightIcon /></button>
                            <button onClick={() => onShowModal('datepicker', { currentDate: viewDate, onDateSelect: onSetDate })} className="btn icon-btn btn-ghost" aria-label="Selecionar data"><CalendarIcon /></button>
                        </div>
                    </div>

                    <div className="tab-content">
                        {tasks.length > 0 ? tasks.map(task =>
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggle={onToggleTask}
                                onEdit={onEditTask}
                                onDelete={onDeleteTask}
                                onUpdateSettings={onUpdateTaskSettings}
                                onShowModal={onShowModal}
                            />) :
                            <p className="text-secondary text-center py-8">Nenhuma tarefa para este dia. Adicione uma abaixo!</p>
                        }
                    </div>

                    <div className="mt-6 flex gap-2">
                        <input
                            type="text"
                            className="input flex-1"
                            placeholder="Adicionar um pequeno passo..."
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                        />
                        <button onClick={handleAddTask} className="btn btn-primary" aria-label="Adicionar tarefa">
                            <PlusIcon className="icon" />
                        </button>
                        <button onClick={() => onShowModal('alarms')} className="btn btn-ghost icon-btn" aria-label="Ver alarmes">
                             <BellIcon className="icon" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TaskManagement;