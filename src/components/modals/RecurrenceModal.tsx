import React, { useState } from 'react';
import { Task } from '../../types';

type RecurrenceModalProps = {
    task: Task;
    onSave: (settings: Partial<Task>) => void;
    onClose: () => void;
};

const RecurrenceModal = ({ task, onSave, onClose }: RecurrenceModalProps) => {
    const [recurrence, setRecurrence] = useState(task.recurrence || 'none');
    const [dueDate, setDueDate] = useState(task.dueDate || '');
    const [alarmTime, setAlarmTime] = useState(task.alarmTime || '');
    const [timeout, setTimeoutValue] = useState(task.timeout ? String(task.timeout) : '');

    const handleSave = () => {
        onSave({
            recurrence,
            dueDate,
            alarmTime: alarmTime || undefined,
            timeout: timeout ? Number(timeout) : undefined,
        });
    };

    return (
        <div className="space-y-4">
            <p className="modal-task-text">{task.text}</p>
            <div className="form-group">
                <label htmlFor="recurrence" className="form-label">Recorrência</label>
                <select id="recurrence" value={recurrence} onChange={(e) => setRecurrence(e.target.value)} className="select">
                    <option value="none">Nenhuma</option>
                    <option value="daily">Diária</option>
                    <option value="weekly">Semanal</option>
                    <option value="weekdays">Dias de Semana</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="dueDate" className="form-label">Data de Vencimento</label>
                <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input" />
            </div>
             <div className="form-group">
                <label htmlFor="alarmTime" className="form-label">Horário do Alarme</label>
                <input type="time" id="alarmTime" value={alarmTime} onChange={(e) => setAlarmTime(e.target.value)} className="input alarm-input" />
            </div>
            <div className="form-group">
                <label htmlFor="timeout" className="form-label">Temporizador (minutos)</label>
                <input type="number" id="timeout" value={timeout} onChange={(e) => setTimeoutValue(e.target.value)} placeholder="Ex: 25" className="input timeout-input" />
                <p className="form-help-text">Adiciona um cronômetro à tarefa. Deixe em branco para nenhum.</p>
            </div>
            <div className="modal-actions">
                <button onClick={onClose} className="btn btn-ghost">Cancelar</button>
                <button onClick={handleSave} className="btn btn-primary">Salvar</button>
            </div>
        </div>
    );
};

export default RecurrenceModal;