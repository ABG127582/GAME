import React from 'react';
import { CalendarIcon } from './Icons';

const DueDateDisplay = ({ dueDate, overdue }: { dueDate: string; overdue: boolean }) => {
    const date = new Date(dueDate + 'T00:00:00');
    const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    return (
        <div className={`due-date-display ${overdue ? 'overdue' : ''}`} title={overdue ? 'Tarefa atrasada!' : `Vence em ${formattedDate}`}>
            <CalendarIcon className="icon" />
            <span>{formattedDate}</span>
        </div>
    );
};

export default DueDateDisplay;