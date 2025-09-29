import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../types';
import { CheckCircle2Icon, CircleIcon, RepeatIcon, BellIcon, ClockIcon, PlayIcon, PauseIcon, XIcon } from './Icons';
import DueDateDisplay from './DueDateDisplay';

type TaskItemProps = {
    task: Task;
    onToggle: (id: string, completed: boolean) => void;
    onEdit: (id: string, newText: string) => void;
    onDelete: (id: string) => void;
    onUpdateSettings: (id: string, settings: Partial<Task>) => void;
    onShowModal: (modalName: string, data: any) => void;
};

const TaskItem = ({ task, onToggle, onEdit, onDelete, onUpdateSettings, onShowModal }: TaskItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);
    const [isDisappearing, setIsDisappearing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleToggle = () => {
        if (!task.completed) {
            setIsDisappearing(true);
            setTimeout(() => {
                onToggle(task.id, true);
                setIsDisappearing(false);
            }, 1000); // Match animation duration
        } else {
            onToggle(task.id, false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleSave = () => {
        if (editText.trim()) {
            onEdit(task.id, editText);
        }
        setIsEditing(false);
    };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

    const [timeLeft, setTimeLeft] = useState(task.timeout ? task.timeout * 60 : 0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isTimerRunning && timeLeft > 0) {
            timerRef.current = window.setTimeout(() => {
                setTimeLeft(t => t - 1);
            }, 1000);
        } else if (timeLeft === 0 && isTimerRunning) {
            setIsTimerRunning(false);
            handleToggle(); // Auto-complete task when timer ends
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isTimerRunning, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className={`task-item ${task.completed ? 'completed' : ''} ${isDisappearing ? 'disappearing' : ''}`}>
            <div
              role={task.completed ? undefined : 'button'}
              aria-label={`Marcar ${task.text} como ${task.completed ? 'não concluída' : 'concluída'}`}
              tabIndex={task.completed ? -1 : 0}
              onClick={task.completed ? undefined : handleToggle}
              onKeyPress={(e) => !task.completed && (e.key === 'Enter' || e.key === ' ') && handleToggle()}
              className="task-item-toggle"
             >
                {task.completed ? <CheckCircle2Icon className="icon text-primary icon-check" /> : <CircleIcon className="icon text-secondary" />}
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={handleSave}
                        onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                        className="task-edit-input"
                    />
                ) : (
                    <span className="task-text">{task.text}</span>
                )}
            </div>

            <div className="task-item-actions">
                {task.dueDate && <DueDateDisplay dueDate={task.dueDate} overdue={isOverdue} />}
                 {task.recurrence && task.recurrence !== 'none' && <RepeatIcon className="recurrence-indicator" title={`Recorrência: ${task.recurrence}`} />}
                {task.alarmTime && <BellIcon className="task-alarm-indicator" title={`Alarme às ${task.alarmTime}`} />}
                {isTimerRunning && <div className="timer-display-badge"><ClockIcon className="icon" /> {formatTime(timeLeft)}</div>}

                {!task.completed && (
                    <>
                        {task.timeout && !isTimerRunning &&
                            <button onClick={() => setIsTimerRunning(true)} className="btn btn-sm btn-ghost">
                                <PlayIcon className="icon-left h-4 w-4" /> Iniciar
                            </button>
                        }
                        {isTimerRunning &&
                            <button onClick={() => setIsTimerRunning(false)} className="btn btn-sm btn-ghost">
                                <PauseIcon className="icon-left h-4 w-4" /> Pausar
                            </button>
                        }
                        <button onClick={handleEdit} className="btn icon-btn btn-ghost btn-sm" aria-label="Editar tarefa"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></button>
                        <button onClick={() => onShowModal('recurrence', task)} className="btn icon-btn btn-ghost btn-sm" aria-label="Configurar recorrência"><RepeatIcon className="h-4 w-4" /></button>
                        <button onClick={() => onDelete(task.id)} className="btn icon-btn btn-ghost btn-sm" aria-label="Deletar tarefa"><XIcon className="h-4 w-4" /></button>
                    </>
                )}
            </div>
        </div>
    );
};

export default TaskItem;