/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

declare var TimestampTrigger: any;

// --- Icon Components (replaces lucide-react) ---
const TrophyIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>);
const TargetIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
const CheckCircle2Icon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>);
const CircleIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>);
const PlusIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>);
const SparklesIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="m12 3-1.9 3.8-3.8 1.9 3.8 1.9L12 14.4l1.9-3.8 3.8-1.9-3.8-1.9L12 3zM21 12l-1.9 3.8-3.8 1.9 3.8 1.9L21 21l1.9-3.8 3.8-1.9-3.8-1.9L21 12zM3 7l-1.9 3.8-3.8 1.9 3.8 1.9L3 18l1.9-3.8 3.8-1.9-3.8-1.9L3 7z"/></svg>);
const FlameIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.194 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>);
const AwardIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>);
const TrendingUpIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>);
const DumbbellIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.9a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.828l1.768-1.767a2 2 0 1 1-2.828-2.829l-1.768 1.768a2 2 0 1 1-2.828-2.828l1.767-1.768a2 2 0 1 1-2.829-2.828L2.1 5.343a2 2 0 1 1 2.828 2.829l1.768-1.768a2 2 0 1 1 2.829 2.828l-1.768 1.768a2 2 0 1 1 2.828 2.828l1.768-1.767a2 2 0 1 1 2.828 2.829l-1.767 1.768a2 2 0 1 1 2.829 2.828z"/></svg>);
const BrainIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15A2.5 2.5 0 0 1 9.5 22h-3A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2h3z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15A2.5 2.5 0 0 0 14.5 22h3a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 17.5 2h-3z"/><path d="M9.5 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/><path d="M14.5 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>);
const PiggyBankIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M10 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M14 6.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/><path d="M9 9.5v1a1.5 1.5 0 0 0 3 0v-1h4.5a2.5 2.5 0 0 1 2.5 2.5v3.5a2.5 2.5 0 0 1-2.5 2.5H15v-1.5a.5.5 0 0 0-1 0V18h-4v-1.5a.5.5 0 0 0-1 0V18H4.5a2.5 2.5 0 0 1-2.5-2.5v-4A2.5 2.5 0 0 1 4.5 9H9z"/></svg>);
const HeartIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>);
const BriefcaseIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>);
const UsersIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const StarIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const ShieldIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const BookOpenIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>);
const ArrowLeftIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);
const ArrowRightIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>);
const XIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>);
const MicIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="23"/><line x1="8" x2="16" y1="23" y2="23"/></svg>);
const BellIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>);
const BellOffIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><path d="M18 8a6 6 0 0 0-9.33-5"/><line x1="1" x2="23" y1="1" y2="23"/></svg>);
const CalendarIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>);
const FootprintsIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M4 16.85V18a2 2 0 0 0 2 2h4.56a2 2 0 0 0 1.63-3.11L8.37 9.9a2 2 0 0 0-3.26 0L4 11.23V13a2 2 0 0 0 2 2h1"/><path d="M10.86 13.23a2 2 0 0 1 3.26 0l1.23 1.33a2 2 0 0 1 0 3.11L11.5 21.49a2 2 0 0 1-1.63.51H6a2 2 0 0 1-2-2v-1.15"/><path d="m18.23 11.45-2.58-2.58a2 2 0 0 0-2.83 0l-1.39 1.39a2 2 0 0 0 0 2.83l2.58 2.58a2 2 0 0 0 2.83 0l1.39-1.39a2 2 0 0 0 0-2.83z"/><path d="m12 2-2.5 2.5"/><path d="m14 4-2.5 2.5"/><path d="m16 6-2.5 2.5"/><path d="m18 8-2.5 2.5"/></svg>);
const StretchingIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><circle cx="12" cy="5" r="1"/><path d="M9.5 14l-3 4.5"/><path d="M14.5 14l3 4.5"/><path d="M14.5 9.5 12 12l-2.5-2.5"/><path d="m18 12-2.5 2.5"/><path d="M6 12l2.5 2.5"/><path d="M12 12v10"/></svg>);
const RepeatIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M17 2.1l4 4-4 4"/><path d="M3 12.6A9 9 0 0 1 21 12h-4a5 5 0 0 0-9.43 2.25"/><path d="M7 21.9l-4-4 4-4"/><path d="M21 11.4A9 9 0 0 1 3 12h4a5 5 0 0 0 9.43-2.25"/></svg>);
const LightbulbIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>);

// Focus Music Icons
const PlayIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>);
const PauseIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>);
const Volume2Icon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>);
const VolumeXIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>);
const WavesIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M2 6c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.5 0 2.5 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.5 0 2.5 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.5 0 2.5 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>);
const CloudRainIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M16 13v8"/><path d="M12 13v8"/><path d="M8 13v8"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>);
const TreePineIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="m12 14-4 4"/><path d="m16 14 4 4"/><path d="M12 22V10"/><path d="m15 11-3-3-3 3"/><path d="M17 9.5 12 5 7 9.5"/><path d="M20 19.5a2.5 2.5 0 0 1-5 0"/><path d="M4 19.5a2.5 2.5 0 0 0 5 0"/></svg>);
const MusicIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>);


// Configuração das áreas de saúde com tarefas do livro
const healthAreas = {
  fisica: { name: 'Saúde Física', icon: DumbbellIcon, color: 'bg-green-500', medalName: 'Corpo em Ação', medalIcon: '🏃', bookTasks: ['Manter horário fixo de sono (ex: 23h às 6h)', 'Criar ritual noturno 1h antes de dormir', 'Praticar mindful eating - comer devagar', 'Fazer atividade física prazerosa por 20min', 'Praticar respiração consciente por 5min', 'Aplicar dicotomia do controle em situação de estresse', 'Consumir alimentos ricos em fibras', 'Parar de comer aos 80% de saciedade'], motivationalPhrases: ['Seu corpo é seu templo, cuide dele com amor!', 'Cada movimento é um passo em direção à vitalidade!', 'A disciplina de hoje é a liberdade de amanhã!', 'Pequenos hábitos, grandes transformações!'] },
  mental: { name: 'Saúde Mental', icon: BrainIcon, color: 'bg-blue-500', medalName: 'Mente de Aço', medalIcon: '🧠', bookTasks: ['Praticar dicotomia do controle - focar no controlável', 'Questionar julgamentos emocionais perturbadores', 'Manter vigilância sobre pensamentos automáticos', 'Meditar 10min para regulação emocional', 'Contemplar adversidades com calma (premeditatio malorum)', 'Reflexão tripla: Epicuro + Kaizen + Estoicismo', 'Identificar prazer excessivo ou simples negligenciado', 'Escolher 1 pequeno hábito para melhorar (1%)'], motivationalPhrases: ['Sua mente é seu maior poder, domine-a!', 'Pensamentos são nuvens, você é o céu!', 'A serenidade vem da sabedoria interior!', 'Cada respiração consciente é um ato de liberdade!'] },
  financeira: { name: 'Saúde Financeira', icon: PiggyBankIcon, color: 'bg-yellow-500', medalName: 'Guardião da Carteira', medalIcon: '💰', bookTasks: ['Praticar pausa de 24h antes de compras não essenciais', 'Registrar todos os gastos do dia', 'Transferir valor automático para poupança', 'Identificar viés financeiro em decisão recente', 'Revisar orçamento mensal (regra 50/30/20)', 'Estudar finanças por 30min (artigo/podcast)', 'Avaliar progresso da reserva de emergência', 'Listar dívidas por taxa de juros'], motivationalPhrases: ['Cada real poupado é um passo rumo à liberdade!', 'Disciplina financeira hoje, tranquilidade amanhã!', 'Você é o CEO da sua vida financeira!', 'Pequenas economias, grandes conquistas!'] },
  familiar: { name: 'Saúde Familiar', icon: HeartIcon, color: 'bg-red-500', medalName: 'Coração Conectado', medalIcon: '❤️', bookTasks: ['Praticar CNV: Observação + Sentimento + Necessidade + Pedido', 'Escuta ativa: guardar celular, manter contato visual', 'Dedicar 15min de tempo de qualidade sem distrações', 'Expressar afeto: toque, elogio, atenção, mimo ou serviço', 'Compartilhar sentimento/desafio real (vulnerabilidade)', 'Comunicar limite de forma assertiva e respeitosa', 'Refletir sobre meu estilo de apego', 'Validar sentimentos do outro sem julgar'], motivationalPhrases: ['O amor se multiplica quando é compartilhado!', 'Cada conversa é uma oportunidade de conexão!', 'Família é onde o coração encontra seu lar!', 'Pequenos gestos, grandes vínculos!'] },
  profissional: { name: 'Saúde Profissional', icon: BriefcaseIcon, color: 'bg-purple-500', medalName: 'Mestre do Saber', medalIcon: '📚', bookTasks: ['Refletir: meu trabalho tem significado maior?', 'Alinhar uma ação do trabalho aos meus valores', 'Estudar habilidade-chave por 30min', 'Aplicar dicotomia do controle no trabalho', 'Monitorar níveis de energia e humor (burnout)', 'Usar técnica Pomodoro para trabalho focado', 'Criar separação clara trabalho-vida pessoal', 'Imaginar meu epitáfio profissional desejado'], motivationalPhrases: ['Seu trabalho é sua contribuição para o mundo!', 'Cada habilidade desenvolvida é um investimento em você!', 'Propósito transforma trabalho em vocação!', 'Excelência é um hábito, não um ato!'] },
  social: { name: 'Saúde Social', icon: UsersIcon, color: 'bg-indigo-500', medalName: 'Alma Conectada', medalIcon: '🤝', bookTasks: ['Buscar interação social positiva (abraço, conversa)', 'Dedicar tempo de qualidade a pessoa próxima', 'Praticar escuta ativa: ouvir para compreender', 'Compartilhar pensamento/sentimento real', 'Ser proativo: enviar mensagem ou marcar encontro', 'Expressar gratidão específica a alguém', 'Usar CNV em conflito: problema, não pessoa', 'Identificar e comunicar limite social'], motivationalPhrases: ['Conexões autênticas nutrem a alma!', 'Cada conversa é uma ponte entre corações!', 'Você é parte de uma rede de amor e apoio!', 'Pequenos gestos, grandes amizades!'] },
  espiritual: { name: 'Saúde Espiritual', icon: StarIcon, color: 'bg-amber-500', medalName: 'Luz Interior', medalIcon: '✨', bookTasks: ['Meditar/mindfulness por 10min', 'Refletir sobre valores e propósito de vida', 'Passar tempo consciente na natureza', 'Praticar gratidão: listar 3 bênçãos do dia', 'Autoexploração: o que espiritualidade significa?', 'Escolher prática espiritual para focar', 'Registrar experiência interna da prática', 'Ler texto inspirador ou filosófico'], motivationalPhrases: ['Sua luz interior ilumina o caminho!', 'Cada momento de gratidão é uma oração!', 'Você é parte de algo maior e sagrado!', 'A paz interior é seu maior tesouro!'] },
  preventiva: { name: 'Saúde Preventiva', icon: ShieldIcon, color: 'bg-teal-500', medalName: 'Protetor da Saúde', medalIcon: '🛡️', bookTasks: ['Monitorar sinais de alerta (estresse, fadiga)', 'Praticar autocompaixão com erros/dificuldades', 'Avaliar equilíbrio geral entre áreas de saúde', 'Celebrar pequena vitória do dia', 'Identificar área negligenciada para atenção', 'Buscar ajuda profissional se necessário', 'Fazer check-up preventivo agendado', 'Aplicar PDCA: Planejar-Executar-Verificar-Agir'], motivationalPhrases: ['Prevenção é o melhor remédio!', 'Cuidar de si é um ato de amor próprio!', 'Sua saúde é seu bem mais precioso!', 'Pequenos cuidados, grande proteção!'] }
}

const generalMotivationalPhrases = ['Pequenos passos levam a grandes jornadas!', 'Hoje melhor que ontem, amanhã melhor que hoje!', 'A virtude está na ação, não na intenção!', 'Cada escolha é uma oportunidade de crescer!', 'O Kaizen transforma sonhos em realidade!', 'Sua jornada extraordinária começa agora!', 'A serenidade vem da sabedoria em ação!', 'Você tem o poder de transformar sua vida!'];

const handleKeyboardClick = (e: React.KeyboardEvent, callback: () => void) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    callback();
  }
};

const ProgressBar = ({ percentage, color, className = '' }: { percentage: number; color?: string; className?: string }) => (
    <div className={`progress-bar ${className}`}>
        <div 
            className="progress-bar-inner" 
            style={{ 
                width: `${percentage}%`,
                ...(color && { backgroundColor: color }) 
            }}
        />
    </div>
);

const DashboardView = ({ userData, getDayProgress, hasMedalToday, setCurrentView, setSelectedArea, setIsAlarmsModalOpen, setIsFeatureModalOpen }: any) => {
    const weeklyGoals = useMemo(() => 
        Object.entries(userData.weeklyGoals || {}).filter(([, goal]) => typeof goal === 'string' && goal.trim() !== ''),
        [userData.weeklyGoals]
    );

    const pendingFeatures = useMemo(() => userData.pendingFeatures || [], [userData.pendingFeatures]);

    return (
    <div className="view-container">
      <header className="dashboard-hero">
          <h1>PEQUENOS PASSOS</h1>
          <p>Para uma Vida Extraordinária</p>
          <div className="stats-grid">
            <div className="card">
              <div className="card-content stat-card-content">
                <TrophyIcon className="icon" style={{color: 'var(--accent-yellow)'}}/>
                <div>
                  <div className="stat-value">
                    {Number(Object.values(userData.medals || {}).reduce((total: number, areaMedals: any) => 
                      total + Object.keys(areaMedals || {}).length, 0
                    ))}
                  </div>
                  <div className="stat-label">Medalhas Conquistadas</div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-content stat-card-content">
                <FlameIcon className="icon" style={{color: 'var(--accent-orange)'}}/>
                <div>
                  <div className="stat-value">
                    {Math.max(...Object.values(userData.streaks || {}).map((s: any) => Number(s) || 0), 0)}
                  </div>
                  <div className="stat-label">Maior Sequência</div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-content stat-card-content">
                <TargetIcon className="icon" style={{color: 'var(--primary)'}} />
                <div>
                  <div className="stat-value">
                    {Object.keys(healthAreas).filter(area => getDayProgress(area).percentage === 100).length}
                  </div>
                  <div className="stat-label">Áreas Completas Hoje</div>
                </div>
              </div>
            </div>
            <div 
                className="card stat-card-clickable" 
                role="button" 
                tabIndex={0} 
                onClick={() => setIsAlarmsModalOpen(true)} 
                onKeyDown={(e) => handleKeyboardClick(e, () => setIsAlarmsModalOpen(true))}
                aria-label="Gerenciar alarmes"
            >
                <div className="card-content stat-card-content">
                    <BellIcon className="icon" style={{color: 'var(--accent-blue)'}}/>
                    <div>
                        <div className="stat-value">
                            {Object.keys(userData.alarms || {}).length}
                        </div>
                        <div className="stat-label">Alarmes Ativos</div>
                    </div>
                </div>
            </div>
          </div>
      </header>
      <main>
        <h2 className="section-title">Metas da Semana</h2>
        {weeklyGoals.length > 0 ? (
            <div className="weekly-goals-grid">
                {weeklyGoals.map(([key, goal]) => {
                    const area = healthAreas[key as keyof typeof healthAreas];
                    if (!area) return null;
                    const IconComponent = area.icon;
                    const handleCardClick = () => { setSelectedArea(key); setCurrentView('tasks'); };
                    return (
                        <div
                            key={key}
                            className="card goal-card"
                            style={{ '--area-color': `var(--accent-${area.color.split('-')[1]}-500)` } as React.CSSProperties}
                            onClick={handleCardClick}
                            onKeyDown={(e) => handleKeyboardClick(e, handleCardClick)}
                            role="button"
                            tabIndex={0}
                            aria-label={`Ver metas e tarefas de ${area.name}`}
                        >
                            <div className="card-content">
                                <div className="goal-card-header">
                                    <IconComponent className="icon" />
                                    <h3>{area.name}</h3>
                                </div>
                                <p className="goal-card-text">{goal as string}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="card no-goals-card">
                <TargetIcon className="icon" />
                <p>
                    Você ainda não definiu nenhuma meta para esta semana.
                    Clique em uma área abaixo e vá para a aba 'Metas & Reflexões' para começar!
                </p>
            </div>
        )}

        <h2 className="section-title">Funções em Análise</h2>
        {pendingFeatures.length > 0 ? (
          <div className="pending-features-grid">
            {pendingFeatures.map((feature: any) => (
              <div key={feature.id} className="card feature-card">
                <div className="card-content">
                  <div className="feature-card-header">
                    <LightbulbIcon className="icon" />
                    <h3>{feature.name}</h3>
                  </div>
                  <p className="feature-card-text">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card no-features-card">
            <LightbulbIcon className="icon" />
            <p>
              Nenhuma nova função foi sugerida ainda.
              Seja o primeiro a compartilhar uma ideia para melhorar o app!
            </p>
          </div>
        )}

        <h2 className="section-title">
          Suas 8 Áreas de Saúde
        </h2>
        <div className="areas-grid">
          {Object.entries(healthAreas).map(([key, area]) => {
            const progress = getDayProgress(key);
            const hasMedal = hasMedalToday(key);
            const streak = userData.streaks[key] || 0;
            const IconComponent = area.icon;
            const handleCardClick = () => { setSelectedArea(key); setCurrentView('tasks'); };
            
            return (
              <div 
                key={key} 
                className="card area-card" 
                onClick={handleCardClick}
                onKeyDown={(e) => handleKeyboardClick(e, handleCardClick)}
                role="button"
                tabIndex={0}
                aria-label={`Acessar área de ${area.name}`}
              >
                <div className="card-content">
                  <div className="flex items-center justify-between">
                    <IconComponent className="icon" style={{width: '2rem', height: '2rem', color: `var(--accent-${area.color.split('-')[1]}-500)`}} />
                    {hasMedal && <div className="pulse" style={{fontSize: '1.5rem'}}>{area.medalIcon}</div>}
                  </div>
                  <h3 style={{transition: 'color 0.2s'}}>{area.name}</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between" style={{fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem'}}>
                        <span>Progresso Hoje</span>
                        <span>{progress.completed}/{progress.total}</span>
                      </div>
                      <ProgressBar 
                        percentage={progress.percentage} 
                        color={`var(--accent-${area.color.split('-')[1]}-500)`}
                      />
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
        <div className="dashboard-actions">
          <button onClick={() => setCurrentView('rewards')} className="btn btn-primary">
            <TrophyIcon className="icon-left"/>
            Ver Recompensas
          </button>
          <button onClick={() => setIsFeatureModalOpen(true)} className="btn btn-blue">
            <SparklesIcon className="icon-left"/>
            Sugerir Função
          </button>
        </div>
      </main>
    </div>
)};

const WeeklyProgressCard = ({ areaKey, userData, onOpenCalendar }: any) => {
    const area = healthAreas[areaKey as keyof typeof healthAreas];

    const weeklyMedals = useMemo(() => {
        const medals = userData.medals[areaKey] || {};
        let count = 0;
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0=Sun, 6=Sat
        const startOfWeek = new Date(today);
        // Set to Monday of the current week
        startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        startOfWeek.setHours(0, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(startOfWeek);
            currentDay.setDate(startOfWeek.getDate() + i);
            if (medals[currentDay.toDateString()]) {
                count++;
            }
        }
        return count;
    }, [userData.medals, areaKey]);

    const IconComponent = area.icon;

    return (
        <div className="card weekly-progress-card" style={{'--area-color': `var(--accent-${area.color.split('-')[1]}-500)`} as React.CSSProperties}>
            <div className="card-content">
                <div className="weekly-progress-header">
                    <div className="weekly-progress-icon-wrapper">
                       <IconComponent className="weekly-progress-icon" />
                    </div>
                    <div>
                        <h3 className="weekly-progress-title">Progresso da Semana</h3>
                        <p className="weekly-progress-area-name">{area.name}</p>
                    </div>
                </div>
                <div className="weekly-progress-body">
                     <div className="weekly-progress-dots">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div key={i} className={`progress-dot ${i < weeklyMedals ? 'filled' : ''}`}></div>
                        ))}
                    </div>
                    <p className="weekly-progress-text">{weeklyMedals} de 7 dias com medalha</p>
                </div>
                <button className="btn weekly-progress-button" onClick={() => onOpenCalendar(areaKey)}>
                    Ver Calendário de Atividade
                </button>
            </div>
        </div>
    );
};

// --- Helper Functions ---
const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const formatPace = (ms: number, km: number) => {
    if (km === 0 || ms === 0) return '00:00';
    const paceMsPerKm = ms / km;
    const totalSeconds = Math.floor(paceMsPerKm / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const stretchingExercises = [
    { name: 'Alongamento de Quadríceps em Pé', description: 'Em pé, equilibre-se em uma perna e puxe o outro pé em direção ao glúteo, sentindo o alongamento na frente da coxa. Mantenha por 30s.', imgPlaceholder: 'Ilustração de uma pessoa em pé puxando o calcanhar para o glúteo.', duration: 30 },
    { name: 'Alongamento de Isquiotibiais Sentado', description: 'Sente-se com uma perna estendida e a outra dobrada. Incline-se para a frente sobre a perna estendida. Mantenha por 30s.', imgPlaceholder: 'Ilustração de uma pessoa sentada no chão, inclinando-se sobre a perna estendida.', duration: 30 },
    { name: 'Alongamento Borboleta', description: 'Sente-se, junte as solas dos pés e puxe os calcanhares para perto do corpo. Pressione suavemente os joelhos para baixo. Mantenha por 30s.', imgPlaceholder: 'Ilustração de uma pessoa sentada com as solas dos pés juntas.', duration: 30 },
    { name: 'Alongamento de Tríceps', description: 'Leve um braço por cima da cabeça, dobre o cotovelo e puxe-o suavemente com a outra mão para alongar o tríceps. Mantenha por 30s por lado.', imgPlaceholder: 'Ilustração de uma pessoa puxando o cotovelo atrás da cabeça.', duration: 30 },
    { name: 'Alongamento Gato-Vaca', description: 'Em quatro apoios, arqueie as costas para cima (gato) e depois para baixo (vaca), alternando os movimentos lentamente.', imgPlaceholder: 'Ilustração da postura do Gato e da Vaca na ioga.', duration: 60 },
    { name: 'Postura da Criança', description: 'Ajoelhe-se e sente-se sobre os calcanhares. Incline-se para a frente, estendendo os braços à sua frente ou ao lado do corpo. Mantenha por 60s.', imgPlaceholder: 'Ilustração da Postura da Criança na ioga.', duration: 60 }
];

const StretchingExercise = ({ exercise }: { exercise: any }) => {
    const [timeLeft, setTimeLeft] = useState(exercise.duration);
    const [isActive, setIsActive] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = window.setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [timeLeft, isActive]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(exercise.duration);
    };

    const progressPercentage = (exercise.duration - timeLeft) / exercise.duration * 100;

    return (
        <div className="card stretching-card">
            <div className="stretching-img-placeholder">
                <StretchingIcon />
                <p>{exercise.imgPlaceholder}</p>
            </div>
            <div className="card-content">
                <h4 className="stretching-card-title">{exercise.name}</h4>
                <p className="stretching-card-description">{exercise.description}</p>
                <div className="stretching-timer">
                    <div className="timer-display-wrapper">
                        <div className="timer-progress" style={{ width: `${progressPercentage}%` }}></div>
                        <span className="timer-display">{timeLeft}s</span>
                    </div>
                    <div className="timer-controls">
                        <button onClick={toggleTimer} className={`btn btn-sm ${isActive ? 'btn-red' : 'btn-green'}`}>
                            {isActive ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button onClick={resetTimer} className="btn btn-sm btn-ghost">
                            Resetar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const focusMusicTracks = [
    { name: 'Chuva Leve', icon: CloudRainIcon, url: 'https://cdn.pixabay.com/audio/2022/10/21/audio_18c593256a.mp3' },
    { name: 'Fogueira Aconchegante', icon: FlameIcon, url: 'https://cdn.pixabay.com/audio/2022/11/15/audio_1380907106.mp3' },
    { name: 'Ondas do Mar', icon: WavesIcon, url: 'https://cdn.pixabay.com/audio/2023/10/18/audio_2910712739.mp3' },
    { name: 'Floresta Tranquila', icon: TreePineIcon, url: 'https://cdn.pixabay.com/audio/2023/08/03/audio_5119154f24.mp3' },
    { name: 'Música Ambiente Calma', icon: MusicIcon, url: 'https://cdn.pixabay.com/audio/2022/08/04/audio_2dde648d15.mp3' }
];

const FocusMusicPlayer = ({ playerState, playerControls }: { playerState: any, playerControls: any }) => {
    const { currentTrackIndex, isPlaying, volume } = playerState;
    const { setTrack, play, pause, setVolume } = playerControls;

    const handleTrackSelect = (index: number) => {
        if (index === currentTrackIndex) {
            if (isPlaying) {
                pause();
            } else {
                play();
            }
        } else {
            setTrack(index);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
    };

    const handleTogglePlay = () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    };

    const currentTrack = currentTrackIndex !== null ? focusMusicTracks[currentTrackIndex] : null;

    return (
        <div className="card focus-music-player">
            <div className="card-content">
                <h3 className="card-title mb-4">Música de Foco</h3>
                <ul className="music-track-list">
                    {focusMusicTracks.map((track, index) => {
                        const TrackIcon = track.icon;
                        const isActive = index === currentTrackIndex;
                        return (
                            <li
                                key={track.name}
                                className={`music-track-item ${isActive ? 'active' : ''}`}
                                onClick={() => handleTrackSelect(index)}
                                onKeyDown={(e) => handleKeyboardClick(e, () => handleTrackSelect(index))}
                                tabIndex={0}
                                role="button"
                                aria-pressed={isActive}
                            >
                                <TrackIcon className="icon" />
                                <span>{track.name}</span>
                                {isActive && isPlaying && <div className="playing-indicator" />}
                            </li>
                        );
                    })}
                </ul>
                {currentTrack && (
                    <div className="music-controls">
                        <div className="now-playing">
                            <span>Tocando agora:</span>
                            <p>{currentTrack.name}</p>
                        </div>
                        <div className="main-controls">
                            <button className="btn btn-ghost icon-btn" onClick={handleTogglePlay} aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}>
                                {isPlaying ? <PauseIcon /> : <PlayIcon />}
                            </button>
                            <div className="volume-control">
                                {volume > 0 ? <Volume2Icon /> : <VolumeXIcon />}
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="volume-slider"
                                    aria-label="Controle de volume"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
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

const RewardsView = ({ userData, setCurrentView, onOpenCalendar }: any) => {
    const totalMedals = Number(Object.values(userData.medals || {}).reduce((total: number, areaMedals: any) => total + Object.keys(areaMedals || {}).length, 0));
    const maxStreak = Math.max(...Object.values(userData.streaks || {}).map((s: any) => Number(s) || 0), 0);

    const medalTrophies = useMemo(() => {
        const trophies = [
            { level: 'Bronze', threshold: 10, color: 'var(--trophy-bronze)' },
            { level: 'Prata', threshold: 50, color: 'var(--trophy-silver)' },
            { level: 'Ouro', threshold: 100, color: 'var(--trophy-gold)' },
        ];
        return trophies.map(trophy => {
            const unlocked = totalMedals >= trophy.threshold;
            return { ...trophy, unlocked };
        });
    }, [totalMedals]);

    const streakTrophies = useMemo(() => {
        const trophies = [
            { level: 'Bronze', threshold: 7, color: 'var(--trophy-bronze)' },
            { level: 'Prata', threshold: 30, color: 'var(--trophy-silver)' },
            { level: 'Ouro', threshold: 100, color: 'var(--trophy-gold)' },
        ];
        return trophies.map(trophy => {
            const unlocked = maxStreak >= trophy.threshold;
            return { ...trophy, unlocked };
        });
    }, [maxStreak]);

    const renderActivityCalendar = (areaKey: string) => {
        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 1); // include today
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 365); // last year

        const dates = Array.from({ length: 366 }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            return date;
        });

        const medalsForArea = userData.medals[areaKey] || {};
        const contributions: { [key: string]: number } = {};
        Object.keys(medalsForArea).forEach(dateStr => {
            contributions[dateStr] = 1; // Simple count, could be more complex
        });

        const maxLevel = 1; // For now just 0 or 1
        const getLevel = (count: number) => {
            if (count === 0) return 0;
            const percentage = count / maxLevel;
            if (percentage < 0.25) return 1;
            if (percentage < 0.5) return 2;
            if (percentage < 0.75) return 3;
            return 4;
        };

        const firstDay = dates[0].getDay();

        return (
            <div className="activity-calendar">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                {dates.map((date, index) => {
                    const count = contributions[date.toDateString()] || 0;
                    const level = getLevel(count);
                    return (
                       <div key={index} className="calendar-day-wrapper" title={`${date.toDateString()}: ${count} medalha(s)`}>
                          <div className={`calendar-day day-level-${level}`}></div>
                       </div>
                    )
                })}
            </div>
        );
    };

    const renderMedalProgress = (areaKey: string, dates: any) => {
        // FIX: A type error on the line below is caused by `dates` being inferred as
        // `unknown` when iterating `Object.entries` over an untyped object. Adding
        // a type assertion to `userData.medals` in `RewardsView` resolves this.
        if (typeof dates !== 'object' || dates === null) {
          return 0; // Return a default value if dates is not a valid object
        }
        const totalMedals = Object.keys(dates).length;
        return totalMedals;
    };


    return (
        <div className="view-container">
            <header className="view-header">
                <div className="view-header-content">
                    <button onClick={() => setCurrentView('dashboard')} className="btn btn-ghost" aria-label="Voltar ao painel principal">
                        <ArrowLeftIcon />
                    </button>
                    <div className="text-center mt-6">
                        <TrophyIcon className="mx-auto" style={{width: '4rem', height: '4rem', color: 'var(--accent-yellow)'}}/>
                        <h1 className="text-4xl font-bold mt-4">Suas Conquistas</h1>
                        <p className="text-lg mt-2" style={{color: 'var(--text-secondary)'}}>Celebre seu progresso e visualize sua jornada.</p>
                    </div>
                </div>
            </header>
            <main>
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-center mb-6">Suas Medalhas por Área</h2>
                    <div className="grid md-grid-cols-2 gap-6">
                        {Object.entries(healthAreas).map(([key, area]) => (
                            <div key={key} className="card reward-area-card" style={{'--area-color': `var(--accent-${area.color.split('-')[1]}-500)`} as React.CSSProperties}>
                                <div className="card-content">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="reward-area-icon-wrapper">
                                                <area.icon className="reward-area-icon"/>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{area.name}</h3>
                                                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>
                                                    {userData.medals[key] ? Object.keys(userData.medals[key]).length : 0} medalhas
                                                </p>
                                            </div>
                                        </div>
                                        <button onClick={() => onOpenCalendar(key)} className="btn btn-ghost" aria-label={`Ver calendário de ${area.name}`}>
                                            <CalendarIcon />
                                        </button>
                                    </div>
                                    {renderActivityCalendar(key)}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-center mb-6">Troféus por Medalhas Totais</h2>
                    <div className="grid md-grid-cols-3 gap-6">
                        {medalTrophies.map(trophy => (
                             <div key={trophy.level} className={`card trophy-card ${trophy.unlocked ? 'trophy-unlocked' : ''}`} style={{'--trophy-color': trophy.color} as React.CSSProperties}>
                                <div className="card-content text-center">
                                    <TrophyIcon className="trophy-icon" />
                                    <h3 className="font-bold">Medalhista de {trophy.level}</h3>
                                    <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{trophy.threshold} Medalhas</p>
                                    {trophy.unlocked 
                                        ? <span className="trophy-status-unlocked">Conquistado!</span>
                                        : <ProgressBar percentage={(totalMedals / trophy.threshold) * 100} className="mt-2" color={trophy.color} />
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-center mb-6">Troféus por Sequência de Dias</h2>
                    <div className="grid md-grid-cols-3 gap-6">
                        {streakTrophies.map(trophy => (
                             <div key={trophy.level} className={`card trophy-card ${trophy.unlocked ? 'trophy-unlocked' : ''}`} style={{'--trophy-color': trophy.color} as React.CSSProperties}>
                                <div className="card-content text-center">
                                    <TrophyIcon className="trophy-icon" />
                                    <h3 className="font-bold">Sequência de {trophy.level}</h3>
                                    <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{trophy.threshold} Dias Consecutivos</p>
                                    {trophy.unlocked
                                        ? <span className="trophy-status-unlocked">Conquistado!</span>
                                        : <ProgressBar percentage={(maxStreak / trophy.threshold) * 100} className="mt-2" color={trophy.color} />
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <ProgressChart userData={userData} />
            </main>
        </div>
    );
};

const ProgressChart = ({ userData }: any) => {
    const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
    const chartData = useMemo(() => {
        const data: { [key: string]: { [key: string]: number } } = {};
        const today = new Date();
        const days = timeframe === 'week' ? 7 : 30;

        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            data[dateString] = {};
            for (const areaKey in healthAreas) {
                data[dateString][areaKey] = 0;
            }
        }
        
        if(userData.medals) {
            for (const areaKey in userData.medals) {
                for (const dateStr in userData.medals[areaKey]) {
                    const medalDate = new Date(dateStr);
                    const diffDays = Math.floor((today.getTime() - medalDate.getTime()) / (1000 * 3600 * 24));
                    if (diffDays < days) {
                        const formattedDate = medalDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                        if(data[formattedDate]) {
                           data[formattedDate][areaKey] = 1;
                        }
                    }
                }
            }
        }

        return Object.entries(data).reverse().map(([label, values]) => ({ label, values }));

    }, [timeframe, userData.medals]);

    const Chart = () => {
        const [tooltip, setTooltip] = useState<any>(null);
        const svgRef = useRef(null);

        const width = 800;
        const height = 400;
        const margin = { top: 20, right: 20, bottom: 40, left: 40 };

        const xScale = (index: number) => margin.left + (index * (width - margin.left - margin.right)) / (chartData.length - 1);
        const yScale = (value: number) => height - margin.bottom - value * (height - margin.top - margin.bottom);

        const areaKeys = Object.keys(healthAreas);

        return (
            <div className="chart-wrapper">
                <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="chart-svg">
                    {/* Y-axis grid lines */}
                    {Array.from({ length: 9 }).map((_, i) => (
                        <line
                            key={`grid-${i}`}
                            className="grid-line"
                            x1={margin.left}
                            x2={width - margin.right}
                            y1={yScale(i)}
                            y2={yScale(i)}
                        />
                    ))}

                    {/* Bars */}
                    {chartData.map((d, i) => {
                        let yOffset = 0;
                        return (
                            <g key={d.label} onMouseMove={(e) => {
                                const total = Object.values(d.values).reduce((s: number, v: number) => s + v, 0);
                                if (total > 0) {
                                  const svgRect = (svgRef.current as any).getBoundingClientRect();
                                  setTooltip({ x: e.clientX - svgRect.left, y: e.clientY - svgRect.top, label: d.label, values: d.values });
                                }
                            }} onMouseLeave={() => setTooltip(null)}>
                                {areaKeys.map(key => {
                                    const value = d.values[key];
                                    if (value === 0) return null;
                                    const barHeight = (height - margin.top - margin.bottom) / Object.keys(healthAreas).length;
                                    const y = yScale(yOffset + value);
                                    yOffset += value;
                                    const area = healthAreas[key as keyof typeof healthAreas];
                                    const color = `var(--accent-${area.color.split('-')[1]}-500)`;
                                    return (
                                        <rect
                                            key={key}
                                            className="chart-bar"
                                            x={xScale(i) - 10}
                                            y={y - barHeight + 1}
                                            width={20}
                                            height={barHeight - 2}
                                            fill={color}
                                            rx="2"
                                        />
                                    );
                                })}
                            </g>
                        );
                    })}
                     {/* X-axis labels */}
                    {chartData.map((d, i) => (
                       i % Math.floor(chartData.length / 10) === 0 && (
                        <text key={`label-${i}`} className="axis-label" x={xScale(i)} y={height - 15}>
                            {d.label}
                        </text>
                       )
                    ))}
                    {/* Tooltip */}
                    {tooltip && (
                        <g transform={`translate(${tooltip.x + 10}, ${tooltip.y - 60})`}>
                            <rect className="chart-tooltip-bg" width="150" height="130" rx="5" />
                            <text className="chart-tooltip-text" x="10" y="20" fontWeight="bold">{tooltip.label}</text>
                            {/* FIX: Cast value to number to allow comparison */}
                            {Object.entries(tooltip.values).filter(([, value]) => (value as number) > 0).map(([key, value], i) => (
                                <text key={key} className="chart-tooltip-text" x="10" y={40 + i * 18}>
                                    - {healthAreas[key as keyof typeof healthAreas].name}
                                </text>
                            ))}
                        </g>
                    )}
                </svg>
            </div>
        );
    };

    return (
        <section>
            <div className="card">
                <div className="card-content">
                    <div className="chart-header">
                        <h2 className="text-2xl font-bold">Gráfico de Progresso</h2>
                        <div className="timeframe-toggle">
                            <button onClick={() => setTimeframe('week')} className={`toggle-btn ${timeframe === 'week' ? 'active' : ''}`}>7 Dias</button>
                            <button onClick={() => setTimeframe('month')} className={`toggle-btn ${timeframe === 'month' ? 'active' : ''}`}>30 Dias</button>
                        </div>
                    </div>
                    <div className="progress-chart-container">
                        <Chart />
                    </div>
                     <div className="chart-legend">
                        {Object.entries(healthAreas).map(([key, area]) => (
                            <div key={key} className="legend-item">
                                <div className="legend-color-box" style={{backgroundColor: `var(--accent-${area.color.split('-')[1]}-500)`}}></div>
                                <span>{area.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

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

const AlarmsModal = ({ isOpen, onClose, userData, clearAlarm }: any) => {
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

const CalendarModal = ({ isOpen, onClose, areaKey, userData }: any) => {
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

const RecurrenceModal = ({ isOpen, onClose, task, onSave, currentRule }: any) => {
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

const FeatureSuggestionModal = ({ isOpen, onClose, onSubmit }: any) => {
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

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY }), []);
  
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
    const savedData = localStorage.getItem('pequenosPassosData');
    let data;
    if (savedData) {
      data = JSON.parse(savedData);
    } else {
      // Estrutura de dados inicial para novos usuários
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
                // FIX: Cast options to 'any' to allow for the non-standard 'showTrigger' property.
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