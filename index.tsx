/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import {
    TrophyIcon, TargetIcon, CheckCircle2Icon, CircleIcon, PlusIcon, SparklesIcon, FlameIcon, AwardIcon,
    TrendingUpIcon, DumbbellIcon, BrainIcon, PiggyBankIcon, HeartIcon, BriefcaseIcon, UsersIcon, StarIcon,
    ShieldIcon, BookOpenIcon, ArrowLeftIcon, ArrowRightIcon, XIcon, MicIcon, BellIcon, BellOffIcon, CalendarIcon,
    FootprintsIcon, StretchingIcon, RepeatIcon, LightbulbIcon, PlayIcon, PauseIcon, Volume2Icon, VolumeXIcon,
    WavesIcon, CloudRainIcon, TreePineIcon, MusicIcon
} from './src/icons';
import { healthAreas } from './src/data/healthAreas';
import { generalMotivationalPhrases } from './src/data/motivationalPhrases';
import { stretchingExercises } from './src/data/stretchingExercises';
import { focusMusicTracks } from './src/data/focusMusicTracks';
import DashboardView from './src/components/views/DashboardView';
import TasksView from './src/components/views/TasksView';
import RewardsView from './src/components/views/RewardsView';
import { AlarmsModal, CalendarModal, FeatureSuggestionModal } from './src/components/shared/Modal';

declare var TimestampTrigger: any;

const handleKeyboardClick = (e: React.KeyboardEvent, callback: () => void) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    callback();
  }
};


const App = () => {
  const [userData, setUserData] = useState<any>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [isAlarmsModalOpen, setIsAlarmsModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [calendarModalArea, setCalendarModalArea] = useState<string | null>(null);
  
  const [isGeneratingGoal, setIsGeneratingGoal] = useState(false);
  
  const [playerState, setPlayerState] = useState({
      currentTrackIndex: null,
      isPlaying: false,
      volume: 0.75,
  });

  // !!! ATENÇÃO DE SEGURANÇA !!!
  // A chave de API está sendo exposta no lado do cliente.
  // Isso é INSEGURO para produção. Em um aplicativo real, as chamadas de API
  // devem ser feitas a partir de um backend seguro (por exemplo, uma Função do Cloud)
  // que mantém a chave de API em segredo.
  // Para fins de desenvolvimento, estamos usando uma variável de ambiente do Vite.
  // Certifique-se de ter um arquivo `.env.local` com `VITE_GEMINI_API_KEY=SUA_CHAVE_AQUI`.
  const ai = useMemo(() => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY }), []);
  
  // Service Worker communication
  const postToSW = useCallback((message: object) => {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(message);
    } else {
        console.log("Service Worker not in control yet. Retrying...");
        navigator.serviceWorker.ready.then(reg => {
            reg.active?.postMessage(message);
        });
    }
  }, []);

  const playerControls = useMemo(() => ({
    setTrack: (index: number) => {
        postToSW({ type: 'SET_TRACK', payload: { index, url: focusMusicTracks[index].url } });
    },
    play: () => postToSW({ type: 'PLAY' }),
    pause: () => postToSW({ type: 'PAUSE' }),
    setVolume: (volume: number) => {
        // We update local state immediately for a responsive UI
        setPlayerState(s => ({ ...s, volume }));
        postToSW({ type: 'SET_VOLUME', payload: { volume } });
    },
  }), [postToSW]);


  // Effect for Service Worker registration and communication
  useEffect(() => {
    const handleSWMessage = (event: MessageEvent) => {
        const { type, payload } = event.data;
        if (type === 'STATE_UPDATE') {
            setPlayerState(payload);
        }
    };

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
                // Request initial status when component mounts and SW is ready
                navigator.serviceWorker.ready.then(() => {
                    postToSW({ type: 'GET_STATUS' });
                });
            })
            .catch(error => console.error('Service Worker registration failed:', error));

        navigator.serviceWorker.addEventListener('message', handleSWMessage);
    }
    
    return () => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.removeEventListener('message', handleSWMessage);
        }
    };
  }, [postToSW]);

  // Efeito para carregar dados e definir recorrências padrão
  useEffect(() => {
    let data;
    try {
        const savedData = localStorage.getItem('pequenosPassosData');
        if (savedData) {
            data = JSON.parse(savedData);
        }
    } catch (error) {
        console.error("Erro ao analisar os dados do localStorage:", error);
        // Se a análise falhar, o `data` permanecerá indefinido e o bloco `else` abaixo irá lidar com isso.
    }

    if (!data) {
      // Estrutura de dados inicial para novos usuários ou em caso de erro de análise
      data = {
        completedToday: {},
        customTasks: {},
        streaks: {},
        medals: {},
        weeklyGoals: {},
        achievements: {},
        notes: {},
        alarms: {},
        dueDates: {},
        recurrenceRules: {},
        runs: [],
        pendingFeatures: [],
      };
    }

    // Define recorrências padrão para tarefas de Saúde Mental
    const mentalTasksToRecur = [
      'Meditar 10min para regulação emocional',
      'Escolher 1 pequeno hábito para melhorar (1%)'
    ];
    
    const newRules = JSON.parse(JSON.stringify(data.recurrenceRules || {}));
    if (!newRules.mental) {
      newRules.mental = {};
    }
    
    let rulesUpdated = false;
    mentalTasksToRecur.forEach(taskId => {
      // Adiciona a regra apenas se não existir uma para essa tarefa
      if (!newRules.mental[taskId]) {
        newRules.mental[taskId] = {
          frequency: 'daily',
          startDate: new Date().toISOString().split('T')[0], // Inicia hoje
          endDate: null, // Sem data de término
        };
        rulesUpdated = true;
      }
    });

    if (rulesUpdated) {
      data.recurrenceRules = newRules;
    }
    
    setUserData(data);
    
  }, []);


  // Efeito para salvar dados no localStorage sempre que `userData` mudar
  useEffect(() => {
    if (userData) {
      localStorage.setItem('pequenosPassosData', JSON.stringify(userData));
    }
  }, [userData]);
  
  const getTasksForDate = useCallback((areaKey: string, date: Date) => {
    if (!userData) return [];
    const area = healthAreas[areaKey as keyof typeof healthAreas];
    const allPossibleTasks = [
        ...area.bookTasks.map(task => ({ id: task, text: task, isCustom: false })),
        ...(userData.customTasks[areaKey] || [])
    ];

    const rules = userData.recurrenceRules?.[areaKey] || {};

    return allPossibleTasks.filter(task => {
        const rule = rules[task.id];
        if (!rule || rule.frequency === 'none') {
            return true;
        }
        
        const checkDate = new Date(date);
        checkDate.setHours(0,0,0,0);

        // Ensure startDate is a valid Date object before proceeding
        if (!rule.startDate) return false;
        const startDate = new Date(rule.startDate);
        startDate.setHours(0,0,0,0);
        
        if (rule.endDate) {
            const endDate = new Date(rule.endDate);
            endDate.setHours(23,59,59,999); // End of day
            if (checkDate > endDate) return false;
        }

        if (checkDate < startDate) return false;

        switch (rule.frequency) {
            case 'daily':
                return true;
            case 'weekly':
                return checkDate.getDay() === startDate.getDay();
            case 'monthly':
                return checkDate.getDate() === startDate.getDate();
            default:
                return true;
        }
    });
  }, [userData]);

  const getDayProgress = useCallback((areaKey: string, date = new Date()) => {
    if (!userData) return { completed: 0, total: 0, percentage: 0 };
    
    const dateString = date.toDateString();
    
    const completedTasks = userData.completedToday[areaKey]?.[dateString] || [];
    const visibleTasksForDate = getTasksForDate(areaKey, date);
    
    const totalTasks = visibleTasksForDate.length;
    
    // Filtra as tarefas concluídas para contar apenas as que são visíveis hoje
    const completedVisibleTasksCount = completedTasks.filter((taskId: string) => 
        visibleTasksForDate.some(visibleTask => visibleTask.id === taskId)
    ).length;
    
    return {
      completed: completedVisibleTasksCount,
      total: totalTasks,
      percentage: totalTasks > 0 ? (completedVisibleTasksCount / totalTasks) * 100 : 0,
    };
  }, [userData, getTasksForDate]);


  const hasMedalToday = useCallback((areaKey: string) => {
    if (!userData) return false;
    const today = new Date().toDateString();
    return !!userData.medals[areaKey]?.[today];
  }, [userData]);

  const updateStreaksAndMedals = useCallback((areaKey: string) => {
    setUserData((prev: any) => {
      const today = new Date().toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();

      const newStreaks = { ...prev.streaks };
      const currentStreak = prev.streaks[areaKey] || 0;
      const hadMedalYesterday = !!prev.medals[areaKey]?.[yesterdayString];

      newStreaks[areaKey] = hadMedalYesterday ? currentStreak + 1 : 1;

      const newMedals = JSON.parse(JSON.stringify(prev.medals)); // Deep copy
      if (!newMedals[areaKey]) {
        newMedals[areaKey] = {};
      }
      newMedals[areaKey][today] = true;

      return { ...prev, streaks: newStreaks, medals: newMedals };
    });
  }, []);

  const toggleTask = useCallback((areaKey: string, taskId: string) => {
    setUserData((prev: any) => {
      const today = new Date().toDateString();
      const newCompleted = JSON.parse(JSON.stringify(prev.completedToday)); // Deep copy

      if (!newCompleted[areaKey]) newCompleted[areaKey] = {};
      if (!newCompleted[areaKey][today]) newCompleted[areaKey][today] = [];

      const taskList = newCompleted[areaKey][today];
      const taskIndex = taskList.indexOf(taskId);

      if (taskIndex > -1) {
        taskList.splice(taskIndex, 1); // Un-complete
      } else {
        taskList.push(taskId); // Complete
      }

      const newState = { ...prev, completedToday: newCompleted };
      
      const visibleTasksToday = getTasksForDate(areaKey, new Date());
      const totalTasks = visibleTasksToday.length;

      // Recalcula o progresso com a lista atualizada de tarefas concluídas
      const completedVisibleCount = taskList.filter((id: string) => 
          visibleTasksToday.some(visibleTask => visibleTask.id === id)
      ).length;

      if (completedVisibleCount === totalTasks && totalTasks > 0) {
        return { ...newState, _shouldUpdateMedal: areaKey };
      }

      return newState;
    });
  }, [getTasksForDate]);

  // Effect to run after state update from toggleTask
  useEffect(() => {
    if (userData && userData._shouldUpdateMedal) {
      const areaKey = userData._shouldUpdateMedal;
      // Remove the temporary flag before calling the update function
      const { _shouldUpdateMedal, ...rest } = userData;
      setUserData(rest);
      updateStreaksAndMedals(areaKey);
    }
  }, [userData, updateStreaksAndMedals]);

  const addCustomTask = useCallback((areaKey: string, text: string) => {
    setUserData((prev: any) => {
      const newCustomTasks = JSON.parse(JSON.stringify(prev.customTasks));
      if (!newCustomTasks[areaKey]) {
        newCustomTasks[areaKey] = [];
      }
      const newTask = { id: `custom-${Date.now()}`, text, isCustom: true };
      newCustomTasks[areaKey].push(newTask);
      return { ...prev, customTasks: newCustomTasks };
    });
  }, []);

  const removeCustomTask = useCallback((areaKey: string, taskId: string) => {
    setUserData((prev: any) => {
        const newState = { ...prev };

        // Remove from custom tasks list
        const newCustomTasks = JSON.parse(JSON.stringify(newState.customTasks));
        if (newCustomTasks[areaKey]) {
            newCustomTasks[areaKey] = newCustomTasks[areaKey].filter((task: any) => task.id !== taskId);
        }
        newState.customTasks = newCustomTasks;

        // Remove any associated due date
        const newDueDates = JSON.parse(JSON.stringify(newState.dueDates));
        if (newDueDates[areaKey]?.[taskId]) {
            delete newDueDates[areaKey][taskId];
        }
        newState.dueDates = newDueDates;

        // Remove any associated recurrence rule
        const newRecurrenceRules = JSON.parse(JSON.stringify(newState.recurrenceRules));
        if (newRecurrenceRules[areaKey]?.[taskId]) {
            delete newRecurrenceRules[areaKey][taskId];
        }
        newState.recurrenceRules = newRecurrenceRules;

        return newState;
    });
  }, []);

  const updateCustomTask = useCallback((areaKey: string, taskId: string, newText: string) => {
    setUserData((prev: any) => {
        const newCustomTasks = JSON.parse(JSON.stringify(prev.customTasks));
        if (newCustomTasks[areaKey]) {
            const taskIndex = newCustomTasks[areaKey].findIndex((task: any) => task.id === taskId);
            if (taskIndex > -1) {
                newCustomTasks[areaKey][taskIndex].text = newText;
            }
        }
        return { ...prev, customTasks: newCustomTasks };
    });
  }, []);
  
  const generateMotivationalPhrase = useCallback((areaKey: string | null) => {
    const areaPhrases = areaKey ? healthAreas[areaKey as keyof typeof healthAreas].motivationalPhrases : [];
    const allPhrases = [...areaPhrases, ...generalMotivationalPhrases];
    return allPhrases[Math.floor(Math.random() * allPhrases.length)];
  }, []);

  const generateAIGoal = useCallback(async (areaKey: string) => {
    setIsGeneratingGoal(true);
    try {
        const area = healthAreas[areaKey as keyof typeof healthAreas];
        const streak = userData.streaks[areaKey] || 0;
        const today = new Date().toDateString();
        const completedTasksToday = (userData.completedToday[areaKey]?.[today] || []).map((taskId: string) => {
            const bookTask = area.bookTasks.find(t => t === taskId);
            if (bookTask) return bookTask;
            const customTask = (userData.customTasks[areaKey] || []).find((t: any) => t.id === taskId);
            return customTask?.text || '';
        }).filter(Boolean);

        const prompt = `Você é um coach de bem-estar e especialista em hábitos. Com base nas seguintes informações de um usuário, crie uma meta SMART (Específica, Mensurável, Atingível, Relevante, Temporal) para a próxima semana. A meta deve ser curta, inspiradora e apresentada em português do Brasil.

- Área de Saúde: ${area.name}
- Sequência atual de dias com 100% de progresso: ${streak} dias
- Tarefas concluídas hoje: ${completedTasksToday.length > 0 ? completedTasksToday.join(', ') : 'Nenhuma tarefa concluída hoje.'}

Seja conciso e direto na resposta, fornecendo apenas o texto da meta.`;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const suggestedGoal = response.text;

        if (suggestedGoal) {
            setUserData((prev: any) => ({
                ...prev,
                weeklyGoals: {
                    ...prev.weeklyGoals,
                    [areaKey]: suggestedGoal.trim()
                }
            }));
        } else {
            console.error("Gemini API did not return a valid goal.");
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
    } finally {
        setIsGeneratingGoal(false);
    }
  }, [userData, ai]);

  const setAlarm = useCallback((alarmId: string, taskText: string, areaName: string, time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      const alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

      // If alarm time is in the past for today, schedule it for tomorrow
      if (alarmTime < now) {
          alarmTime.setDate(alarmTime.getDate() + 1);
      }
      
      const delay = alarmTime.getTime() - now.getTime();
      
      if ('serviceWorker' in navigator && 'PushManager' in window && 'TimestampTrigger' in window) {
           navigator.serviceWorker.ready.then(registration => {
                registration.showNotification('Pequenos Passos: Alarme Ativo!', {
                    body: `Lembrete para sua tarefa: "${taskText}" em ${areaName}.`,
                    tag: alarmId,
                    showTrigger: new TimestampTrigger(Date.now() + delay),
                    icon: '/favicon.ico'
                } as any);
           });
      } else {
          console.warn('Notifications with triggers are not supported in this browser.');
      }

      setUserData((prev: any) => ({
          ...prev,
          alarms: {
              ...prev.alarms,
              [alarmId]: { time, taskText, areaName }
          }
      }));
  }, []);

  const clearAlarm = useCallback((alarmId: string) => {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
          navigator.serviceWorker.ready.then(registration => {
              registration.getNotifications({ tag: alarmId }).then(notifications => {
                  notifications.forEach(notification => notification.close());
              });
          });
      }

      setUserData((prev: any) => {
          const newAlarms = { ...prev.alarms };
          delete newAlarms[alarmId];
          return { ...prev, alarms: newAlarms };
      });
  }, []);
  
  const setDueDate = useCallback((areaKey: string, taskId: string, date: string) => {
      setUserData((prev: any) => {
          const newDueDates = JSON.parse(JSON.stringify(prev.dueDates));
          if (!newDueDates[areaKey]) {
            newDueDates[areaKey] = {};
          }
          if (date) {
            newDueDates[areaKey][taskId] = date;
          } else {
            delete newDueDates[areaKey][taskId];
          }
          return { ...prev, dueDates: newDueDates };
      });
  }, []);

  const setRecurrence = useCallback((areaKey: string, taskId: string, rule: any) => {
      setUserData((prev: any) => {
        const newRules = JSON.parse(JSON.stringify(prev.recurrenceRules));
        if (!newRules[areaKey]) newRules[areaKey] = {};

        const existingRule = newRules[areaKey][taskId];

        if (rule && rule.frequency !== 'none') {
            // If it's a new rule or an existing one doesn't have a start date, set it.
            if (!existingRule || !existingRule.startDate) {
                rule.startDate = new Date().toISOString().split('T')[0];
            } else {
                // Otherwise, preserve the original start date for consistency.
                rule.startDate = existingRule.startDate;
            }
            newRules[areaKey][taskId] = rule;
        } else {
            // Remove the rule if frequency is 'none' or rule is null
            delete newRules[areaKey][taskId];
        }
        return { ...prev, recurrenceRules: newRules };
      });
    }, []);
  
    const addPendingFeature = useCallback((name: string, description: string) => {
        setUserData((prev: any) => {
            const newFeature = {
                id: `feature-${Date.now()}`,
                name,
                description,
                status: 'pending'
            };
            const newPendingFeatures = [...(prev.pendingFeatures || []), newFeature];
            return { ...prev, pendingFeatures: newPendingFeatures };
        });
    }, []);

  const handleOpenCalendar = (areaKey: string) => {
    setCalendarModalArea(areaKey);
    setIsCalendarModalOpen(true);
  };
  
  
  if (!userData) {
    return <div className="loading-screen">Carregando seus dados...</div>;
  }
  
  return (
    <div className="app-container">
        <div className={`view-wrapper ${isAlarmsModalOpen || isCalendarModalOpen || isFeatureModalOpen ? 'blurred' : ''}`}>
           {currentView === 'dashboard' && <DashboardView 
                userData={userData} 
                getDayProgress={getDayProgress} 
                hasMedalToday={hasMedalToday} 
                setCurrentView={setCurrentView} 
                setSelectedArea={setSelectedArea}
                setIsAlarmsModalOpen={setIsAlarmsModalOpen}
                setIsFeatureModalOpen={setIsFeatureModalOpen}
            />}
           {currentView === 'tasks' && <TasksView 
                selectedArea={selectedArea}
                userData={userData}
                setUserData={setUserData}
                getDayProgress={getDayProgress}
                hasMedalToday={hasMedalToday}
                setCurrentView={setCurrentView}
                addCustomTask={addCustomTask}
                removeCustomTask={removeCustomTask}
                updateCustomTask={updateCustomTask}
                toggleTask={toggleTask}
                setAlarm={setAlarm}
                clearAlarm={clearAlarm}
                setDueDate={setDueDate}
                setRecurrence={setRecurrence}
                getTasksForDate={getTasksForDate}
                generateMotivationalPhrase={generateMotivationalPhrase}
                generateAIGoal={generateAIGoal}
                isGeneratingGoal={isGeneratingGoal}
                onOpenCalendar={handleOpenCalendar}
                playerState={playerState}
                playerControls={playerControls}
             />}
           {currentView === 'rewards' && <RewardsView userData={userData} setCurrentView={setCurrentView} onOpenCalendar={handleOpenCalendar} />}
        </div>
        
        <AlarmsModal 
            isOpen={isAlarmsModalOpen} 
            onClose={() => setIsAlarmsModalOpen(false)}
            userData={userData}
            clearAlarm={clearAlarm}
        />
        <CalendarModal 
            isOpen={isCalendarModalOpen}
            onClose={() => setIsCalendarModalOpen(false)}
            areaKey={calendarModalArea}
            userData={userData}
        />
        <FeatureSuggestionModal
            isOpen={isFeatureModalOpen}
            onClose={() => setIsFeatureModalOpen(false)}
            onSubmit={addPendingFeature}
        />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);