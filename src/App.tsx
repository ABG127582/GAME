import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UserData } from './types/types';
import { healthAreas, generalMotivationalPhrases } from './data/healthAreas';
import { DashboardView } from './components/DashboardView';
import { TasksView } from './components/TasksView';
import { RewardsView } from './components/RewardsView';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const activeTimeouts = useRef<{ [taskId: string]: number }>({});
  const [userData, setUserData] = useState<UserData>(() => {
    try {
      const saved = localStorage.getItem('pequenos-passos-data');
      return saved ? JSON.parse(saved) : {
        medals: {},
        streaks: {},
        weeklyGoals: {},
        achievements: {},
        notes: {},
        completedToday: {},
        customTasks: {},
        alarms: {}
      };
    } catch (e) {
      console.error("Failed to parse user data from localStorage", e);
      return {
        medals: {},
        streaks: {},
        weeklyGoals: {},
        achievements: {},
        notes: {},
        completedToday: {},
        customTasks: {},
        alarms: {}
      };
    }
  });

  // Salvar dados no localStorage sempre que userData mudar
  useEffect(() => {
    localStorage.setItem('pequenos-passos-data', JSON.stringify(userData));
  }, [userData]);

  // Request notification permission on app load
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  const generateMotivationalPhrase = useCallback((areaKey: string) => {
    const area = healthAreas[areaKey as keyof typeof healthAreas];
    const phrases = area ? [...area.motivationalPhrases, ...generalMotivationalPhrases] : generalMotivationalPhrases;
    return phrases[Math.floor(Math.random() * phrases.length)];
  }, []);

  const addCustomTask = useCallback((areaKey: string, taskText: string) => {
    if (!taskText.trim()) return;
    setUserData(prev => ({
      ...prev,
      customTasks: {
        ...prev.customTasks,
        [areaKey]: [...(prev.customTasks[areaKey] || []), taskText]
      }
    }));
  }, []);

  const removeCustomTask = useCallback((areaKey: string, taskIndex: number) => {
    setUserData(prev => {
      const newCustomTasks = (prev.customTasks[areaKey] || []).filter((_: string, i: number) => i !== taskIndex);
      const newCompletedToday = { ...prev.completedToday };
      const today = new Date().toDateString();

      if (newCompletedToday[areaKey] && newCompletedToday[areaKey][today]) {
        newCompletedToday[areaKey][today] = newCompletedToday[areaKey][today].filter((id: string) => {
          return id !== `custom-${taskIndex}`;
        });
      }

      const newAlarms = { ...prev.alarms };
      delete newAlarms[`${areaKey}-custom-${taskIndex}`];

      return {
        ...prev,
        customTasks: {
          ...prev.customTasks,
          [areaKey]: newCustomTasks
        },
        completedToday: newCompletedToday,
        alarms: newAlarms
      };
    });
  }, []);

  const calculateStreak = useCallback((areaKey: string, medals: { [key: string]: { [date: string]: boolean } }) => {
    if (!medals[areaKey]) return 0;

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();

      if (medals[areaKey][dateString]) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, []);

  const toggleTask = useCallback((areaKey: string, taskType: string, taskIndex: number) => {
    setUserData(prev => {
      const today = new Date().toDateString();
      const areaData = prev.completedToday[areaKey] || {};
      const todayTasks = areaData[today] || [];

      let newTodayTasks;
      const taskId = `${taskType}-${taskIndex}`;
      if (todayTasks.includes(taskId)) {
        newTodayTasks = todayTasks.filter((id: string) => id !== taskId);
      } else {
        newTodayTasks = [...todayTasks, taskId];
      }

      const newData: UserData = {
        ...prev,
        completedToday: {
          ...prev.completedToday,
          [areaKey]: {
            ...areaData,
            [today]: newTodayTasks
          }
        }
      };

      const area = healthAreas[areaKey as keyof typeof healthAreas];
      const totalBookTasks = area.bookTasks.length;
      const totalCustomTasks = (prev.customTasks[areaKey] || []).length;
      const totalTasks = totalBookTasks + totalCustomTasks;

      if (newTodayTasks.length === totalTasks && totalTasks > 0 && !(prev.medals[areaKey] || {})[today]) {
        newData.medals = {
          ...prev.medals,
          [areaKey]: {
            ...(prev.medals[areaKey] || {}),
            [today]: true
          }
        };

        const streak = calculateStreak(areaKey, newData.medals);
        newData.streaks = {
          ...prev.streaks,
          [areaKey]: streak
        };
      }

      return newData;
    });
  }, [calculateStreak]);

  const getDayProgress = useCallback((areaKey: string) => {
    const today = new Date().toDateString();
    const completedTasks = (userData.completedToday[areaKey] || {})[today] || [];
    const totalBookTasks = healthAreas[areaKey as keyof typeof healthAreas].bookTasks.length;
    const totalCustomTasks = (userData.customTasks[areaKey] || []).length;
    const totalTasks = totalBookTasks + totalCustomTasks;

    const completedCount = completedTasks.length;
    const percentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    return {
      completed: completedCount,
      total: totalTasks,
      percentage: percentage
    };
  }, [userData]);

  const hasMedalToday = useCallback((areaKey: string) => {
    const today = new Date().toDateString();
    return (userData.medals[areaKey] || {})[today] || false;
  }, [userData]);

  const setAlarm = useCallback((areaKey: string, taskType: string, taskIndex: number, time: string) => {
    if (!time) return;

    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

    if (alarmTime.getTime() < now.getTime()) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }

    const timeToAlarm = alarmTime.getTime() - now.getTime();
    const taskId = `${areaKey}-${taskType}-${taskIndex}`;
    const area = healthAreas[areaKey as keyof typeof healthAreas];
    const taskText = taskType === 'book' ? area.bookTasks[taskIndex] : (userData.customTasks[areaKey] || [])[taskIndex];

    if (Notification.permission === 'granted') {
      const timeoutId = setTimeout(() => {
        new Notification('Pequenos Passos', {
          body: `Hora de ${taskText} na área de ${area.name}!`,
          icon: '/favicon.ico'
        });
        clearAlarm(areaKey, taskType, taskIndex);
      }, timeToAlarm);

      activeTimeouts.current[taskId] = Number(timeoutId);

      setUserData(prev => ({
        ...prev,
        alarms: {
          ...prev.alarms,
          [taskId]: { time, taskText, areaName: area.name }
        }
      }));
      alert(`Alarme definido para ${time} para a tarefa: ${taskText}`);
    } else if (Notification.permission === 'denied') {
      alert('Permissão de notificação negada. Por favor, habilite as notificações para este site nas configurações do seu navegador.');
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setAlarm(areaKey, taskType, taskIndex, time);
        } else {
          alert('Permissão de notificação negada.');
        }
      });
    }
  }, [userData.customTasks]);

  const clearAlarm = useCallback((areaKey: string, taskType: string, taskIndex: number) => {
    const taskId = `${areaKey}-${taskType}-${taskIndex}`;
    const timeoutId = activeTimeouts.current[taskId];
    const alarm = userData.alarms[taskId];

    if (timeoutId) {
      clearTimeout(timeoutId);
      delete activeTimeouts.current[taskId];
    }

    if (alarm) {
      setUserData(prev => {
        const newAlarms = { ...prev.alarms };
        delete newAlarms[taskId];
        return { ...prev, alarms: newAlarms };
      });
      alert(`Alarme para a tarefa ${alarm.taskText} foi cancelado.`);
    }
  }, [userData.alarms]);

  useEffect(() => {
    const alarmsToSchedule = userData.alarms;
    Object.keys(alarmsToSchedule).forEach(taskId => {
      const alarm = alarmsToSchedule[taskId];
      if (alarm) {
        const [areaKey, taskType, taskIndexStr] = taskId.split('-');
        const taskIndex = parseInt(taskIndexStr, 10);

        const [hours, minutes] = alarm.time.split(':').map(Number);
        const now = new Date();
        const alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

        if (alarmTime.getTime() < now.getTime()) {
          alarmTime.setDate(alarmTime.getDate() + 1);
        }

        const timeToAlarm = alarmTime.getTime() - now.getTime();

        if (timeToAlarm > 0) {
          const timeoutId = setTimeout(() => {
            new Notification('Pequenos Passos', {
              body: `Hora de ${alarm.taskText} na área de ${alarm.areaName}!`,
              icon: '/favicon.ico'
            });
            clearAlarm(areaKey, taskType, taskIndex);
          }, timeToAlarm);
          activeTimeouts.current[taskId] = Number(timeoutId);
        }
      }
    });

    return () => {
      Object.values(activeTimeouts.current).forEach(clearTimeout);
    };
  }, [userData.alarms]);

  // Render based on current view
  return (
    <div className="app-container">
      {currentView === 'dashboard' && <DashboardView
        userData={userData}
        getDayProgress={getDayProgress}
        hasMedalToday={hasMedalToday}
        setCurrentView={setCurrentView}
        setSelectedArea={setSelectedArea}
      />}
      {currentView === 'tasks' && <TasksView
        selectedArea={selectedArea}
        userData={userData}
        setUserData={setUserData}
        getDayProgress={getDayProgress}
        hasMedalToday={hasMedalToday}
        toggleTask={toggleTask}
        addCustomTask={addCustomTask}
        removeCustomTask={removeCustomTask}
        setAlarm={setAlarm}
        clearAlarm={clearAlarm}
        generateMotivationalPhrase={generateMotivationalPhrase}
        setCurrentView={setCurrentView}
      />}
      {currentView === 'rewards' && <RewardsView
        userData={userData}
        getDayProgress={getDayProgress}
        setCurrentView={setCurrentView}
      />}
    </div>
  );
}

export default App;
