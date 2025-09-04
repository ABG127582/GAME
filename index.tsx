/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

// --- Icon Components (replaces lucide-react) ---
// FIX: Added ...props to all icon components to allow passing style and other svg attributes.
const TrophyIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>);
const TargetIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
const CheckCircle2Icon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>);
const CircleIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><circle cx="12" cy="12" r="10"/></svg>);
const PlusIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>);
const SparklesIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><path d="m12 3-1.9 3.8-3.8 1.9 3.8 1.9L12 14.4l1.9-3.8 3.8-1.9-3.8-1.9L12 3zM21 12l-1.9 3.8-3.8 1.9 3.8 1.9L21 21l1.9-3.8 3.8-1.9-3.8-1.9L21 12zM3 7l-1.9 3.8-3.8 1.9 3.8 1.9L3 18l1.9-3.8 3.8-1.9-3.8-1.9L3 7z"/></svg>);
const FlameIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.194 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>);
const AwardIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>);
const TrendingUpIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>);
const DumbbellIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.9a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.828l1.768-1.767a2 2 0 1 1-2.828-2.829l-1.768 1.768a2 2 0 1 1-2.828-2.828l1.767-1.768a2 2 0 1 1-2.829-2.828L2.1 5.343a2 2 0 1 1 2.828 2.829l1.768-1.768a2 2 0 1 1 2.829 2.828l-1.768 1.768a2 2 0 1 1 2.828 2.828l1.768-1.767a2 2 0 1 1 2.828 2.829l-1.767 1.768a2 2 0 1 1 2.829 2.828z"/></svg>);
const BrainIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15A2.5 2.5 0 0 1 9.5 22h-3A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2h3z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15A2.5 2.5 0 0 0 14.5 22h3a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 17.5 2h-3z"/><path d="M9.5 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/><path d="M14.5 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>);
const PiggyBankIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><path d="M10 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M14 6.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/><path d="M9 9.5v1a1.5 1.5 0 0 0 3 0v-1h4.5a2.5 2.5 0 0 1 2.5 2.5v3.5a2.5 2.5 0 0 1-2.5 2.5H15v-1.5a.5.5 0 0 0-1 0V18h-4v-1.5a.5.5 0 0 0-1 0V18H4.5a2.5 2.5 0 0 1-2.5-2.5v-4A2.5 2.5 0 0 1 4.5 9H9z"/></svg>);
const HeartIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>);
const BriefcaseIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>);
const UsersIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const StarIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const ShieldIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const BookOpenIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>);
const ArrowLeftIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);
const XIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>);
const MicIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="23"/><line x1="8" x2="16" y1="23" y2="23"/></svg>);
const BellIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>);
const BellOffIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props}><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><path d="M18 8a6 6 0 0 0-9.33-5"/><line x1="1" x2="23" y1="1" y2="23"/></svg>);

// Configuração das áreas de saúde com tarefas do livro
const healthAreas = {
  fisica: {
    name: 'Saúde Física',
    icon: DumbbellIcon,
    color: 'bg-green-500',
    medalName: 'Corpo em Ação',
    medalIcon: '🏃',
    bookTasks: [
      'Manter horário fixo de sono (ex: 23h às 6h)',
      'Criar ritual noturno 1h antes de dormir',
      'Praticar mindful eating - comer devagar',
      'Fazer atividade física prazerosa por 20min',
      'Praticar respiração consciente por 5min',
      'Aplicar dicotomia do controle em situação de estresse',
      'Consumir alimentos ricos em fibras',
      'Parar de comer aos 80% de saciedade'
    ],
    motivationalPhrases: [
      'Seu corpo é seu templo, cuide dele com amor!',
      'Cada movimento é um passo em direção à vitalidade!',
      'A disciplina de hoje é a liberdade de amanhã!',
      'Pequenos hábitos, grandes transformações!'
    ]
  },
  mental: {
    name: 'Saúde Mental',
    icon: BrainIcon,
    color: 'bg-blue-500',
    medalName: 'Mente de Aço',
    medalIcon: '🧠',
    bookTasks: [
      'Praticar dicotomia do controle - focar no controlável',
      'Questionar julgamentos emocionais perturbadores',
      'Manter vigilância sobre pensamentos automáticos',
      'Meditar 10min para regulação emocional',
      'Contemplar adversidades com calma (premeditatio malorum)',
      'Reflexão tripla: Epicuro + Kaizen + Estoicismo',
      'Identificar prazer excessivo ou simples negligenciado',
      'Escolher 1 pequeno hábito para melhorar (1%)'
    ],
    motivationalPhrases: [
      'Sua mente é seu maior poder, domine-a!',
      'Pensamentos são nuvens, você é o céu!',
      'A serenidade vem da sabedoria interior!',
      'Cada respiração consciente é um ato de liberdade!'
    ]
  },
  financeira: {
    name: 'Saúde Financeira',
    icon: PiggyBankIcon,
    color: 'bg-yellow-500',
    medalName: 'Guardião da Carteira',
    medalIcon: '💰',
    bookTasks: [
      'Praticar pausa de 24h antes de compras não essenciais',
      'Registrar todos os gastos do dia',
      'Transferir valor automático para poupança',
      'Identificar viés financeiro em decisão recente',
      'Revisar orçamento mensal (regra 50/30/20)',
      'Estudar finanças por 30min (artigo/podcast)',
      'Avaliar progresso da reserva de emergência',
      'Listar dívidas por taxa de juros'
    ],
    motivationalPhrases: [
      'Cada real poupado é um passo rumo à liberdade!',
      'Disciplina financeira hoje, tranquilidade amanhã!',
      'Você é o CEO da sua vida financeira!',
      'Pequenas economias, grandes conquistas!'
    ]
  },
  familiar: {
    name: 'Saúde Familiar',
    icon: HeartIcon,
    color: 'bg-red-500',
    medalName: 'Coração Conectado',
    medalIcon: '❤️',
    bookTasks: [
      'Praticar CNV: Observação + Sentimento + Necessidade + Pedido',
      'Escuta ativa: guardar celular, manter contato visual',
      'Dedicar 15min de tempo de qualidade sem distrações',
      'Expressar afeto: toque, elogio, atenção, mimo ou serviço',
      'Compartilhar sentimento/desafio real (vulnerabilidade)',
      'Comunicar limite de forma assertiva e respeitosa',
      'Refletir sobre meu estilo de apego',
      'Validar sentimentos do outro sem julgar'
    ],
    motivationalPhrases: [
      'O amor se multiplica quando é compartilhado!',
      'Cada conversa é uma oportunidade de conexão!',
      'Família é onde o coração encontra seu lar!',
      'Pequenos gestos, grandes vínculos!'
    ]
  },
  profissional: {
    name: 'Saúde Profissional',
    icon: BriefcaseIcon,
    color: 'bg-purple-500',
    medalName: 'Mestre do Saber',
    medalIcon: '📚',
    bookTasks: [
      'Refletir: meu trabalho tem significado maior?',
      'Alinhar uma ação do trabalho aos meus valores',
      'Estudar habilidade-chave por 30min',
      'Aplicar dicotomia do controle no trabalho',
      'Monitorar níveis de energia e humor (burnout)',
      'Usar técnica Pomodoro para trabalho focado',
      'Criar separação clara trabalho-vida pessoal',
      'Imaginar meu epitáfio profissional desejado'
    ],
    motivationalPhrases: [
      'Seu trabalho é sua contribuição para o mundo!',
      'Cada habilidade desenvolvida é um investimento em você!',
      'Propósito transforma trabalho em vocação!',
      'Excelência é um hábito, não um ato!'
    ]
  },
  social: {
    name: 'Saúde Social',
    icon: UsersIcon,
    color: 'bg-indigo-500',
    medalName: 'Alma Conectada',
    medalIcon: '🤝',
    bookTasks: [
      'Buscar interação social positiva (abraço, conversa)',
      'Dedicar tempo de qualidade a pessoa próxima',
      'Praticar escuta ativa: ouvir para compreender',
      'Compartilhar pensamento/sentimento real',
      'Ser proativo: enviar mensagem ou marcar encontro',
      'Expressar gratidão específica a alguém',
      'Usar CNV em conflito: problema, não pessoa',
      'Identificar e comunicar limite social'
    ],
    motivationalPhrases: [
      'Conexões autênticas nutrem a alma!',
      'Cada conversa é uma ponte entre corações!',
      'Você é parte de uma rede de amor e apoio!',
      'Pequenos gestos, grandes amizades!'
    ]
  },
  espiritual: {
    name: 'Saúde Espiritual',
    icon: StarIcon,
    color: 'bg-amber-500',
    medalName: 'Luz Interior',
    medalIcon: '✨',
    bookTasks: [
      'Meditar/mindfulness por 10min',
      'Refletir sobre valores e propósito de vida',
      'Passar tempo consciente na natureza',
      'Praticar gratidão: listar 3 bênçãos do dia',
      'Autoexploração: o que espiritualidade significa?',
      'Escolher prática espiritual para focar',
      'Registrar experiência interna da prática',
      'Ler texto inspirador ou filosófico'
    ],
    motivationalPhrases: [
      'Sua luz interior ilumina o caminho!',
      'Cada momento de gratidão é uma oração!',
      'Você é parte de algo maior e sagrado!',
      'A paz interior é seu maior tesouro!'
    ]
  },
  preventiva: {
    name: 'Saúde Preventiva',
    icon: ShieldIcon,
    color: 'bg-teal-500',
    medalName: 'Protetor da Saúde',
    medalIcon: '🛡️',
    bookTasks: [
      'Monitorar sinais de alerta (estresse, fadiga)',
      'Praticar autocompaixão com erros/dificuldades',
      'Avaliar equilíbrio geral entre áreas de saúde',
      'Celebrar pequena vitória do dia',
      'Identificar área negligenciada para atenção',
      'Buscar ajuda profissional se necessário',
      'Fazer check-up preventivo agendado',
      'Aplicar PDCA: Planejar-Executar-Verificar-Agir'
    ],
    motivationalPhrases: [
      'Prevenção é o melhor remédio!',
      'Cuidar de si é um ato de amor próprio!',
      'Sua saúde é seu bem mais precioso!',
      'Pequenos cuidados, grande proteção!'
    ]
  }
}

// Frases motivacionais gerais baseadas no livro
const generalMotivationalPhrases = [
  'Pequenos passos levam a grandes jornadas!',
  'Hoje melhor que ontem, amanhã melhor que hoje!',
  'A virtude está na ação, não na intenção!',
  'Cada escolha é uma oportunidade de crescer!',
  'O Kaizen transforma sonhos em realidade!',
  'Sua jornada extraordinária começa agora!',
  'A serenidade vem da sabedoria em ação!',
  'Você tem o poder de transformar sua vida!'
]

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [userData, setUserData] = useState(() => {
    try {
      const saved = localStorage.getItem('pequenos-passos-data')
      return saved ? JSON.parse(saved) : {
        medals: {},
        streaks: {},
        weeklyGoals: {},
        achievements: {},
        notes: {},
        completedToday: {},
        customTasks: {},
        alarms: {}
      }
    } catch (e) {
      console.error("Failed to parse user data from localStorage", e);
      return { medals: {}, streaks: {}, weeklyGoals: {}, achievements: {}, notes: {}, completedToday: {}, customTasks: {}, alarms: {} };
    }
  });

  // Salvar dados no localStorage sempre que userData mudar
  useEffect(() => {
    localStorage.setItem('pequenos-passos-data', JSON.stringify(userData))
  }, [userData])

  // Request notification permission on app load
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission()
    }
  }, [])

  const generateMotivationalPhrase = useCallback((areaKey: string) => {
    const area = healthAreas[areaKey as keyof typeof healthAreas];
    const phrases = area ? [...area.motivationalPhrases, ...generalMotivationalPhrases] : generalMotivationalPhrases
    return phrases[Math.floor(Math.random() * phrases.length)]
  }, []);

  const addCustomTask = useCallback((areaKey: string, taskText: string) => {
    if (!taskText.trim()) return;
    setUserData((prev: any) => ({
      ...prev,
      customTasks: {
        ...prev.customTasks,
        [areaKey]: [...(prev.customTasks[areaKey] || []), taskText]
      }
    }));
  }, []);

  const removeCustomTask = useCallback((areaKey: string, taskIndex: number) => {
    setUserData((prev: any) => {
      const newCustomTasks = prev.customTasks[areaKey].filter((_: any, i: number) => i !== taskIndex)
      const newCompletedToday = { ...prev.completedToday }
      const today = new Date().toDateString()

      if (newCompletedToday[areaKey] && newCompletedToday[areaKey][today]) {
        newCompletedToday[areaKey][today] = newCompletedToday[areaKey][today].filter((id: string) => {
          return id !== `custom-${taskIndex}`
        });
      }

      const newAlarms = { ...prev.alarms }
      delete newAlarms[`${areaKey}-custom-${taskIndex}`]

      return {
        ...prev,
        customTasks: {
          ...prev.customTasks,
          [areaKey]: newCustomTasks
        },
        completedToday: newCompletedToday,
        alarms: newAlarms
      }
    });
  }, []);
  
  const calculateStreak = useCallback((areaKey: string, medals: any) => {
    if (!medals[areaKey]) return 0
    
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toDateString()
      
      if (medals[areaKey][dateString]) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }, []);

  const toggleTask = useCallback((areaKey: string, taskType: string, taskIndex: number) => {
    setUserData((prev: any) => {
      const today = new Date().toDateString()
      const areaData = prev.completedToday[areaKey] || {}
      const todayTasks = areaData[today] || []
      
      let newTodayTasks
      const taskId = `${taskType}-${taskIndex}`
      if (todayTasks.includes(taskId)) {
        newTodayTasks = todayTasks.filter((id: string) => id !== taskId)
      } else {
        newTodayTasks = [...todayTasks, taskId]
      }
      
      const newData = {
        ...prev,
        completedToday: {
          ...prev.completedToday,
          [areaKey]: {
            ...areaData,
            [today]: newTodayTasks
          }
        }
      }

      const area = healthAreas[areaKey as keyof typeof healthAreas];
      const totalBookTasks = area.bookTasks.length
      const totalCustomTasks = (prev.customTasks[areaKey] || []).length
      const totalTasks = totalBookTasks + totalCustomTasks

      if (newTodayTasks.length === totalTasks && totalTasks > 0 && !prev.medals[areaKey]?.[today]) {
        newData.medals = {
          ...prev.medals,
          [areaKey]: {
            ...prev.medals[areaKey],
            [today]: true
          }
        }
        
        const streak = calculateStreak(areaKey, newData.medals)
        newData.streaks = {
          ...prev.streaks,
          [areaKey]: streak
        }
      }

      return newData
    });
  }, [calculateStreak]);

  const getDayProgress = useCallback((areaKey: string) => {
    const today = new Date().toDateString();
    const completedTasks = userData.completedToday[areaKey]?.[today] || [];
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
    const today = new Date().toDateString()
    return userData.medals[areaKey]?.[today] || false
  }, [userData]);

  const setAlarm = useCallback((areaKey: string, taskType: string, taskIndex: number, time: string) => {
    if (!time) return

    const [hours, minutes] = time.split(':').map(Number)
    const now = new Date()
    const alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0)

    if (alarmTime.getTime() < now.getTime()) {
      alarmTime.setDate(alarmTime.getDate() + 1)
    }

    const timeToAlarm = alarmTime.getTime() - now.getTime()
    const taskId = `${areaKey}-${taskType}-${taskIndex}`
    const area = healthAreas[areaKey as keyof typeof healthAreas];
    const taskText = taskType === 'book' ? area.bookTasks[taskIndex] : userData.customTasks[areaKey][taskIndex];

    if (Notification.permission === 'granted') {
      const timeoutId = setTimeout(() => {
        new Notification('Pequenos Passos', {
          body: `Hora de ${taskText} na área de ${area.name}!`, 
          icon: '/favicon.ico'
        })
        clearAlarm(areaKey, taskType, taskIndex)
      }, timeToAlarm)

      setUserData((prev: any) => ({
        ...prev,
        alarms: {
          ...prev.alarms,
          [taskId]: { time, timeoutId: timeoutId, taskText, areaName: area.name }
        }
      }));
      alert(`Alarme definido para ${time} para a tarefa: ${taskText}`)
    } else if (Notification.permission === 'denied') {
      alert('Permissão de notificação negada. Por favor, habilite as notificações para este site nas configurações do seu navegador.')
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setAlarm(areaKey, taskType, taskIndex, time)
        } else {
          alert('Permissão de notificação negada.')
        }
      })
    }
  }, [userData]);

  const clearAlarm = useCallback((areaKey: string, taskType: string, taskIndex: number) => {
    const taskId = `${areaKey}-${taskType}-${taskIndex}`
    const alarm = userData.alarms[taskId]
    if (alarm && alarm.timeoutId) {
      clearTimeout(alarm.timeoutId)
      setUserData((prev: any) => {
        const newAlarms = { ...prev.alarms }
        delete newAlarms[taskId]
        return { ...prev, alarms: newAlarms }
      })
      alert(`Alarme para a tarefa ${alarm.taskText} foi cancelado.`)
    }
  }, [userData]);

  const DashboardView = () => (
    <div className="view-container">
      <header className="dashboard-hero">
          <h1>PEQUENOS PASSOS</h1>
          <p>Para uma Vida Extraordinária</p>
          <div className="stats-grid">
            <div className="card">
              <div className="card-content stat-card-content">
                <TrophyIcon className="text-yellow-500" style={{color: 'var(--accent-yellow)'}}/>
                <div className="stat-value">
                  {/* FIX: Cast result to Number to fix 'unknown' type error from inferred 'any' type on userData */}
                  {Number(Object.values(userData.medals || {}).reduce((total: number, areaMedals: any) => 
                    total + Object.keys(areaMedals || {}).length, 0
                  ))}
                </div>
                <div className="stat-label">Medalhas Conquistadas</div>
              </div>
            </div>
            <div className="card">
              <div className="card-content stat-card-content">
                <FlameIcon className="text-orange-500" style={{color: 'var(--accent-orange)'}}/>
                <div className="stat-value">
                  {Math.max(...Object.values(userData.streaks || {}).map((s: any) => s || 0), 0)}
                </div>
                <div className="stat-label">Maior Sequência</div>
              </div>
            </div>
            <div className="card">
              <div className="card-content stat-card-content">
                <TargetIcon className="text-green-500" style={{color: 'var(--primary)'}} />
                <div className="stat-value">
                  {Object.keys(healthAreas).filter(area => getDayProgress(area).percentage === 100).length}
                </div>
                <div className="stat-label">Áreas Completas Hoje</div>
              </div>
            </div>
          </div>
      </header>

      <main>
        <h2 style={{fontSize: '1.875rem', fontWeight: 700, textAlign: 'center', margin: '3rem 0'}}>
          Suas 8 Áreas de Saúde
        </h2>
        <div className="areas-grid">
          {Object.entries(healthAreas).map(([key, area]) => {
            const progress = getDayProgress(key)
            const hasMedal = hasMedalToday(key)
            const streak = userData.streaks[key] || 0
            const IconComponent = area.icon
            
            return (
              <div key={key} className="card area-card" onClick={() => { setSelectedArea(key); setCurrentView('tasks'); }}>
                <div className="card-content">
                  <div className="flex items-center justify-between">
                    <IconComponent style={{width: '2rem', height: '2rem', color: 'var(--primary-light)'}} />
                    {hasMedal && <div className="pulse" style={{fontSize: '1.5rem'}}>{area.medalIcon}</div>}
                  </div>
                  <h3 style={{fontSize: '1.125rem', fontWeight: 700, transition: 'color 0.2s'}}>{area.name}</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between" style={{fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem'}}>
                        <span>Progresso Hoje</span>
                        <span>{progress.completed}/{progress.total}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-inner" style={{width: `${progress.percentage}%`}}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between" style={{fontSize: '0.875rem'}}>
                      <div className="flex items-center gap-1" style={{color: 'var(--accent-orange)'}}>
                        <FlameIcon style={{width: '1rem', height: '1rem'}} />
                        <span>{streak} dias</span>
                      </div>
                      {hasMedal && <span className="badge">{area.medalName}</span>}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex justify-center gap-4" style={{marginTop: '3rem'}}>
          <button onClick={() => setCurrentView('rewards')} className="btn btn-primary" style={{padding: '0.75rem 2rem', fontSize: '1.125rem'}}>
            <TrophyIcon style={{width: '1.25rem', height: '1.25rem', marginRight: '0.5rem'}} />
            Ver Recompensas
          </button>
        </div>
      </main>
    </div>
  )

    const TasksView = () => {
    if (!selectedArea) return null;
    const area = healthAreas[selectedArea as keyof typeof healthAreas];
    const progress = getDayProgress(selectedArea);
    const hasMedal = hasMedalToday(selectedArea);
    const streak = userData.streaks[selectedArea] || 0;
    const today = new Date().toDateString();
    const completedTasks = userData.completedToday[selectedArea]?.[today] || [];
    
    const [weeklyGoal, setWeeklyGoal] = useState(userData.weeklyGoals[selectedArea] || '');
    const [todayAchievement, setTodayAchievement] = useState(userData.achievements[selectedArea] || '');
    const [quickNotes, setQuickNotes] = useState(userData.notes[selectedArea] || '');
    const [motivationalPhrase, setMotivationalPhrase] = useState('');
    const [newTaskText, setNewTaskText] = useState('');
    const [alarmTime, setAlarmTime] = useState<{[key: string]: string}>({});
    const [activeTab, setActiveTab] = useState('checklist');

    const IconComponent = area.icon;

    return (
      <div>
        <header className="view-header">
            <div className="view-header-content">
                <div className="flex items-center gap-4 mb-6">
                    <button className="btn btn-ghost" onClick={() => setCurrentView('dashboard')}>
                        <ArrowLeftIcon style={{width: '1.25rem', height: '1.25rem', marginRight: '0.5rem'}} /> Voltar
                    </button>
                </div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="task-header-icon-wrapper" style={{ backgroundColor: `var(--${area.color.replace('bg-', '--accent-')})`, color: 'white' }}>
                        <IconComponent style={{width: '2rem', height: '2rem'}} />
                    </div>
                    <div>
                        <h1 style={{fontSize: '2rem', fontWeight: 700}}>{area.name}</h1>
                        <p style={{color: 'var(--text-secondary)'}}>Baseado no livro "Pequenos Passos para uma Vida Extraordinária"</p>
                    </div>
                </div>
                <div className="grid md-grid-cols-3 gap-4">
                    <div className="card"><div className="card-content text-center">
                        <div style={{fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem'}}>{progress.completed}/{progress.total}</div>
                        <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>Tarefas Concluídas</div>
                        <div className="progress-bar" style={{marginTop: '0.5rem'}}><div className="progress-bar-inner" style={{width: `${progress.percentage}%`}}></div></div>
                    </div></div>
                     <div className="card"><div className="card-content text-center">
                        <div className="flex items-center justify-center gap-2" style={{marginBottom: '0.25rem'}}>
                            <FlameIcon style={{width: '1.5rem', height: '1.5rem', color: 'var(--accent-orange)'}} />
                            <span style={{fontSize: '1.5rem', fontWeight: 700}}>{streak}</span>
                        </div>
                        <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>Dias Seguidos</div>
                    </div></div>
                     <div className="card"><div className="card-content text-center">
                        <div style={{fontSize: '1.5rem', marginBottom: '0.25rem'}}>{hasMedal ? area.medalIcon : '○'}</div>
                        <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>{hasMedal ? area.medalName : 'Medalha Pendente'}</div>
                    </div></div>
                </div>
            </div>
        </header>
        <main className="view-container" style={{maxWidth: '56rem'}}>
            <div className="tabs">
                <div className="tabs-list">
                    <button className="tab-trigger" data-state={activeTab === 'checklist' ? 'active' : ''} onClick={() => setActiveTab('checklist')}>Checklist Diário</button>
                    <button className="tab-trigger" data-state={activeTab === 'goals' ? 'active' : ''} onClick={() => setActiveTab('goals')}>Metas & Reflexões</button>
                    <button className="tab-trigger" data-state={activeTab === 'notes' ? 'active' : ''} onClick={() => setActiveTab('notes')}>Notas Rápidas</button>
                </div>
                {activeTab === 'checklist' && <div className="tab-content">
                    <div className="card"><div className="card-content">
                        <h3 className="flex items-center gap-2" style={{fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem'}}>
                            <CheckCircle2Icon style={{color: 'var(--primary)'}} /> Tarefas Baseadas no Livro
                        </h3>
                        <div className="space-y-3">
                            {area.bookTasks.map((task, index) => {
                                const isCompleted = completedTasks.includes(`book-${index}`);
                                const taskId = `${selectedArea}-book-${index}`;
                                const currentAlarm = userData.alarms[taskId];
                                return (<div key={taskId} className={`task-item ${isCompleted ? 'completed': ''}`}>
                                    <div className="task-item-toggle" onClick={() => toggleTask(selectedArea, 'book', index)}>
                                        {isCompleted ? <CheckCircle2Icon className="flex-shrink-0" /> : <CircleIcon className="flex-shrink-0" />}
                                        <span className="task-text">{task}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {currentAlarm ? <button className="btn btn-ghost icon-btn" onClick={() => clearAlarm(selectedArea, 'book', index)}><BellOffIcon /></button> : <input type="time" className="input" value={alarmTime[taskId] || ''} onChange={e => setAlarmTime(p => ({...p, [taskId]: e.target.value}))} />}
                                        <button className="btn btn-ghost icon-btn" onClick={() => setAlarm(selectedArea, 'book', index, alarmTime[taskId])}><BellIcon /></button>
                                    </div>
                                </div>);
                            })}
                        </div>
                    </div></div>
                    <div className="card"><div className="card-content">
                        <h3 className="flex items-center gap-2" style={{fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem'}}>
                            <PlusIcon style={{color: 'var(--primary)'}} /> Minhas Tarefas Personalizadas
                        </h3>
                         <div className="space-y-3">
                            <div className="flex gap-2">
                                <input type="text" placeholder="Adicionar nova tarefa..." value={newTaskText} onChange={e => setNewTaskText(e.target.value)} className="input flex-1" onKeyPress={e => {if(e.key==='Enter'){addCustomTask(selectedArea, newTaskText); setNewTaskText('');}}} />
                                <button className="btn btn-green" onClick={() => {addCustomTask(selectedArea, newTaskText); setNewTaskText('');}}><PlusIcon /></button>
                            </div>
                            {(userData.customTasks[selectedArea] || []).map((task: string, index: number) => {
                                const isCompleted = completedTasks.includes(`custom-${index}`);
                                const taskId = `${selectedArea}-custom-${index}`;
                                const currentAlarm = userData.alarms[taskId];
                                return (<div key={taskId} className={`task-item ${isCompleted ? 'completed': ''}`}>
                                     <div className="task-item-toggle" onClick={() => toggleTask(selectedArea, 'custom', index)}>
                                        {isCompleted ? <CheckCircle2Icon className="flex-shrink-0" /> : <CircleIcon className="flex-shrink-0" />}
                                        <span className="task-text">{task}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {currentAlarm ? <button className="btn btn-ghost icon-btn" onClick={() => clearAlarm(selectedArea, 'custom', index)}><BellOffIcon /></button> : <input type="time" className="input" value={alarmTime[taskId] || ''} onChange={e => setAlarmTime(p => ({...p, [taskId]: e.target.value}))} />}
                                        <button className="btn btn-ghost icon-btn" onClick={() => setAlarm(selectedArea, 'custom', index, alarmTime[taskId])}><BellIcon /></button>
                                    </div>
                                    <button className="btn btn-ghost icon-btn" onClick={() => removeCustomTask(selectedArea, index)}><XIcon /></button>
                                </div>);
                            })}
                        </div>
                    </div></div>
                     <div className="card" style={{borderImage: 'linear-gradient(to right, var(--primary-light), var(--primary)) 1'}}><div className="card-content text-center">
                        <SparklesIcon style={{margin: '0 auto 0.5rem', width: '2rem', height: '2rem', color: 'var(--primary-light)'}} />
                        <h3 style={{fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary-light)', marginBottom: '0.5rem'}}>Frase Motivacional</h3>
                        {motivationalPhrase ? <p style={{fontStyle: 'italic'}}>"{motivationalPhrase}"</p> : <p style={{color: 'var(--text-secondary)'}}>Clique no botão para gerar uma frase inspiradora!</p>}
                        <button className="btn btn-green" onClick={() => setMotivationalPhrase(generateMotivationalPhrase(selectedArea))} style={{marginTop: '1rem'}}><SparklesIcon style={{marginRight: '0.5rem'}} /> Gerar Frase</button>
                    </div></div>
                </div>}
                {activeTab === 'goals' && <div className="tab-content">
                    <div className="card"><div className="card-content">
                        <h3 className="flex items-center gap-2" style={{fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem'}}><TargetIcon style={{color: 'var(--accent-blue)'}} /> Meta da Semana</h3>
                        <textarea placeholder="Defina sua meta SMART para esta semana..." value={weeklyGoal} onChange={e => {setWeeklyGoal(e.target.value); setUserData(p => ({...p, weeklyGoals: {...p.weeklyGoals, [selectedArea]: e.target.value}}));}} className="textarea" style={{minHeight: '100px'}} />
                        <button className="btn btn-blue" style={{marginTop: '0.75rem'}}><SparklesIcon style={{marginRight: '0.5rem'}} /> Sugestão de IA</button>
                    </div></div>
                    <div className="card"><div className="card-content">
                        <h3 className="flex items-center gap-2" style={{fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem'}}><AwardIcon style={{color: 'var(--accent-yellow)'}} /> O que já consegui hoje</h3>
                        <div className="flex gap-2">
                           <textarea placeholder="Registre suas conquistas e reflexões do dia..." value={todayAchievement} onChange={e => {setTodayAchievement(e.target.value); setUserData(p => ({...p, achievements: {...p.achievements, [selectedArea]: e.target.value}}));}} className="textarea flex-1" />
                           <button className="btn btn-ghost icon-btn" style={{border: '1px solid var(--border-color)'}}><MicIcon /></button>
                        </div>
                    </div></div>
                </div>}
                {activeTab === 'notes' && <div className="tab-content">
                     <div className="card"><div className="card-content">
                         <h3 className="flex items-center gap-2" style={{fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem'}}><BookOpenIcon style={{color: 'var(--accent-purple)'}} /> Notas Rápidas</h3>
                        <textarea placeholder="Anote insights, lembretes ou reflexões..." value={quickNotes} onChange={e => {setQuickNotes(e.target.value); setUserData(p => ({...p, notes: {...p.notes, [selectedArea]: e.target.value}}));}} className="textarea" style={{minHeight: '200px'}} />
                    </div></div>
                    <div className="card" style={{borderColor: 'var(--accent-purple)'}}><div className="card-content">
                         <h3 className="flex items-center gap-2" style={{fontSize: '1.125rem', fontWeight: 600, color: 'var(--accent-purple)', marginBottom: '0.75rem'}}><TrendingUpIcon /> Ciclo PDCA - Melhoria Contínua</h3>
                         <div className="grid md-grid-cols-4 gap-4" style={{fontSize: '0.875rem', textAlign: 'center'}}>
                            <div><div style={{fontWeight: 600}}>PLANEJAR</div><div style={{color: 'var(--text-secondary)'}}>Definir meta SMART</div></div>
                            <div><div style={{fontWeight: 600}}>EXECUTAR</div><div style={{color: 'var(--text-secondary)'}}>Implementar ações</div></div>
                            <div><div style={{fontWeight: 600}}>VERIFICAR</div><div style={{color: 'var(--text-secondary)'}}>Analisar resultados</div></div>
                            <div><div style={{fontWeight: 600}}>AGIR</div><div style={{color: 'var(--text-secondary)'}}>Ajustar estratégia</div></div>
                         </div>
                    </div></div>
                </div>}
            </div>
        </main>
      </div>
    );
  };
  
  const RewardsView = () => {
    const totalMedals = Object.values(userData.medals || {}).reduce((total: number, areaMedals: any) => total + Object.keys(areaMedals || {}).length, 0);
    // FIX: Add explicit number type to fix 'unknown' type error.
    const maxStreak: number = Math.max(...Object.values(userData.streaks || {}).map((s: any) => s || 0), 0);
    const completedAreasToday = Object.keys(healthAreas).filter(area => getDayProgress(area).percentage === 100).length;

    return (
      <div>
        <header className="view-header">
            <div className="view-header-content">
                <div className="flex items-center gap-4 mb-6">
                    <button className="btn btn-ghost" onClick={() => setCurrentView('dashboard')}>
                        <ArrowLeftIcon style={{width: '1.25rem', height: '1.25rem', marginRight: '0.5rem'}} /> Voltar
                    </button>
                </div>
                <div className="text-center">
                    <h1 style={{fontSize: '2.5rem', fontWeight: 700}}>SUAS CONQUISTAS</h1>
                    <p style={{color: 'var(--text-secondary)'}}>Celebre cada passo da sua jornada extraordinária</p>
                </div>
            </div>
        </header>

        <main className="view-container">
            <div className="grid md-grid-cols-3 gap-6 mb-12">
                <div className="card" style={{borderColor: 'var(--accent-yellow)'}}><div className="card-content text-center">
                    <TrophyIcon style={{width: '4rem', height: '4rem', margin: '0 auto 1rem', color: 'var(--accent-yellow)'}} />
                    <div style={{fontSize: '2.25rem', fontWeight: 700}}>{totalMedals}</div>
                    <div style={{color: 'var(--accent-yellow)', fontWeight: 600}}>Medalhas Conquistadas</div>
                </div></div>
                <div className="card" style={{borderColor: 'var(--accent-orange)'}}><div className="card-content text-center">
                    <FlameIcon style={{width: '4rem', height: '4rem', margin: '0 auto 1rem', color: 'var(--accent-orange)'}} />
                    <div style={{fontSize: '2.25rem', fontWeight: 700}}>{maxStreak}</div>
                    <div style={{color: 'var(--accent-orange)', fontWeight: 600}}>Maior Sequência</div>
                </div></div>
                <div className="card" style={{borderColor: 'var(--primary)'}}><div className="card-content text-center">
                    <TargetIcon style={{width: '4rem', height: '4rem', margin: '0 auto 1rem', color: 'var(--primary)'}} />
                    <div style={{fontSize: '2.25rem', fontWeight: 700}}>{completedAreasToday}</div>
                    <div style={{color: 'var(--primary)', fontWeight: 600}}>Áreas Completas Hoje</div>
                </div></div>
            </div>

            <div className="mb-12">
                <h2 style={{fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '1.5rem'}}>MEDALHAS POR ÁREA</h2>
                <div className="grid md-grid-cols-2 lg-grid-cols-4 gap-6">
                    {Object.entries(healthAreas).map(([key, area]) => {
                        const medalCount = Object.keys(userData.medals[key] || {}).length;
                        const streak = userData.streaks[key] || 0;
                        const IconComponent = area.icon;
                        return (<div key={key} className="card"><div className="card-content text-center">
                            <div className="reward-shield">
                               <svg className="reward-shield-bg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M50 0L0 25V75L50 100L100 75V25L50 0Z" fill="url(#shield-gradient)"/>
                                <defs><linearGradient id="shield-gradient" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse"><stop stopColor="#10b981"/><stop offset="1" stopColor="#059669"/></linearGradient></defs>
                               </svg>
                               <div className="reward-shield-content">
                                    <IconComponent style={{width: '2.5rem', height: '2.5rem'}} />
                                    <span style={{fontSize: '1.25rem'}}>{area.medalIcon}</span>
                               </div>
                            </div>
                            <h3 style={{fontWeight: 700}}>{area.medalName}</h3>
                            <p style={{fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem'}}>{area.name}</p>
                            <div className="space-y-2" style={{fontSize: '0.875rem', textAlign: 'left', padding: '0 1rem'}}>
                                <div className="flex justify-between"><span style={{color: 'var(--text-secondary)'}}>Medalhas:</span> <span style={{fontWeight: 600}}>{medalCount}</span></div>
                                <div className="flex justify-between"><span style={{color: 'var(--text-secondary)'}}>Sequência:</span> <span style={{fontWeight: 600, color: 'var(--accent-orange)'}}>{streak} dias</span></div>
                            </div>
                        </div></div>)
                    })}
                </div>
            </div>
             <div className="mb-12">
                <h2 style={{fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '1.5rem'}}>TROFÉUS ESPECIAIS</h2>
                <div className="grid md-grid-cols-3 gap-6">
                    <div className={`card ${maxStreak >= 7 ? 'border-amber-500' : ''}`} style={{borderColor: maxStreak >= 7 ? '#a16207' : ''}}><div className="card-content text-center">
                        <div style={{fontSize: '4rem', marginBottom: '1rem'}}>🥉</div>
                        <h3 style={{fontSize: '1.25rem', fontWeight: 700}}>Troféu Bronze</h3><p style={{color: 'var(--text-secondary)', marginBottom: '0.75rem'}}>7 dias seguidos</p>
                        <div style={{fontSize: '1.125rem', fontWeight: 600, color: maxStreak >= 7 ? '#f59e0b' : 'var(--text-secondary)'}}>{maxStreak >= 7 ? 'CONQUISTADO!' : `${maxStreak}/7 dias`}</div>
                    </div></div>
                     <div className={`card ${maxStreak >= 15 ? 'border-gray-400' : ''}`} style={{borderColor: maxStreak >= 15 ? '#9ca3af' : ''}}><div className="card-content text-center">
                        <div style={{fontSize: '4rem', marginBottom: '1rem'}}>🥈</div>
                        <h3 style={{fontSize: '1.25rem', fontWeight: 700}}>Troféu Prata</h3><p style={{color: 'var(--text-secondary)', marginBottom: '0.75rem'}}>15 dias seguidos</p>
                        <div style={{fontSize: '1.125rem', fontWeight: 600, color: maxStreak >= 15 ? '#d1d5db' : 'var(--text-secondary)'}}>{maxStreak >= 15 ? 'CONQUISTADO!' : `${maxStreak}/15 dias`}</div>
                    </div></div>
                     <div className={`card ${maxStreak >= 30 ? 'border-yellow-500' : ''}`} style={{borderColor: maxStreak >= 30 ? '#eab308' : ''}}><div className="card-content text-center">
                        <div style={{fontSize: '4rem', marginBottom: '1rem'}}>🥇</div>
                        <h3 style={{fontSize: '1.25rem', fontWeight: 700}}>Troféu Ouro</h3><p style={{color: 'var(--text-secondary)', marginBottom: '0.75rem'}}>30 dias seguidos</p>
                        <div style={{fontSize: '1.125rem', fontWeight: 600, color: maxStreak >= 30 ? '#facc15' : 'var(--text-secondary)'}}>{maxStreak >= 30 ? 'CONQUISTADO!' : `${maxStreak}/30 dias`}</div>
                    </div></div>
                </div>
            </div>
             <div>
                <h2 style={{fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '1.5rem'}}>HISTÓRICO DA SEMANA</h2>
                <div className="card"><div className="card-content">
                    <div className="weekly-history-grid">
                        {Array.from({ length: 7 }).map((_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() - (6 - i));
                            const dateString = date.toDateString();
                            const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
                            const dayMedals = Object.keys(healthAreas).filter(area => userData.medals[area]?.[dateString]).length;
                            return (<div key={i} className="history-day">
                                <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem'}}>{dayName.replace('.','')}</div>
                                <div style={{fontSize: '1.125rem', fontWeight: 700}}>{dayMedals}</div>
                                <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>medalhas</div>
                            </div>)
                        })}
                    </div>
                </div></div>
            </div>
        </main>
      </div>
    );
  };

  // Render based on current view
  return (
    <div className="app-container">
      {currentView === 'dashboard' && <DashboardView />}
      {currentView === 'tasks' && <TasksView />}
      {currentView === 'rewards' && <RewardsView />}
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
