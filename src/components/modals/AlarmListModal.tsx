import React from 'react';
import { Task } from '../../types';
import { healthAreas } from '../../utils/config';

type AlarmListModalProps = {
    tasks: Task[];
    onClose: () => void;
};

const AlarmListModal = ({ tasks, onClose }: AlarmListModalProps) => {
    const scheduledTasks = tasks.filter(t => t.alarmTime && t.dueDate && !t.completed);
    return (
        <div>
            {scheduledTasks.length > 0 ? (
                <ul className="alarm-list">
                    {scheduledTasks.map(task => (
                        <li key={task.id} className="alarm-list-item">
                            <div>
                                <p className="alarm-item-task">{task.text}</p>
                                <span className="alarm-item-area">{healthAreas[task.areaId]?.name}</span>
                            </div>
                            <div className="alarm-item-controls">
                                <span className="alarm-time-display">{task.alarmTime}</span>
                                <span className="alarm-time-display">{new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-secondary text-center py-8">Nenhum alarme agendado.</p>
            )}
        </div>
    );
};

export default AlarmListModal;