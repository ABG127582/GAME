import React, { useState } from 'react';
import { UserData, HealthAreaKey } from '../types/types';
import { healthAreas } from '../data/healthAreas';
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  CircleIcon,
  PlusIcon,
  XIcon,
  BellIcon,
  BellOffIcon,
  SparklesIcon,
  TargetIcon,
  AwardIcon,
  MicIcon,
  BookOpenIcon,
  TrendingUpIcon,
  FlameIcon,
} from '../icons';

interface TasksViewProps {
  selectedArea: string | null;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  getDayProgress: (areaKey: string) => { completed: number; total: number; percentage: number };
  hasMedalToday: (areaKey: string) => boolean;
  toggleTask: (areaKey: string, taskType: string, taskIndex: number) => void;
  addCustomTask: (areaKey: string, taskText: string) => void;
  removeCustomTask: (areaKey: string, taskIndex: number) => void;
  setAlarm: (areaKey: string, taskType: string, taskIndex: number, time: string) => void;
  clearAlarm: (areaKey: string, taskType: string, taskIndex: number) => void;
  generateMotivationalPhrase: (areaKey: string) => string;
  setCurrentView: (view: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  selectedArea,
  userData,
  setUserData,
  getDayProgress,
  hasMedalToday,
  toggleTask,
  addCustomTask,
  removeCustomTask,
  setAlarm,
  clearAlarm,
  generateMotivationalPhrase,
  setCurrentView,
}) => {
  if (!selectedArea) return null;
  const area = healthAreas[selectedArea as HealthAreaKey];
  const progress = getDayProgress(selectedArea);
  const hasMedal = hasMedalToday(selectedArea);
  const streak = userData.streaks[selectedArea] || 0;
  const today = new Date().toDateString();
  const completedTasks = (userData.completedToday[selectedArea] || {})[today] || [];

  const [weeklyGoal, setWeeklyGoal] = useState(userData.weeklyGoals[selectedArea] || '');
  const [todayAchievement, setTodayAchievement] = useState(userData.achievements[selectedArea] || '');
  const [quickNotes, setQuickNotes] = useState(userData.notes[selectedArea] || '');
  const [motivationalPhrase, setMotivationalPhrase] = useState('');
  const [newTaskText, setNewTaskText] = useState('');
  const [alarmTime, setAlarmTime] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState('checklist');

  const IconComponent = area.icon;

  return (
    <div>
      <header className="view-header">
        <div className="view-header-content">
          <div className="flex items-center gap-4 mb-6">
            <button className="btn btn-ghost" onClick={() => setCurrentView('dashboard')}>
              <ArrowLeftIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} /> Voltar
            </button>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="task-header-icon-wrapper" style={{ backgroundColor: `var(--${area.color.replace('bg-', '--accent-')})`, color: 'white' }}>
              <IconComponent style={{ width: '2rem', height: '2rem' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{area.name}</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Baseado no livro "Pequenos Passos para uma Vida Extraordinária"</p>
            </div>
          </div>
          <div className="grid md-grid-cols-3 gap-4">
            <div className="card"><div className="card-content text-center">
              <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{progress.completed}/{progress.total}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Tarefas Concluídas</div>
              <div className="progress-bar" style={{ marginTop: '0.5rem' }}><div className="progress-bar-inner" style={{ width: `${progress.percentage}%` }}></div></div>
            </div></div>
            <div className="card"><div className="card-content text-center">
              <div className="flex items-center justify-center gap-2" style={{ marginBottom: '0.25rem' }}>
                <FlameIcon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--accent-orange)' }} />
                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{streak}</span>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Dias Seguidos</div>
            </div></div>
            <div className="card"><div className="card-content text-center">
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{hasMedal ? area.medalIcon : '○'}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{hasMedal ? area.medalName : 'Medalha Pendente'}</div>
            </div></div>
          </div>
        </div>
      </header>
      <main className="view-container" style={{ maxWidth: '56rem' }}>
        <div className="tabs">
          <div className="tabs-list">
            <button className="tab-trigger" data-state={activeTab === 'checklist' ? 'active' : ''} onClick={() => setActiveTab('checklist')}>Checklist Diário</button>
            <button className="tab-trigger" data-state={activeTab === 'goals' ? 'active' : ''} onClick={() => setActiveTab('goals')}>Metas & Reflexões</button>
            <button className="tab-trigger" data-state={activeTab === 'notes' ? 'active' : ''} onClick={() => setActiveTab('notes')}>Notas Rápidas</button>
          </div>
          {activeTab === 'checklist' && <div className="tab-content">
            <div className="card"><div className="card-content">
              <h3 className="flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
                <CheckCircle2Icon style={{ color: 'var(--primary)' }} /> Tarefas Baseadas no Livro
              </h3>
              <div className="space-y-3">
                {area.bookTasks.map((task, index) => {
                  const isCompleted = completedTasks.includes(`book-${index}`);
                  const taskId = `${selectedArea}-book-${index}`;
                  const currentAlarm = userData.alarms[taskId];
                  return (<div key={taskId} className={`task-item ${isCompleted ? 'completed' : ''}`}>
                    <div className="task-item-toggle" onClick={() => toggleTask(selectedArea, 'book', index)}>
                      {isCompleted ? <CheckCircle2Icon className="flex-shrink-0" /> : <CircleIcon className="flex-shrink-0" />}
                      <span className="task-text">{task}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentAlarm ? <button className="btn btn-ghost icon-btn" onClick={() => clearAlarm(selectedArea, 'book', index)}><BellOffIcon /></button> : <input type="time" className="input" value={alarmTime[taskId] || ''} onChange={e => setAlarmTime(p => ({ ...p, [taskId]: e.target.value }))} />}
                      <button className="btn btn-ghost icon-btn" onClick={() => setAlarm(selectedArea, 'book', index, alarmTime[taskId])}><BellIcon /></button>
                    </div>
                  </div>);
                })}
              </div>
            </div></div>
            <div className="card"><div className="card-content">
              <h3 className="flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
                <PlusIcon style={{ color: 'var(--primary)' }} /> Minhas Tarefas Personalizadas
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input type="text" placeholder="Adicionar nova tarefa..." value={newTaskText} onChange={e => setNewTaskText(e.target.value)} className="input flex-1" onKeyPress={e => { if (e.key === 'Enter') { addCustomTask(selectedArea, newTaskText); setNewTaskText(''); } }} />
                  <button className="btn btn-green" onClick={() => { addCustomTask(selectedArea, newTaskText); setNewTaskText(''); }}><PlusIcon /></button>
                </div>
                {(userData.customTasks[selectedArea] || []).map((task: string, index: number) => {
                  const isCompleted = completedTasks.includes(`custom-${index}`);
                  const taskId = `${selectedArea}-custom-${index}`;
                  const currentAlarm = userData.alarms[taskId];
                  return (<div key={taskId} className={`task-item ${isCompleted ? 'completed' : ''}`}>
                    <div className="task-item-toggle" onClick={() => toggleTask(selectedArea, 'custom', index)}>
                      {isCompleted ? <CheckCircle2Icon className="flex-shrink-0" /> : <CircleIcon className="flex-shrink-0" />}
                      <span className="task-text">{task}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentAlarm ? <button className="btn btn-ghost icon-btn" onClick={() => clearAlarm(selectedArea, 'custom', index)}><BellOffIcon /></button> : <input type="time" className="input" value={alarmTime[taskId] || ''} onChange={e => setAlarmTime(p => ({ ...p, [taskId]: e.target.value }))} />}
                      <button className="btn btn-ghost icon-btn" onClick={() => setAlarm(selectedArea, 'custom', index, alarmTime[taskId])}><BellIcon /></button>
                    </div>
                    <button className="btn btn-ghost icon-btn" onClick={() => removeCustomTask(selectedArea, index)}><XIcon /></button>
                  </div>);
                })}
              </div>
            </div></div>
            <div className="card" style={{ borderImage: 'linear-gradient(to right, var(--primary-light), var(--primary)) 1' }}><div className="card-content text-center">
              <SparklesIcon style={{ margin: '0 auto 0.5rem', width: '2rem', height: '2rem', color: 'var(--primary-light)' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary-light)', marginBottom: '0.5rem' }}>Frase Motivacional</h3>
              {motivationalPhrase ? <p style={{ fontStyle: 'italic' }}>"{motivationalPhrase}"</p> : <p style={{ color: 'var(--text-secondary)' }}>Clique no botão para gerar uma frase inspiradora!</p>}
              <button className="btn btn-green" onClick={() => setMotivationalPhrase(generateMotivationalPhrase(selectedArea))} style={{ marginTop: '1rem' }}><SparklesIcon style={{ marginRight: '0.5rem' }} /> Gerar Frase</button>
            </div></div>
          </div>}
          {activeTab === 'goals' && <div className="tab-content">
            <div className="card"><div className="card-content">
              <h3 className="flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}><TargetIcon style={{ color: 'var(--accent-blue)' }} /> Meta da Semana</h3>
              <textarea placeholder="Defina sua meta SMART para esta semana..." value={weeklyGoal} onChange={e => { setWeeklyGoal(e.target.value); setUserData(p => ({ ...p, weeklyGoals: { ...p.weeklyGoals, [selectedArea]: e.target.value } })); }} className="textarea" style={{ minHeight: '100px' }} />
              <button className="btn btn-blue" style={{ marginTop: '0.75rem' }}><SparklesIcon style={{ marginRight: '0.5rem' }} /> Sugestão de IA</button>
            </div></div>
            <div className="card"><div className="card-content">
              <h3 className="flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}><AwardIcon style={{ color: 'var(--accent-yellow)' }} /> O que já consegui hoje</h3>
              <div className="flex gap-2">
                <textarea placeholder="Registre suas conquistas e reflexões do dia..." value={todayAchievement} onChange={e => { setTodayAchievement(e.target.value); setUserData(p => ({ ...p, achievements: { ...p.achievements, [selectedArea]: e.target.value } })); }} className="textarea flex-1" />
                <button className="btn btn-ghost icon-btn" style={{ border: '1px solid var(--border-color)' }}><MicIcon /></button>
              </div>
            </div></div>
          </div>}
          {activeTab === 'notes' && <div className="tab-content">
            <div className="card"><div className="card-content">
              <h3 className="flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}><BookOpenIcon style={{ color: 'var(--accent-purple)' }} /> Notas Rápidas</h3>
              <textarea placeholder="Anote insights, lembretes ou reflexões..." value={quickNotes} onChange={e => { setQuickNotes(e.target.value); setUserData(p => ({ ...p, notes: { ...p.notes, [selectedArea]: e.target.value } })); }} className="textarea" style={{ minHeight: '200px' }} />
            </div></div>
            <div className="card" style={{ borderColor: 'var(--accent-purple)' }}><div className="card-content">
              <h3 className="flex items-center gap-2" style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--accent-purple)', marginBottom: '0.75rem' }}><TrendingUpIcon /> Ciclo PDCA - Melhoria Contínua</h3>
              <div className="grid md-grid-cols-4 gap-4" style={{ fontSize: '0.875rem', textAlign: 'center' }}>
                <div><div style={{ fontWeight: 600 }}>PLANEJAR</div><div style={{ color: 'var(--text-secondary)' }}>Definir meta SMART</div></div>
                <div><div style={{ fontWeight: 600 }}>EXECUTAR</div><div style={{ color: 'var(--text-secondary)' }}>Implementar ações</div></div>
                <div><div style={{ fontWeight: 600 }}>VERIFICAR</div><div style={{ color: 'var(--text-secondary)' }}>Analisar resultados</div></div>
                <div><div style={{ fontWeight: 600 }}>AGIR</div><div style={{ color: 'var(--text-secondary)' }}>Ajustar estratégia</div></div>
              </div>
            </div></div>
          </div>}
        </div>
      </main>
    </div>
  );
};
