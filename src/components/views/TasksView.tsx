import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
    ArrowLeftIcon, FlameIcon, CheckCircle2Icon, CircleIcon, RepeatIcon, CalendarIcon, MicIcon, BellIcon,
    BellOffIcon, SparklesIcon
} from '../../icons';
import { healthAreas } from '../../data/healthAreas';
import { stretchingExercises } from '../../data/stretchingExercises';
import { focusMusicTracks } from '../../data/focusMusicTracks';
import WeeklyProgressCard from '../shared/WeeklyProgressCard';
import ProgressBar from '../shared/ProgressBar';
import FocusMusicPlayer from '../shared/FocusMusicPlayer';
import { RecurrenceModal } from '../shared/Modal';
import StretchingExercise from '../shared/StretchingExercise';

// This helper function is duplicated here for now. It should be moved to a shared helpers file.
const handleKeyboardClick = (e: React.KeyboardEvent, callback: () => void) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    callback();
  }
};

// This helper function is duplicated here for now. It should be moved to a shared helpers file.
const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// This helper function is duplicated here for now. It should be moved to a shared helpers file.
const formatPace = (ms: number, km: number) => {
    if (km === 0 || ms === 0) return '00:00';
    const paceMsPerKm = ms / km;
    const totalSeconds = Math.floor(paceMsPerKm / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const TasksView = ({
    selectedArea,
    userData,
    setUserData,
    getDayProgress,
    hasMedalToday,
    setCurrentView,
    addCustomTask,
    removeCustomTask,
    updateCustomTask,
    toggleTask,
    setAlarm,
    clearAlarm,
    setDueDate,
    setRecurrence,
    getTasksForDate,
    generateMotivationalPhrase,
    generateAIGoal,
    isGeneratingGoal,
    onOpenCalendar,
    playerState,
    playerControls
}: any) => {
    if (!selectedArea) return null;
    const area = healthAreas[selectedArea as keyof typeof healthAreas];
    const hasMedal = hasMedalToday(selectedArea);
    const streak = userData.streaks[selectedArea] || 0;

    const [progressViewDate, setProgressViewDate] = useState(new Date());
    const progress = getDayProgress(selectedArea, progressViewDate);

    const weeklyGoal = userData.weeklyGoals[selectedArea] || '';
    const todayAchievement = userData.achievements[selectedArea] || '';
    const quickNotes = userData.notes[selectedArea] || '';

    const [motivationalPhrase, setMotivationalPhrase] = useState('');
    const [newTaskText, setNewTaskText] = useState('');
    const [alarmTime, setAlarmTime] = useState<{[key: string]: string}>({});
    const [activeTab, setActiveTab] = useState('checklist');
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null);

    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editingTaskText, setEditingTaskText] = useState('');

    const [isRecurrenceModalOpen, setIsRecurrenceModalOpen] = useState(false);
    const [selectedTaskForRecurrence, setSelectedTaskForRecurrence] = useState<any>(null);

    const dateStringForCompleted = progressViewDate.toDateString();
    const completedTaskIds = useMemo(() => new Set<string>(userData.completedToday[selectedArea]?.[dateStringForCompleted] || []), [userData.completedToday, selectedArea, dateStringForCompleted]);
    const [animatingOutTasks, setAnimatingOutTasks] = useState<Set<string>>(new Set());
    const prevCompletedTaskIdsRef = useRef<Set<string>>(completedTaskIds);


    useEffect(() => {
        const newlyCompleted = [...completedTaskIds].filter(id => !prevCompletedTaskIdsRef.current.has(id));
        if (newlyCompleted.length > 0) {
            const newAnimating = new Set(animatingOutTasks);
            newlyCompleted.forEach(id => newAnimating.add(id));
            setAnimatingOutTasks(newAnimating);

            setTimeout(() => {
                 setAnimatingOutTasks(prev => {
                    const next = new Set(prev);
                    newlyCompleted.forEach(id => next.delete(id));
                    return next;
                });
            }, 1000); // Animation duration
        }
        prevCompletedTaskIdsRef.current = completedTaskIds;
    }, [completedTaskIds, animatingOutTasks]);


    useEffect(() => {
        const phrase = generateMotivationalPhrase(selectedArea);
        setMotivationalPhrase(phrase);
        const timer = setInterval(() => {
            setMotivationalPhrase(generateMotivationalPhrase(selectedArea));
        }, 10000);
        return () => clearInterval(timer);
    }, [selectedArea, generateMotivationalPhrase]);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskText.trim()) {
            addCustomTask(selectedArea, newTaskText.trim());
            setNewTaskText('');
        }
    };

    const handleStartRecording = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Seu navegador não suporta a API de Reconhecimento de Voz.');
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognitionRef.current = recognition;

        recognition.onresult = (event: any) => {
            const speechResult = event.results[0][0].transcript;
            setNewTaskText(speechResult);
            setIsRecording(false);
        };

        recognition.onerror = (event: any) => {
            console.error('Erro no reconhecimento de voz:', event.error);
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognition.start();
        setIsRecording(true);
    };

    const handleStopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const handleToggleRecording = () => {
        if (isRecording) {
            handleStopRecording();
        } else {
            handleStartRecording();
        }
    };

    const handleSaveEdit = (taskId: string) => {
        updateCustomTask(selectedArea, taskId, editingTaskText);
        setEditingTaskId(null);
        setEditingTaskText('');
    };

    const handleDateChange = (taskId: string, date: string) => {
        setDueDate(selectedArea, taskId, date);
    };

    const handleOpenRecurrenceModal = (task: any) => {
        setSelectedTaskForRecurrence(task);
        setIsRecurrenceModalOpen(true);
    };

    const handleSaveRecurrence = (task: any, rule: any) => {
        setRecurrence(selectedArea, task.id, rule);
    };

    const IconComponent = area.icon;
    const allTasks = useMemo(() => getTasksForDate(selectedArea, progressViewDate), [getTasksForDate, selectedArea, progressViewDate]);

    const isToday = progressViewDate.toDateString() === new Date().toDateString();

    const changeProgressDate = (days: number) => {
        setProgressViewDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + days);
            return newDate;
        });
    };

    const Stopwatch = ({ onStop }: { onStop: (time: number) => void }) => {
        const [time, setTime] = useState(0);
        const [isRunning, setIsRunning] = useState(false);
        const timerRef = useRef<number | null>(null);

        const startTimer = () => {
            if (!isRunning) {
                const startTime = Date.now() - time;
                timerRef.current = window.setInterval(() => {
                    setTime(Date.now() - startTime);
                }, 10);
                setIsRunning(true);
            }
        };

        const stopTimer = () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            setIsRunning(false);
        };

        const handleStopAndLog = () => {
            stopTimer();
            onStop(time);
            setTime(0);
        };

        return (
            <div className="card">
                <div className="card-content">
                    <h3 className="card-title mb-4">Cronômetro de Corrida</h3>
                    <div className="stopwatch-container">
                        <p className="stopwatch-display">{formatTime(time)}</p>
                    </div>
                    <div className="flex justify-center gap-4">
                        <button onClick={isRunning ? stopTimer : startTimer} className={`btn ${isRunning ? 'btn-red' : 'btn-green'}`}>
                            {isRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button onClick={handleStopAndLog} className="btn btn-blue" disabled={time === 0}>
                            Parar e Registrar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const RunLogForm = ({ onAddRun }: { onAddRun: (distance: number, time: number) => void }) => {
        const [distance, setDistance] = useState('');
        const [time, setTime] = useState(0);

        const handleStopwatchStop = (recordedTime: number) => {
            setTime(recordedTime);
        };

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (distance && time > 0) {
                onAddRun(parseFloat(distance), time);
                setDistance('');
                setTime(0);
            }
        };

        return (
            <div className="space-y-6">
                <Stopwatch onStop={handleStopwatchStop} />
                <div className="card">
                    <form onSubmit={handleSubmit} className="card-content run-log-form">
                        <h3 className="card-title mb-4">Registrar Corrida</h3>
                         <div className="mb-4">
                            <label htmlFor="time" className="form-label">Tempo da Corrida</label>
                            <input
                                id="time"
                                type="text"
                                className="input"
                                value={formatTime(time)}
                                readOnly
                                aria-label="Tempo da corrida"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="distance" className="form-label">Distância (km)</label>
                            <input
                                id="distance"
                                type="number"
                                step="0.01"
                                className="input"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                placeholder="Ex: 5.2"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-full" disabled={!distance || time === 0}>
                            Adicionar ao Histórico
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    const TaskList = ({ tasks, type }: { tasks: any[], type: 'book' | 'custom' }) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today, for overdue check

        return (
            <ul className="space-y-2">
                {tasks.map((task) => {
                    const isCompleted = completedTaskIds.has(task.id);
                    const isDisappearing = animatingOutTasks.has(task.id);
                    const isEditing = editingTaskId === task.id;

                    const dueDate = userData.dueDates[selectedArea]?.[task.id];
                    const recurrenceRule = userData.recurrenceRules?.[selectedArea]?.[task.id];

                    // Robust overdue check
                    const dueDateObj = dueDate ? new Date(dueDate + 'T00:00:00') : null;
                    const isOverdue = dueDateObj && dueDateObj < today && !isCompleted;

                    if (isCompleted && !isDisappearing && isToday) return null;

                    return (
                        <li key={task.id} className={`task-item ${isCompleted ? 'completed' : ''} ${isDisappearing ? 'disappearing' : ''}`}>
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        value={editingTaskText}
                                        onChange={(e) => setEditingTaskText(e.target.value)}
                                        onBlur={() => handleSaveEdit(task.id)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(task.id)}
                                        className="task-edit-input"
                                        autoFocus
                                    />
                                    <button onClick={() => handleSaveEdit(task.id)} className="btn btn-green">Salvar</button>
                                </>
                            ) : (
                                <>
                                    <div className="task-item-toggle" onClick={() => isToday && toggleTask(selectedArea, task.id)} onKeyDown={(e) => isToday && handleKeyboardClick(e, () => toggleTask(selectedArea, task.id))} tabIndex={isToday ? 0 : -1} role={isToday ? "button" : undefined}>
                                        {isCompleted ? <CheckCircle2Icon className="icon-check" style={{color: 'var(--primary)'}} /> : <CircleIcon />}
                                        <span className="task-text">{task.text}</span>
                                        {recurrenceRule && <RepeatIcon className="recurrence-indicator" title={`Repete ${recurrenceRule.frequency}`} />}
                                        {dueDateObj && (
                                            <div className={`due-date-display ${isOverdue ? 'overdue' : ''}`}>
                                                <CalendarIcon className="icon"/>
                                                <span>{dueDateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                                            </div>
                                        )}
                                    </div>
                                    {isToday && (
                                    <div className="task-item-actions">
                                        <button onClick={() => handleOpenRecurrenceModal(task)} className="btn btn-ghost icon-btn" aria-label="Definir repetição">
                                            <RepeatIcon />
                                        </button>
                                        {userData.alarms[`${selectedArea}-${task.id}`] ? (
                                            <BellIcon className="task-alarm-indicator" />
                                        ) : null}
                                        {type === 'custom' && (
                                            <>
                                                <input
                                                    type="date"
                                                    className="date-input"
                                                    value={dueDate || ''}
                                                    onChange={(e) => handleDateChange(task.id, e.target.value)}
                                                    aria-label={`Data de vencimento para ${task.text}`}
                                                />
                                                <button onClick={() => { setEditingTaskId(task.id); setEditingTaskText(task.text); }} className="btn btn-ghost">Editar</button>
                                                <button onClick={() => removeCustomTask(selectedArea, task.id)} className="btn btn-ghost">Remover</button>
                                            </>
                                        )}
                                    </div>
                                    )}
                                </>
                            )}
                        </li>
                    )
                })}
            </ul>
        );
    };

    return (
        <div className="view-container">
            <header className="view-header">
                <div className="view-header-content">
                    <button onClick={() => setCurrentView('dashboard')} className="btn btn-ghost" aria-label="Voltar ao painel principal">
                        <ArrowLeftIcon />
                    </button>
                    <div className="flex items-center gap-4 mt-6">
                        <div className={`task-header-icon-wrapper ${area.color}`}>
                            <IconComponent className="icon" style={{width: '2.5rem', height: '2.5rem', color: `var(--accent-${area.color.split('-')[1]}-500)`}} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">{area.name}</h1>
                            <p className="text-lg" style={{color: 'var(--text-secondary)'}}>{motivationalPhrase}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 mt-6">
                        <div className="flex items-center gap-2" style={{color: 'var(--accent-orange)'}}>
                            <FlameIcon />
                            <span className="font-bold text-lg">{streak} dias de sequência</span>
                        </div>
                        {hasMedal && (
                            <div className="flex items-center gap-2" style={{color: `var(--accent-${area.color.split('-')[1]}-500)`}}>
                                {area.medalIcon}
                                <span className="font-bold text-lg">Medalha de hoje!</span>
                            </div>
                        )}
                    </div>
                    <div className="mt-6">
                        <div className="flex justify-between text-sm mb-1" style={{color: 'var(--text-secondary)'}}>
                            <span>Progresso de Hoje</span>
                            <span>{progress.completed}/{progress.total}</span>
                        </div>
                        <ProgressBar percentage={progress.percentage} color={`var(--accent-${area.color.split('-')[1]}-500)`} />
                    </div>
                </div>
            </header>

            <main>
                <WeeklyProgressCard areaKey={selectedArea} userData={userData} onOpenCalendar={onOpenCalendar}/>

                <div className="tabs">
                    <div className="tabs-list" role="tablist" aria-label={`Navegação da área de ${area.name}`}>
                        <button id="tab-checklist" role="tab" aria-selected={activeTab === 'checklist'} aria-controls="tab-panel-checklist" onClick={() => setActiveTab('checklist')} className="tab-trigger">
                            Checklist do Dia
                        </button>
                        {selectedArea === 'fisica' && (
                            <>
                                <button id="tab-running" role="tab" aria-selected={activeTab === 'running'} aria-controls="tab-panel-running" onClick={() => setActiveTab('running')} className="tab-trigger">
                                    Corridas
                                </button>
                                <button id="tab-stretching" role="tab" aria-selected={activeTab === 'stretching'} aria-controls="tab-panel-stretching" onClick={() => setActiveTab('stretching')} className="tab-trigger">
                                    Alongamento
                                </button>
                            </>
                        )}
                        {selectedArea === 'mental' && (
                           <button id="tab-focus-music" role="tab" aria-selected={activeTab === 'focusMusic'} aria-controls="tab-panel-focus-music" onClick={() => setActiveTab('focusMusic')} className="tab-trigger">
                               Música de Foco
                           </button>
                        )}
                        <button id="tab-goals" role="tab" aria-selected={activeTab === 'goals'} aria-controls="tab-panel-goals" onClick={() => setActiveTab('goals')} className="tab-trigger">
                           Metas & Reflexões
                        </button>
                        <button id="tab-progress" role="tab" aria-selected={activeTab === 'progress'} aria-controls="tab-panel-progress" onClick={() => setActiveTab('progress')} className="tab-trigger">
                           Progresso Anterior
                        </button>
                    </div>

                    <div hidden={activeTab !== 'checklist'} id="tab-panel-checklist" role="tabpanel" aria-labelledby="tab-checklist" className="tab-content">
                        <div className="card">
                            <div className="card-content">
                                <h3 className="card-title mb-4">Tarefas do Livro</h3>
                                <TaskList tasks={allTasks.filter(t => !t.isCustom)} type="book" />
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-content">
                                <h3 className="card-title mb-4">Suas Tarefas</h3>
                                <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        className="input flex-1"
                                        value={newTaskText}
                                        onChange={(e) => setNewTaskText(e.target.value)}
                                        placeholder="Adicionar nova tarefa..."
                                    />
                                    <button
                                        type="button"
                                        onClick={handleToggleRecording}
                                        className={`btn icon-btn ${isRecording ? 'recording' : ''}`}
                                        aria-label={isRecording ? 'Parar gravação' : 'Gravar tarefa por voz'}
                                    >
                                        <MicIcon />
                                    </button>
                                    <button type="submit" className="btn btn-primary">Adicionar</button>
                                </form>
                                <TaskList tasks={allTasks.filter(t => t.isCustom)} type="custom" />
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-content">
                                <h3 className="card-title mb-4">Alarmes para Tarefas</h3>
                                 <ul className="space-y-2">
                                    {allTasks.map(task => {
                                        const alarmId = `${selectedArea}-${task.id}`;
                                        const existingAlarm = userData.alarms[alarmId];

                                        return (
                                            <li key={task.id} className="task-item">
                                                <span className="task-text flex-1">{task.text}</span>
                                                <div className="task-alarm-controls">
                                                    {existingAlarm ? (
                                                        <>
                                                            <span className="alarm-time-display">{existingAlarm.time}</span>
                                                            <button onClick={() => clearAlarm(alarmId)} className="btn btn-ghost">
                                                                <BellOffIcon />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <input
                                                              type="time"
                                                              className="input alarm-input"
                                                              value={alarmTime[task.id] || ''}
                                                              onChange={(e) => setAlarmTime(prev => ({...prev, [task.id]: e.target.value}))}
                                                              aria-label={`Definir alarme para ${task.text}`}
                                                            />
                                                            <button onClick={() => {
                                                                if(alarmTime[task.id]) {
                                                                    setAlarm(alarmId, task.text, area.name, alarmTime[task.id]);
                                                                }
                                                            }} className="btn btn-primary" disabled={!alarmTime[task.id]}>
                                                                Definir
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {selectedArea === 'fisica' && (
                        <>
                            <div hidden={activeTab !== 'running'} id="tab-panel-running" role="tabpanel" aria-labelledby="tab-running" className="tab-content">
                                <RunLogForm onAddRun={(distance, time) => setUserData((prev: any) => ({ ...prev, runs: [{ date: new Date().toISOString(), distance, time }, ...(prev.runs || [])] }))} />
                                <div className="card">
                                    <div className="card-content">
                                        <h3 className="card-title mb-4">Histórico de Corridas</h3>
                                        {(userData.runs && userData.runs.length > 0) ? (
                                            <ul className="run-history-list">
                                                {userData.runs.map((run: any, index: number) => (
                                                    <li key={index} className="run-history-item">
                                                        <p className="run-item-date">
                                                            {new Date(run.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </p>
                                                        <div className="run-item-stats">
                                                            <span><strong>Distância:</strong> {run.distance.toFixed(2)} km</span>
                                                            <span><strong>Tempo:</strong> {formatTime(run.time)}</span>
                                                            <span><strong>Ritmo:</strong> {formatPace(run.time, run.distance)} /km</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-center" style={{color: 'var(--text-secondary)'}}>Nenhuma corrida registrada ainda.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div hidden={activeTab !== 'stretching'} id="tab-panel-stretching" role="tabpanel" aria-labelledby="tab-stretching" className="tab-content">
                                <div className="stretching-grid">
                                    {stretchingExercises.map(ex => <StretchingExercise key={ex.name} exercise={ex} />)}
                                </div>
                            </div>
                        </>
                    )}

                    {selectedArea === 'mental' && (
                        <div hidden={activeTab !== 'focusMusic'} id="tab-panel-focus-music" role="tabpanel" aria-labelledby="tab-focus-music" className="tab-content">
                            <FocusMusicPlayer playerState={playerState} playerControls={playerControls} />
                        </div>
                    )}

                    <div hidden={activeTab !== 'goals'} id="tab-panel-goals" role="tabpanel" aria-labelledby="tab-goals" className="tab-content">
                        <div className="card">
                           <div className="card-header">
                                <h3 className="card-title">Metas & Reflexões</h3>
                           </div>
                           <div className="card-content space-y-3">
                               <div>
                                   <label htmlFor={`weekly-goal-${selectedArea}`} className="form-label">Minha meta SMART para a semana</label>
                                   <div className="relative">
                                       <textarea
                                           id={`weekly-goal-${selectedArea}`}
                                           className="textarea"
                                           rows={3}
                                           placeholder="Ex: Praticar meditação por 10 min, 5 dias nesta semana, para reduzir o estresse."
                                           value={weeklyGoal}
                                           onChange={(e) => setUserData((prev: any) => ({ ...prev, weeklyGoals: { ...prev.weeklyGoals, [selectedArea]: e.target.value } }))}
                                       />
                                       <button
                                           onClick={() => generateAIGoal(selectedArea)}
                                           className="btn btn-blue absolute bottom-2 right-2"
                                           disabled={isGeneratingGoal}
                                           aria-label="Gerar sugestão de meta com IA"
                                       >
                                           {isGeneratingGoal ? (
                                               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                           ) : (
                                               <SparklesIcon className="w-5 h-5" />
                                           )}
                                           <span className="ml-2 hidden sm:inline">{isGeneratingGoal ? 'Gerando...' : 'Sugestão de IA'}</span>
                                       </button>
                                   </div>
                               </div>
                               <div>
                                   <label htmlFor={`achievement-${selectedArea}`} className="form-label">Conquista ou aprendizado de hoje</label>
                                   <textarea
                                       id={`achievement-${selectedArea}`}
                                       className="textarea"
                                       rows={3}
                                       placeholder="Ex: Consegui manter a calma em uma situação estressante no trabalho."
                                       value={todayAchievement}
                                       onChange={(e) => setUserData((prev: any) => ({ ...prev, achievements: { ...prev.achievements, [selectedArea]: e.target.value } }))}
                                   />
                               </div>
                               <div>
                                   <label htmlFor={`notes-${selectedArea}`} className="form-label">Notas rápidas ou insights</label>
                                   <textarea
                                       id={`notes-${selectedArea}`}
                                       className="textarea"
                                       rows={3}
                                       placeholder="Ex: Percebi que me sinto mais energizado quando durmo antes das 23h."
                                       value={quickNotes}
                                       onChange={(e) => setUserData((prev: any) => ({ ...prev, notes: { ...prev.notes, [selectedArea]: e.target.value } }))}
                                   />
                               </div>
                           </div>
                        </div>
                    </div>

                    <div hidden={activeTab !== 'progress'} id="tab-panel-progress" role="tabpanel" aria-labelledby="tab-progress" className="tab-content">
                       <div className="card">
                            <div className="card-header-with-nav">
                               <h3 className="card-title">Progresso Anterior</h3>
                               <div className="date-navigator">
                                   <button onClick={() => changeProgressDate(-1)} className="btn icon-btn btn-ghost" aria-label="Dia anterior">
                                       <ArrowLeftIcon />
                                   </button>
                                   <span
                                     className={`current-date-display ${!isToday ? 'clickable' : ''}`}
                                     onClick={() => setProgressViewDate(new Date())}
                                     role={!isToday ? "button" : undefined}
                                     tabIndex={!isToday ? 0 : undefined}
                                     onKeyDown={!isToday ? (e) => handleKeyboardClick(e, () => setProgressViewDate(new Date())) : undefined}
                                    >
                                     {isToday ? 'Hoje' : progressViewDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                   </span>
                                   <button onClick={() => changeProgressDate(1)} disabled={isToday} className="btn icon-btn btn-ghost" aria-label="Próximo dia">
                                       <ArrowRightIcon />
                                   </button>
                               </div>
                            </div>
                           <div className="card-content">
                                <p className="text-center font-semibold mb-4 text-lg">
                                    Tarefas concluídas em {progressViewDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                                </p>
                               {(completedTaskIds.size > 0) ? (
                                    <TaskList tasks={allTasks.filter(task => completedTaskIds.has(task.id))} type="custom" />
                                ) : (
                                    <p className="text-center" style={{color: 'var(--text-secondary)'}}>Nenhuma tarefa concluída nesta data.</p>
                                )}
                           </div>
                       </div>
                    </div>
                </div>
            </main>
            <RecurrenceModal
                isOpen={isRecurrenceModalOpen}
                onClose={() => setIsRecurrenceModalOpen(false)}
                task={selectedTaskForRecurrence}
                currentRule={selectedTaskForRecurrence ? userData.recurrenceRules?.[selectedArea]?.[selectedTaskForRecurrence.id] : null}
                onSave={handleSaveRecurrence}
            />
        </div>
    );
};

export default TasksView;
