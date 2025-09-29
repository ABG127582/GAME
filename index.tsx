/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

// Types
import { User, Task, WeeklyGoal, PendingFeature, RunLog, Challenge } from './src/types';
import { healthAreas } from './src/utils/config';

// Hooks
import { useUserLocalStorage } from './src/hooks/useUserLocalStorage';

// Helper Functions
import { getStartOfWeek, getEndOfWeek, calculateStreak } from './src/utils/helpers';

// Components
import BottomNavBar from './src/components/BottomNavBar';
import ActionButton from './src/components/ActionButton';
import TodaysTasksHeader from './src/components/TodaysTasksHeader';
import GeminiWrapper from './src/components/GeminiWrapper';

// Views
import LoginView from './src/views/LoginView';
import Dashboard from './src/views/Dashboard';
import TasksView from './src/views/TasksView';
import RewardsView from './src/views/RewardsView';
import ProgressView from './src/views/ProgressView';
import PlannerView from './src/views/PlannerView';
import ChallengesView from './src/views/ChallengesView';
import ProfileView from './src/views/ProfileView';

// Modals
import Modal from './src/components/modals/Modal';
import AlarmListModal from './src/components/modals/AlarmListModal';
import RecurrenceModal from './src/components/modals/RecurrenceModal';
import VoiceCommandModal from './src/components/modals/VoiceCommandModal';
import DatePickerModal from './src/components/modals/DatePickerModal';
import CreateChallengeModal from './src/components/modals/CreateChallengeModal';

declare var TimestampTrigger: any;

const App: React.FC = () => {
    // State management
    const [user, setUser] = useUserLocalStorage<User | null>('userProfile', null);
    const userId = user?.id || null;

    const [tasks, setTasks] = useUserLocalStorage<Task[]>('tasks', [], userId);
    const [view, setView] = useUserLocalStorage<'dashboard' | 'tasks' | 'rewards' | 'progress' | 'planner' | 'challenges' | 'profile'>('view', 'dashboard', userId);
    const [currentArea, setCurrentArea] = useUserLocalStorage<keyof typeof healthAreas | null>('currentArea', null, userId);
    const [weeklyGoals, setWeeklyGoals] = useUserLocalStorage<WeeklyGoal[]>('weeklyGoals', [], userId);
    const [pendingFeatures, setPendingFeatures] = useUserLocalStorage<PendingFeature[]>('pendingFeatures', [], userId);
    const [runLogs, setRunLogs] = useUserLocalStorage<RunLog[]>('runLogs', [], userId);
    const [challenges, setChallenges] = useUserLocalStorage<Challenge[]>('challenges', [], userId);
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [modalData, setModalData] = useState<any>(null);

    // Derived state
    const stats = useMemo(() => {
        const completedTasks = tasks.filter(t => t.completed);
        const totalCompleted = completedTasks.length;
        const startOfWeek = getStartOfWeek(new Date());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);

        const streak = calculateStreak(completedTasks);

        const weeklyCompleted = completedTasks.filter(t =>
            t.completedAt && t.completedAt >= startOfWeek.toISOString().split('T')[0] && t.completedAt <= endOfWeek.toISOString().split('T')[0]
        ).length;

        const totalGoals = weeklyGoals.length;

        return { totalCompleted, streak, weeklyCompleted, totalGoals };
    }, [tasks, weeklyGoals]);

    const handleViewChange = (newView: any, areaId: keyof typeof healthAreas | null = null) => {
        setView(newView);
        setCurrentArea(areaId);
    };

    const handleLogin = (newUser: User) => {
        setUser(newUser);
        setView('dashboard');
    };

    const handleLogout = () => {
        setUser(null);
    };


    // Task handlers
    const addTask = (newTask: Partial<Task>) => {
        const fullTask: Task = {
            id: crypto.randomUUID(),
            completed: false,
            createdAt: new Date().toISOString(),
            ...newTask,
            text: newTask.text || 'Nova Tarefa',
            areaId: newTask.areaId || 'social',
        };
        const updatedTasks = [...tasks, fullTask];
        setTasks(updatedTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        if (fullTask.alarmTime) {
            scheduleNotification(fullTask);
        }
    };
    
    const toggleTask = (id: string, completed: boolean) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed, completedAt: completed ? new Date().toISOString() : undefined } : task
        ));
    };

    const editTask = (id: string, newText: string) => {
      setTasks(tasks.map(task => task.id === id ? { ...task, text: newText } : task));
    };

    const updateTaskSettings = (id: string, settings: Partial<Task>) => {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                const updatedTask = { ...task, ...settings };
                if (settings.alarmTime) {
                    scheduleNotification(updatedTask);
                }
                return updatedTask;
            }
            return task;
        }));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const addRunLog = (log: Omit<RunLog, 'id'>) => {
        const newLog: RunLog = { ...log, id: crypto.randomUUID() };
        setRunLogs([newLog, ...runLogs]);
    };
    
    // Goal & Feature Handlers
    const handleNewGoals = (newGoals: WeeklyGoal[]) => {
        setWeeklyGoals(newGoals);
        newGoals.forEach(goal => {
            addTask({
                text: goal.goal,
                areaId: goal.area,
                isGoal: true,
                dueDate: getEndOfWeek(new Date()).toISOString().split('T')[0],
            });
        });
    };
    const handleNewFeatures = (newFeatures: PendingFeature[]) => {
        setPendingFeatures(newFeatures);
    };
    
    // Challenge Handlers
    const handleAddChallenge = (newChallenge: Omit<Challenge, 'id'>) => {
        const fullChallenge: Challenge = { ...newChallenge, id: crypto.randomUUID() };
        setChallenges([fullChallenge, ...challenges]);
    };

    // Voice Command Handlers
    const handleVoiceAddTask = (taskData: { text: string; areaId: keyof typeof healthAreas; dueDate: string }) => {
        addTask(taskData);
        setActiveModal(null);
    };

    const handleVoiceCompleteTask = (taskText: string) => {
        const taskToComplete = tasks.find(t => t.text.toLowerCase().includes(taskText.toLowerCase()) && !t.completed);
        if (taskToComplete) {
            toggleTask(taskToComplete.id, true);
        }
        setActiveModal(null);
    };

    // Notifications
    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    const scheduleNotification = (task: Task) => {
        if ('Notification' in window && Notification.permission === 'granted' && task.alarmTime && task.dueDate) {
            const [hours, minutes] = task.alarmTime.split(':').map(Number);
            const notificationTime = new Date(task.dueDate);
            notificationTime.setHours(hours, minutes, 0, 0);

            if (notificationTime > new Date()) {
                const timestamp = notificationTime.getTime();
                if ('TimestampTrigger' in window) {
                    new TimestampTrigger(timestamp); // For environments supporting this
                }
                
                if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
                     navigator.serviceWorker.ready.then(registration => {
                        registration.showNotification('Lembrete de Tarefa: Pequenos Passos', {
                            body: task.text,
                            icon: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐾</text></svg>`,
                            tag: task.id,
                            // The 'showTrigger' property is not a standard part of NotificationOptions.
                            // showTrigger: new TimestampTrigger(timestamp),
                            badge: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔔</text></svg>`,
                        });
                     });
                }
            }
        }
    };
    
    const showModal = (modalName: string, data: any = null) => {
        setModalData(data);
        setActiveModal(modalName);
    };
    
    const closeModal = () => {
        setModalData(null);
        setActiveModal(null);
    };

    if (!user) {
        return <LoginView onLogin={handleLogin} />;
    }

    const renderView = () => {
        switch (view) {
            case 'tasks':
                return <TasksView
                    tasks={tasks}
                    currentArea={currentArea}
                    onAddTask={addTask}
                    onToggleTask={toggleTask}
                    onEditTask={editTask}
                    onDeleteTask={deleteTask}
                    onUpdateTaskSettings={updateTaskSettings}
                    onBack={() => handleViewChange('dashboard')}
                    onShowModal={showModal}
                    runLogs={runLogs}
                    onAddRunLog={addRunLog}
                    />;
            case 'rewards':
                return <RewardsView tasks={tasks} />;
            case 'progress':
                return <ProgressView tasks={tasks} />;
            case 'planner':
                return <PlannerView
                    tasks={tasks}
                    onToggleTask={toggleTask}
                    onShowModal={showModal}
                    />;
            case 'challenges':
                return <ChallengesView
                    challenges={challenges}
                    tasks={tasks}
                    user={user}
                    onAddChallenge={handleAddChallenge}
                    setChallenges={setChallenges}
                    onShowModal={showModal}
                />;
             case 'profile':
                return <ProfileView user={user} onLogout={handleLogout} onUpdateUser={setUser} />;
            case 'dashboard':
            default:
                return <Dashboard
                    user={user}
                    stats={stats}
                    onViewChange={handleViewChange}
                    weeklyGoals={weeklyGoals}
                    pendingFeatures={pendingFeatures}
                    onShowModal={showModal}
                    />;
        }
    };

    return (
        <GeminiWrapper
            tasks={tasks}
            onNewGoals={handleNewGoals}
            onNewFeatures={handleNewFeatures}
            onAddTask={handleVoiceAddTask}
            onCompleteTask={handleVoiceCompleteTask}
        >
            {({ isLoading: isAILoading, error: aiError, generateWeeklyGoals, generatePendingFeatures, handleVoiceCommand }: any) => (
                <main className="app-container">
                    <TodaysTasksHeader
                        tasks={tasks}
                        onToggleTask={toggleTask}
                        onViewChange={handleViewChange}
                    />
                    <div className={`view-wrapper ${activeModal ? 'blurred' : ''}`}>
                         {renderView()}
                    </div>
                     <BottomNavBar activeView={view} onViewChange={handleViewChange} />
                     <Modal
                        isOpen={!!activeModal}
                        onClose={closeModal}
                        title={
                          activeModal === 'alarms' ? 'Alarmes Agendados' :
                          activeModal === 'recurrence' ? 'Editar Tarefa' :
                          activeModal === 'voice' ? 'Comando de Voz' :
                          activeModal === 'datepicker' ? 'Selecione a Data' :
                          activeModal === 'addChallenge' ? 'Criar Novo Desafio' :
                          'Modal'
                        }
                      >
                        {activeModal === 'alarms' && <AlarmListModal tasks={tasks} onClose={closeModal} />}
                        {activeModal === 'recurrence' && <RecurrenceModal task={modalData} onSave={(settings) => { updateTaskSettings(modalData.id, settings); closeModal(); }} onClose={closeModal} />}
                        {activeModal === 'voice' && <VoiceCommandModal onCommand={handleVoiceCommand} onClose={closeModal} isProcessing={isAILoading} error={aiError} />}
                        {activeModal === 'datepicker' && <DatePickerModal currentDate={modalData.currentDate} onDateSelect={(date) => { modalData.onDateSelect(date); closeModal(); }} onClose={closeModal} />}
                        {activeModal === 'addChallenge' && <CreateChallengeModal onSave={handleAddChallenge} onClose={closeModal} />}
                      </Modal>
                      <ActionButton
                          onGenerateGoals={generateWeeklyGoals}
                          onGenerateFeatures={generatePendingFeatures}
                          onShowVoiceModal={() => showModal('voice')}
                          isLoading={isAILoading}
                          hasGoals={weeklyGoals.length > 0}
                          hasFeatures={pendingFeatures.length > 0}
                      />
                </main>
            )}
        </GeminiWrapper>
    );
};


// --- Render App ---
const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}