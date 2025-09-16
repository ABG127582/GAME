import React, { useState, useEffect, useCallback, useRef } from 'react';
import { XIcon, BellIcon, BellOffIcon, ArrowLeftIcon, ArrowRightIcon, RepeatIcon, SparklesIcon } from '../../icons';
import { healthAreas } from '../../data/healthAreas';

const Modal = ({ isOpen, onClose, title, children, icon: Icon }: any) => {
    const [isClosing, setIsClosing] = useState(false);
    const modalContentRef = useRef<HTMLDivElement>(null);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300); // Corresponds to animation duration
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
             if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, handleClose]);

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div ref={modalContentRef} className={`modal-content ${isClosing ? 'closing' : ''}`}>
                <header className="modal-header">
                    <h2 id="modal-title" className="modal-title">
                        {Icon && <Icon className="mr-2" />}
                        {title}
                    </h2>
                    <button onClick={handleClose} className="btn btn-ghost icon-btn" aria-label="Fechar modal">
                        <XIcon />
                    </button>
                </header>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const AlarmsModal = ({ isOpen, onClose, userData, clearAlarm }: any) => {
    const activeAlarms = Object.entries(userData.alarms || {});

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gerenciar Alarmes" icon={BellIcon}>
            {activeAlarms.length > 0 ? (
                <ul className="alarm-list">
                    {activeAlarms.map(([id, alarm]: [string, any]) => (
                        <li key={id} className="alarm-list-item">
                            <div>
                                <p className="alarm-item-task">{alarm.taskText}</p>
                                <p className="alarm-item-area">{alarm.areaName}</p>
                            </div>
                            <div className="alarm-item-controls">
                                <span className="alarm-time-display">{alarm.time}</span>
                                <button onClick={() => clearAlarm(id)} className="btn btn-ghost">
                                    <BellOffIcon /> Desativar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center" style={{color: 'var(--text-secondary)'}}>
                    Você não tem nenhum alarme ativo no momento.
                </p>
            )}
        </Modal>
    );
};

export const CalendarModal = ({ isOpen, onClose, areaKey, userData }: any) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    if (!areaKey) return null;
    const area = healthAreas[areaKey as keyof typeof healthAreas];
    const medalsForArea = userData.medals[areaKey] || {};

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-modal-day empty"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toDateString();
            const hasMedal = medalsForArea[dateString];
            const isToday = dateString === new Date().toDateString();

            days.push(
                <div
                  key={day}
                  className={`calendar-modal-day ${isToday ? 'is-today' : ''}`}
                  style={hasMedal ? { backgroundColor: `var(--accent-${area.color.split('-')[1]}-500)` } : {}}
                >
                  <span className={hasMedal ? 'has-medal' : ''}>{day}</span>
                </div>
            );
        }
        return days;
    };

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Calendário de ${area.name}`} icon={area.icon}>
            <div className="calendar-modal-nav">
                <button onClick={() => changeMonth(-1)} className="btn btn-ghost icon-btn"><ArrowLeftIcon /></button>
                <span className="calendar-modal-month-year">
                    {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={() => changeMonth(1)} className="btn btn-ghost icon-btn"><ArrowRightIcon /></button>
            </div>
            <div className="calendar-modal-grid">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(day => <div key={day} className="calendar-modal-header">{day}</div>)}
                {renderCalendar()}
            </div>
        </Modal>
    );
};

export const RecurrenceModal = ({ isOpen, onClose, task, onSave, currentRule }: any) => {
    if (!isOpen || !task) return null;
    const [frequency, setFrequency] = useState(currentRule?.frequency || 'none');
    // Ensure endDate is in YYYY-MM-DD format for the input, or empty string
    const [endDate, setEndDate] = useState(currentRule?.endDate ? currentRule.endDate.split('T')[0] : '');

    const frequencyNames: { [key: string]: string } = {
        none: 'Não repetir',
        daily: 'Diariamente',
        weekly: 'Semanalmente',
        monthly: 'Mensalmente'
    };

    const handleSave = () => {
        const rule = frequency === 'none' ? null : {
            frequency,
            endDate: endDate || null
        };
        onSave(task, rule);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Repetir Tarefa`} icon={RepeatIcon}>
            <p className="modal-task-text">"{task.text}"</p>
            <div className="space-y-4">
                <div className="form-group">
                    <label htmlFor="frequency" className="form-label">Frequência</label>
                    <select id="frequency" className="input" value={frequency} onChange={e => setFrequency(e.target.value)}>
                        {Object.entries(frequencyNames).map(([key, name]) => (
                            <option key={key} value={key}>{name}</option>
                        ))}
                    </select>
                </div>
                {frequency !== 'none' && (
                    <div className="form-group">
                        <label htmlFor="endDate" className="form-label">Data de Término (opcional)</label>
                        <input type="date" id="endDate" className="input" value={endDate} onChange={e => setEndDate(e.target.value)} />
                        <p className="form-help-text">A tarefa se repetirá {frequency === 'weekly' ? 'no mesmo dia da semana' : frequency === 'monthly' ? 'no mesmo dia do mês' : ''} em que foi criada.</p>
                    </div>
                )}
            </div>
            <div className="modal-actions">
                <button onClick={onClose} className="btn btn-ghost">Cancelar</button>
                <button onClick={handleSave} className="btn btn-primary">Salvar</button>
            </div>
        </Modal>
    );
};

export const FeatureSuggestionModal = ({ isOpen, onClose, onSubmit }: any) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && description.trim()) {
            onSubmit(name, description);
            setName('');
            setDescription('');
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Sugerir Nova Função" icon={SparklesIcon}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                    <label htmlFor="feature-name" className="form-label">Nome da Função</label>
                    <input
                        id="feature-name"
                        type="text"
                        className="input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Diário de Gratidão"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="feature-description" className="form-label">Descrição</label>
                    <textarea
                        id="feature-description"
                        className="textarea"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descreva como a função deveria funcionar e por que seria útil."
                        required
                    />
                </div>
                <div className="modal-actions">
                    <button type="button" onClick={onClose} className="btn btn-ghost">Cancelar</button>
                    <button type="submit" className="btn btn-primary">Enviar Sugestão</button>
                </div>
            </form>
        </Modal>
    );
};

export default Modal;
