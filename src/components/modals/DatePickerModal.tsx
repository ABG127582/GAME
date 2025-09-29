import React, { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '../Icons';

type DatePickerModalProps = {
    currentDate: Date;
    onDateSelect: (date: Date) => void;
    onClose: () => void;
};

const DatePickerModal = ({ currentDate, onDateSelect, onClose }: DatePickerModalProps) => {
    const [displayDate, setDisplayDate] = useState(currentDate || new Date());

    const changeMonth = (amount: number) => {
        setDisplayDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    const startOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1);
    const endOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0);
    const startDayOfWeek = startOfMonth.getDay(); // 0 = Sunday, 1 = Monday...
    const daysInMonth = endOfMonth.getDate();

    const days = [];
    for(let i=0; i<startDayOfWeek; i++) {
        days.push(<div key={`empty-start-${i}`} className="calendar-modal-day empty"></div>);
    }
    for(let i=1; i<=daysInMonth; i++) {
        const dayDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), i);
        const isSelected = currentDate?.toDateString() === dayDate.toDateString();
        const isToday = new Date().toDateString() === dayDate.toDateString();

        days.push(
            <button
                key={i}
                onClick={() => onDateSelect(dayDate)}
                className={`calendar-modal-day ${isSelected ? 'selected' : ''} ${isToday ? 'is-today' : ''}`}
            >
                {i}
            </button>
        );
    }

    return (
        <div>
            <div className="calendar-modal-nav">
                <button onClick={() => changeMonth(-1)} className="btn btn-ghost icon-btn"><ArrowLeftIcon /></button>
                <span className="calendar-modal-month-year">{displayDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                <button onClick={() => changeMonth(1)} className="btn btn-ghost icon-btn"><ArrowRightIcon /></button>
            </div>
            <div className="calendar-modal-grid">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => <div key={i} className="calendar-modal-header">{day}</div>)}
                {days}
            </div>
        </div>
    );
};

export default DatePickerModal;