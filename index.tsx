

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

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
const CompassIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>);
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
const CalendarDaysIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>);
const StretchingIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><circle cx="12" cy="5" r="1"/><path d="M9.5 14l-3 4.5"/><path d="M14.5 14l3 4.5"/><path d="M14.5 9.5 12 12l-2.5-2.5"/><path d="m18 12-2.5 2.5"/><path d="M6 12l2.5 2.5"/><path d="M12 12v10"/></svg>);
const RepeatIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M17 2.1l4 4-4 4"/><path d="M3 12.6A9 9 0 0 1 21 12h-4a5 5 0 0 0-9.43 2.25"/><path d="M7 21.9l-4-4 4-4"/><path d="M21 11.4A9 9 0 0 1 3 12h4a5 5 0 0 0 9.43-2.25"/></svg>);
const LightbulbIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>);
const ClockIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const ChevronUpIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg>);
const ChevronDownIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>);

// Focus Music Icons
const PlayIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>);
const PauseIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>);
const Volume2Icon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>);
const VolumeXIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>);
const WavesIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M2 6c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.5 0 2.5 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.5 0 2.5 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.5 0 2.5 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>);
const CloudRainIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M16 13v8"/><path d="M12 13v8"/><path d="M8 13v8"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>);
const TreePineIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="m12 14-4 4"/><path d="m16 14 4 4"/><path d="M12 22V10"/><path d="m15 11-3-3-3 3"/><path d="M17 9.5 12 5 7 9.5"/><path d="M20 19.5a2.5 2.5 0 0 1-5 0"/><path d="M4 19.5a2.5 2.5 0 0 0 5 0"/></svg>);
const MusicIcon = ({ className = '', ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} {...props} aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>);

// --- Navigation Component ---
const BottomNavBar = ({ activeView, onViewChange }) => {
    const navItems = [
        { id: 'dashboard', label: 'Início', icon: FootprintsIcon },
        { id: 'planner', label: 'Plano', icon: CalendarDaysIcon },
        { id: 'progress', label: 'Progresso', icon: TrendingUpIcon },
        { id: 'rewards', label: 'Prêmios', icon: AwardIcon },
    ];

    return (
        <nav className="bottom-nav-bar">
            {navItems.map(({ id, label, icon: Icon }) => (
                <button
                    key={id}
                    className={`nav-item ${activeView === id ? 'active' : ''}`}
                    onClick={() => onViewChange(id)}
                    aria-label={label}
                >
                    <Icon className="icon" />
                    <span className="nav-label">{label}</span>
                </button>
            ))}
        </nav>
    );
};


// --- App Configuration ---
const healthAreas = {
  physical: { name: 'Saúde Física', icon: DumbbellIcon, color: 'var(--accent-green-500)' },
  mental: { name: 'Saúde Mental', icon: BrainIcon, color: 'var(--accent-blue-500)' },
  financial: { name: 'Saúde Financeira', icon: PiggyBankIcon, color: 'var(--accent-yellow-500)' },
  family: { name: 'Saúde Familiar', icon: HeartIcon, color: 'var(--accent-red-500)' },
  professional: { name: 'Saúde Profissional', icon: BriefcaseIcon, color: 'var(--accent-purple-500)' },
  social: { name: 'Saúde Social', icon: UsersIcon, color: 'var(--accent-indigo-500)' },
  spiritual: { name: 'Saúde Espiritual', icon: CompassIcon, color: 'var(--accent-teal-500)' },
};

const bookInspiredTasks: Record<keyof typeof healthAreas, string[]> = {
    physical: [
        "Expor-se a 10 minutos de luz solar da manhã logo ao acordar.",
        "Agendar o relaxamento como uma reunião importante (10 min de respiração ou caminhada).",
        "Fazer uma rotina de exercícios de força 2-3 vezes na semana.",
        "Verificar seus níveis de Vitamina D ou tomar sol por 15 minutos com segurança.",
    ],
    mental: [
        "Praticar a 'Pausa de Um Minuto' para observar a respiração.",
        "Fazer uma caminhada leve de 15 minutos, especialmente após uma noite mal dormida.",
        "Identificar uma emoção difícil e perguntar: 'Minha resposta está sob meu controle?'",
        "Praticar autocompaixão após cometer um erro, dizendo a si mesmo 'sofrer é parte de ser humano'.",
    ],
    financial: [
        "Registrar todos os seus gastos por uma semana, sem julgamento, apenas observando.",
        "Automatizar a transferência de um pequeno valor (ex: R$ 50) para sua reserva de emergência.",
        "Ler um artigo ou assistir a um vídeo sobre um tipo de investimento para iniciantes.",
        "Revisar seu orçamento usando a regra 50-15-35 como um guia.",
    ],
    family: [
        "Escolher uma das 5 linguagens do amor (Toque, Elogio, Atenção, Mimos, Obrigações) e praticá-la intencionalmente.",
        "Na próxima conversa difícil, ouvir para entender, em vez de para responder.",
        "Surpreender um familiar com um pequeno gesto, como preparar um café ou deixar um bilhete.",
        "Desligar o celular e dar atenção total durante uma conversa com um ente querido.",
    ],
    professional: [
        "Refletir sobre as quatro perguntas do Ikigai: O que você ama? No que você é bom? Do que o mundo precisa? Pelo que você pode ser pago?",
        "Dedicar 20 minutos para 'prática deliberada' de uma nova habilidade profissional.",
        "Fazer uma 'auditoria de energia' semanal, revisando os sete territórios da sua vida.",
        "Criar um ritual de 'desligar' ao final do dia de trabalho, como uma caminhada ou guardar o laptop.",
    ],
    social: [
        "Enviar uma mensagem significativa para alguém da sua 'Tribo Íntima' (3 a 5 pessoas mais próximas).",
        "Compartilhar algo um pouco mais pessoal (um desafio ou sentimento real) com um amigo de confiança.",
        "Juntar-se a um curso, clube do livro ou grupo de corrida sobre algo que você ama.",
        "Fazer uma 'primeira micro-interação': um elogio sincero ou uma pergunta sobre um interesse em comum a alguém novo.",
    ],
    spiritual: [
        "Reservar 5 minutos para meditação, focando apenas na sua respiração.",
        "Antes de dormir, anotar uma coisa pela qual você foi genuinamente grato hoje.",
        "Buscar admiração ('awe'): caminhar na natureza, olhar para as estrelas ou ouvir uma música emocionante.",
        "Envolver-se em um pequeno ato de serviço para sua comunidade.",
    ],
};

const trophies = {
  'streak-7': { name: 'Sequência de 7 Dias', description: 'Complete ao menos uma tarefa por 7 dias seguidos.', icon: FlameIcon, color: 'var(--trophy-bronze)' },
  'streak-30': { name: 'Mestre da Consistência', description: 'Complete ao menos uma tarefa por 30 dias seguidos.', icon: FlameIcon, color: 'var(--trophy-silver)' },
  'tasks-100': { name: 'Centurião de Tarefas', description: 'Complete 100 tarefas no total.', icon: ShieldIcon, color: 'var(--trophy-bronze)' },
  'tasks-500': { name: 'Lenda Produtiva', description: 'Complete 500 tarefas no total.', icon: ShieldIcon, color: 'var(--trophy-gold)' },
  'perfect-week': { name: 'Semana Perfeita', description: 'Complete todas as tarefas de uma semana.', icon: CheckCircle2Icon, color: 'var(--trophy-silver)' },
  'area-master': { name: 'Mestre de Área', description: 'Complete 50 tarefas em uma única área.', icon: AwardIcon, color: 'var(--trophy-gold)' },
};

const focusMusicTracks = [
  { id: 'lofi', name: 'Lofi Beats', icon: MusicIcon, url: 'https://storage.googleapis.com/pequenos-passos-bucket/lofi-study-112191.mp3' },
  { id: 'rain', name: 'Chuva Relaxante', icon: CloudRainIcon, url: 'https://storage.googleapis.com/pequenos-passos-bucket/rain-and-thunder-166243.mp3' },
  { id: 'forest', name: 'Sons da Floresta', icon: TreePineIcon, url: 'https://storage.googleapis.com/pequenos-passos-bucket/forest-with-small-river-birds-and-nature-field-recording-141893.mp3' },
  { id: 'waves', name: 'Ondas do Mar', icon: WavesIcon, url: 'https://storage.googleapis.com/pequenos-passos-bucket/waves-and-sand-84522.mp3' },
];

const stretchingExercises = [
    { id: 1, name: 'Alongamento de Pescoço', description: 'Incline a cabeça para cada lado, segurando por 30 segundos. Ajuda a aliviar a tensão nos ombros.', duration: 60 },
    { id: 2, name: 'Alongamento de Ombros', description: 'Cruze um braço sobre o peito e puxe suavemente com o outro. Repita para o outro lado.', duration: 60 },
    { id: 3, name: 'Alongamento de Gato-Vaca', description: 'Em quatro apoios, arqueie e curve as costas lentamente. Ótimo para a mobilidade da coluna.', duration: 90 },
    { id: 4, name: 'Alongamento de Isquiotibiais', description: 'Sentado, estique uma perna e tente alcançar o pé. Mantenha as costas retas.', duration: 120 },
    { id: 5, name: 'Alongamento de Quadril', description: 'Em uma posição de afundo, incline-se para a frente para sentir o alongamento no flexor do quadril.', duration: 120 },
    { id: 6, name: 'Torção de Coluna Deitado', description: 'Deitado de costas, traga um joelho em direção ao peito e, em seguida, cruze-o sobre o corpo.', duration: 90 },
];

type Task = {
  id: string;
  text: string;
  areaId: keyof typeof healthAreas;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  isGoal?: boolean;
  dueDate?: string;
  recurrence?: string; // 'none', 'daily', 'weekly', 'weekdays'
  alarmTime?: string; // 'HH:MM'
  timeout?: number; // minutes
};

type WeeklyGoal = {
    area: keyof typeof healthAreas;
    goal: string;
};

type PendingFeature = {
    title: string;
    description: string;
}

type RunLog = {
    id: string;
    date: string;
    distance: number;
    time: number; // in seconds
    pace: string; // MM:SS per km
};

type PlayerState = {
    isPlaying: boolean;
    currentTrackIndex: number | null;
    volume: number;
};

const App: React.FC = () => {
    // State management
    const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
    const [view, setView] = useLocalStorage<'dashboard' | 'tasks' | 'rewards' | 'progress' | 'planner'>('view', 'dashboard');
    const [currentArea, setCurrentArea] = useLocalStorage<keyof typeof healthAreas | null>('currentArea', null);
    const [weeklyGoals, setWeeklyGoals] = useLocalStorage<WeeklyGoal[]>('weeklyGoals', []);
    const [pendingFeatures, setPendingFeatures] = useLocalStorage<PendingFeature[]>('pendingFeatures', []);
    const [runLogs, setRunLogs] = useLocalStorage<RunLog[]>('runLogs', []);
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [modalData, setModalData] = useState<any>(null);

    // Derived state
    const stats = useMemo(() => {
        const completedTasks = tasks.filter(t => t.completed);
        const totalCompleted = completedTasks.length;
        const today = new Date().toISOString().split('T')[0];
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
                            // The 'showTrigger' property is not a standard part of NotificationOptions and causes a TypeScript error.
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
            case 'dashboard':
            default:
                return <Dashboard
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
                          'Modal'
                        }
                      >
                        {activeModal === 'alarms' && <AlarmListModal tasks={tasks} onClose={closeModal} />}
                        {activeModal === 'recurrence' && <RecurrenceModal task={modalData} onSave={(settings) => { updateTaskSettings(modalData.id, settings); closeModal(); }} onClose={closeModal} />}
                        {activeModal === 'voice' && <VoiceCommandModal onCommand={handleVoiceCommand} onClose={closeModal} isProcessing={isAILoading} error={aiError} />}
                        {activeModal === 'datepicker' && <DatePickerModal currentDate={modalData.currentDate} onDateSelect={(date) => { modalData.onDateSelect(date); closeModal(); }} onClose={closeModal} />}

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


// --- VIEWS ---

const Dashboard = ({ stats, onViewChange, weeklyGoals, pendingFeatures, onShowModal }) => (
    <div className="view-container">
        <header className="dashboard-hero text-center">
            <h1>Pequenos Passos</h1>
            <p>Sua Jornada para uma Vida Extraordinária.</p>
        </header>
        
        {/* Main call to action: Health Areas */}
        <div className="main-areas-wrapper">
            <h2 className="section-title">Por onde começar?</h2>
            <div className="areas-grid">
                {Object.entries(healthAreas).map(([id, { name, icon: Icon, color }]) => (
                    <div
                        key={id}
                        className="card area-card text-center"
                        onClick={() => onViewChange('tasks', id as keyof typeof healthAreas)}
                        style={{ '--area-color': color } as React.CSSProperties}
                    >
                        <div className="card-content">
                            <div className="area-card-icon-wrapper">
                                <Icon className="icon" />
                            </div>
                            <h3>{name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Stats grid, now separate */}
        <div className="stats-grid">
            <div className="card stat-card-clickable" onClick={() => onViewChange('rewards')}>
                <div className="stat-card-content">
                    <FlameIcon className="icon" style={{ color: 'var(--accent-orange)'}}/>
                    <div>
                        <div className="stat-value">{stats.streak}</div>
                        <div className="stat-label">Dias em sequência</div>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="stat-card-content">
                    <TrophyIcon className="icon" style={{ color: 'var(--accent-yellow)'}}/>
                    <div>
                        <div className="stat-value">{stats.totalCompleted}</div>
                        <div className="stat-label">Tarefas concluídas</div>
                    </div>
                </div>
            </div>
             <div className="card">
                <div className="stat-card-content">
                   <CheckCircle2Icon className="icon" style={{ color: 'var(--accent-green-500)'}}/>
                   <div>
                        <div className="stat-value">{stats.weeklyCompleted}</div>
                        <div className="stat-label">Concluídas na semana</div>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="stat-card-content">
                   <TargetIcon className="icon" style={{ color: 'var(--accent-blue-500)'}}/>
                   <div>
                        <div className="stat-value">{stats.totalGoals}</div>
                        <div className="stat-label">Metas semanais</div>
                    </div>
                </div>
            </div>
        </div>

        <h2 className="section-title">Suas Metas da Semana</h2>
        {weeklyGoals.length > 0 ? (
            <div className="weekly-goals-grid">
                {weeklyGoals.map((goal, index) => {
                    const Icon = healthAreas[goal.area]?.icon;
                    return (
                        <div key={index} className="card goal-card" style={{ '--area-color': healthAreas[goal.area]?.color || 'var(--primary)' } as React.CSSProperties} onClick={() => onViewChange('tasks', goal.area)}>
                            <div className="card-content">
                                <div className="goal-card-header">
                                    {Icon && <Icon className="icon" />}
                                    <h3>{healthAreas[goal.area]?.name || 'Meta'}</h3>
                                </div>
                                <p className="goal-card-text">{goal.goal}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        ) : (
            <div className="no-goals-card card">
                <TargetIcon className="icon" />
                <p>Nenhuma meta semanal definida ainda. Que tal usar a varinha mágica para gerar algumas ideias personalizadas?</p>
            </div>
        )}

        <h2 className="section-title">Novidades no Horizonte</h2>
        {pendingFeatures.length > 0 ? (
             <div className="pending-features-grid">
                {pendingFeatures.map((feature, index) => (
                    <div key={index} className="card feature-card">
                         <div className="card-content">
                            <div className="feature-card-header">
                                <LightbulbIcon className="icon" />
                                <h3>{feature.title}</h3>
                            </div>
                            <p className="feature-card-text">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
             <div className="no-features-card card">
                <LightbulbIcon className="icon" />
                <p>Nenhuma novidade planejada no momento. Use o poder da IA para sugerir a próxima grande funcionalidade do app!</p>
            </div>
        )}

        <div className="dashboard-actions">
            <button className="btn btn-primary" onClick={() => onViewChange('rewards')}>
                <AwardIcon className="icon-left" />
                Ver Minhas Conquistas
            </button>
            <button className="btn btn-ghost" onClick={() => onViewChange('progress')}>
                 <TrendingUpIcon className="icon-left" />
                Ver Meu Progresso
            </button>
            <button className="btn btn-ghost" onClick={() => onViewChange('planner')}>
                 <CalendarDaysIcon className="icon-left" />
                Planejador Semanal
            </button>
        </div>
    </div>
);

const TasksView = ({ tasks, currentArea, onAddTask, onToggleTask, onEditTask, onDeleteTask, onUpdateTaskSettings, onBack, onShowModal, runLogs, onAddRunLog }) => {
    const area = currentArea ? healthAreas[currentArea] : null;
    const areaColor = area?.color || 'var(--primary)';
    const AreaIcon = currentArea ? healthAreas[currentArea]?.icon : null;
    
    const today = new Date();
    const [viewDate, setViewDate] = useState(today);

    const filteredTasks = useMemo(() => {
        let tasksForDate = tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate + 'T00:00:00'); // Ensure local timezone
            return taskDate.toDateString() === viewDate.toDateString();
        });

        if (currentArea) {
            tasksForDate = tasksForDate.filter(task => task.areaId === currentArea);
        }
        return tasksForDate;
    }, [tasks, viewDate, currentArea]);

    const changeDate = (amount: number) => {
        setViewDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + amount);
            return newDate;
        });
    };
    
    const [activeTab, setActiveTab] = useState('tasks');
    const isSpecialArea = ['physical', 'mental'].includes(currentArea || '');

    useEffect(() => {
        if (!isSpecialArea) {
            setActiveTab('tasks');
        }
    }, [currentArea, isSpecialArea]);

    const weeklyProgress = useMemo(() => {
        if (!currentArea) return { completed: 0, total: 0 };
        const startOfWeek = getStartOfWeek(new Date());
        const endOfWeek = getEndOfWeek(new Date());

        const weeklyTasks = tasks.filter(t =>
            t.areaId === currentArea &&
            new Date(t.createdAt) >= startOfWeek &&
            new Date(t.createdAt) <= endOfWeek
        );
        const completed = weeklyTasks.filter(t => t.completed).length;
        return { completed, total: weeklyTasks.length };
    }, [tasks, currentArea]);

    return (
        <div className="view-container">
            <header className="view-header">
               <div className="view-header-content">
                 <button className="btn btn-ghost" onClick={onBack} aria-label="Voltar para o dashboard">
                    <ArrowLeftIcon className="icon" />
                 </button>
                 <div className="flex items-center gap-4 mt-4">
                     <div className="task-header-icon-wrapper" style={{ backgroundColor: areaColor }}>
                         {AreaIcon ?
                             <AreaIcon className="icon" style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} /> :
                             <UsersIcon className="icon" style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
                         }
                     </div>
                     <div>
                         <h1 className="text-3xl font-bold">{area ? area.name : 'Todas as Tarefas'}</h1>
                         <p className="text-lg text-secondary">{area ? `Gerencie seus ${area.name.toLowerCase()}` : 'Veja todas as suas atividades'}</p>
                     </div>
                 </div>
               </div>
            </header>
            
            {currentArea && (
                <div className="card weekly-progress-card" style={{ '--area-color': areaColor } as React.CSSProperties}>
                    <div className="card-content">
                       <div className="weekly-progress-header">
                            <div className="weekly-progress-icon-wrapper">
                                {AreaIcon && <AreaIcon className="weekly-progress-icon" />}
                            </div>
                            <div>
                                <h3 className="weekly-progress-title">Progresso da Meta Semanal</h3>
                                <p className="weekly-progress-area-name">{healthAreas[currentArea].name}</p>
                            </div>
                        </div>
                        <div className="weekly-progress-body">
                            <div className="weekly-progress-dots">
                                {Array.from({ length: 7 }).map((_, i) => (
                                    <div key={i} className={`progress-dot ${i < weeklyProgress.completed ? 'filled' : ''}`}></div>
                                ))}
                            </div>
                            <p className="weekly-progress-text">{weeklyProgress.completed} de 7 dias de atividade nesta semana</p>
                        </div>
                        <button className="btn weekly-progress-button">
                            Ver Relatório de Progresso
                        </button>
                    </div>
                </div>
            )}
            
            <div className="tabs">
                 <div className="tabs-list">
                    <button className="tab-trigger" role="tab" aria-selected={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')}>Tarefas</button>
                    {currentArea === 'physical' && (
                        <>
                            <button className="tab-trigger" role="tab" aria-selected={activeTab === 'running'} onClick={() => setActiveTab('running')}>Corrida</button>
                            <button className="tab-trigger" role="tab" aria-selected={activeTab === 'stretching'} onClick={() => setActiveTab('stretching')}>Alongamento</button>
                        </>
                    )}
                    {currentArea === 'mental' && (
                        <button className="tab-trigger" role="tab" aria-selected={activeTab === 'focus'} onClick={() => setActiveTab('focus')}>Música Foco</button>
                    )}
                </div>
            </div>

            {activeTab === 'tasks' &&
                <TaskManagement
                    tasks={filteredTasks}
                    onAddTask={onAddTask}
                    onToggleTask={onToggleTask}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onUpdateTaskSettings={onUpdateTaskSettings}
                    currentArea={currentArea}
                    onShowModal={onShowModal}
                    viewDate={viewDate}
                    onChangeDate={changeDate}
                    onSetDate={setViewDate}
                />
            }
            {activeTab === 'running' && <RunningTab runLogs={runLogs} onAddRunLog={onAddRunLog} />}
            {activeTab === 'stretching' && <StretchingTab />}
            {activeTab === 'focus' && <FocusMusicTab />}
        </div>
    );
};

const TaskInspiration = ({ area, onSelectSuggestion }) => {
    const suggestions = bookInspiredTasks[area] || [];
    if (suggestions.length === 0) return null;

    return (
        <div className="task-inspiration">
            <h3 className="inspiration-title"><LightbulbIcon className="icon-left" /> Ideias do Livro</h3>
            <div className="inspiration-scroll">
                {suggestions.map((text, index) => (
                    <button key={index} className="inspiration-card" onClick={() => onSelectSuggestion(text)}>
                        <p>{text}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

const TaskManagement = ({ tasks, onAddTask, onToggleTask, onEditTask, onDeleteTask, onUpdateTaskSettings, currentArea, onShowModal, viewDate, onChangeDate, onSetDate }) => {
    const [newTaskText, setNewTaskText] = useState('');
    
    const handleAddTask = () => {
        if (newTaskText.trim()) {
            onAddTask({
                text: newTaskText,
                areaId: currentArea || 'social',
                dueDate: viewDate.toISOString().split('T')[0]
            });
            setNewTaskText('');
        }
    };
    
    const today = new Date();
    const isToday = viewDate.toDateString() === today.toDateString();
    
    const formatDate = (date: Date) => {
        if(date.toDateString() === today.toDateString()) return "Hoje";
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        if(date.toDateString() === tomorrow.toDateString()) return "Amanhã";
        return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric' });
    }

    return (
        <>
            {currentArea && <TaskInspiration area={currentArea} onSelectSuggestion={setNewTaskText} />}
            <div className="card">
                <div className="card-content">
                    <div className="card-header-with-nav">
                        <h2 className="text-xl font-bold">Tarefas para {formatDate(viewDate)}</h2>
                         <div className="date-navigator">
                            <button onClick={() => onChangeDate(-1)} className="btn icon-btn btn-ghost" aria-label="Dia anterior"><ArrowLeftIcon /></button>
                            <span 
                                className={`current-date-display ${!isToday ? 'clickable' : ''}`}
                                onClick={() => !isToday && onSetDate(today)}
                                aria-label="Voltar para hoje"
                            >
                                {viewDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                            </span>
                            <button onClick={() => onChangeDate(1)} className="btn icon-btn btn-ghost" aria-label="Próximo dia"><ArrowRightIcon /></button>
                            <button onClick={() => onShowModal('datepicker', { currentDate: viewDate, onDateSelect: onSetDate })} className="btn icon-btn btn-ghost" aria-label="Selecionar data"><CalendarIcon /></button>
                        </div>
                    </div>

                    <div className="tab-content">
                        {tasks.length > 0 ? tasks.map(task =>
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggle={onToggleTask}
                                onEdit={onEditTask}
                                onDelete={onDeleteTask}
                                onUpdateSettings={onUpdateTaskSettings}
                                onShowModal={onShowModal}
                            />) :
                            <p className="text-secondary text-center py-8">Nenhuma tarefa para este dia. Adicione uma abaixo!</p>
                        }
                    </div>

                    <div className="mt-6 flex gap-2">
                        <input
                            type="text"
                            className="input flex-1"
                            placeholder="Adicionar um pequeno passo..."
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                        />
                        <button onClick={handleAddTask} className="btn btn-primary" aria-label="Adicionar tarefa">
                            <PlusIcon className="icon" />
                        </button>
                        <button onClick={() => onShowModal('alarms')} className="btn btn-ghost icon-btn" aria-label="Ver alarmes">
                             <BellIcon className="icon" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

const TaskItem = ({ task, onToggle, onEdit, onDelete, onUpdateSettings, onShowModal }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);
    const [isDisappearing, setIsDisappearing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleToggle = () => {
        if (!task.completed) {
            setIsDisappearing(true);
            setTimeout(() => {
                onToggle(task.id, true);
                setIsDisappearing(false);
            }, 1000); // Match animation duration
        } else {
            onToggle(task.id, false);
        }
    };
    
    const handleEdit = () => {
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleSave = () => {
        if (editText.trim()) {
            onEdit(task.id, editText);
        }
        setIsEditing(false);
    };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
    
    const [timeLeft, setTimeLeft] = useState(task.timeout ? task.timeout * 60 : 0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isTimerRunning && timeLeft > 0) {
            timerRef.current = window.setTimeout(() => {
                setTimeLeft(t => t - 1);
            }, 1000);
        } else if (timeLeft === 0 && isTimerRunning) {
            setIsTimerRunning(false);
            handleToggle(); // Auto-complete task when timer ends
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isTimerRunning, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className={`task-item ${task.completed ? 'completed' : ''} ${isDisappearing ? 'disappearing' : ''}`}>
            <div
              role={task.completed ? undefined : 'button'}
              aria-label={`Marcar ${task.text} como ${task.completed ? 'não concluída' : 'concluída'}`}
              tabIndex={task.completed ? -1 : 0}
              onClick={task.completed ? undefined : handleToggle}
              onKeyPress={(e) => !task.completed && (e.key === 'Enter' || e.key === ' ') && handleToggle()}
              className="task-item-toggle"
             >
                {task.completed ? <CheckCircle2Icon className="icon text-primary icon-check" /> : <CircleIcon className="icon text-secondary" />}
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={handleSave}
                        onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                        className="task-edit-input"
                    />
                ) : (
                    <span className="task-text">{task.text}</span>
                )}
            </div>

            <div className="task-item-actions">
                {task.dueDate && <DueDateDisplay dueDate={task.dueDate} overdue={isOverdue} />}
                 {task.recurrence && task.recurrence !== 'none' && <RepeatIcon className="recurrence-indicator" title={`Recorrência: ${task.recurrence}`} />}
                {task.alarmTime && <BellIcon className="task-alarm-indicator" title={`Alarme às ${task.alarmTime}`} />}
                {isTimerRunning && <div className="timer-display-badge"><ClockIcon className="icon" /> {formatTime(timeLeft)}</div>}

                {!task.completed && (
                    <>
                        {task.timeout && !isTimerRunning &&
                            <button onClick={() => setIsTimerRunning(true)} className="btn btn-sm btn-ghost">
                                <PlayIcon className="icon-left h-4 w-4" /> Iniciar
                            </button>
                        }
                        {isTimerRunning &&
                            <button onClick={() => setIsTimerRunning(false)} className="btn btn-sm btn-ghost">
                                <PauseIcon className="icon-left h-4 w-4" /> Pausar
                            </button>
                        }
                        <button onClick={handleEdit} className="btn icon-btn btn-ghost btn-sm" aria-label="Editar tarefa"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></button>
                        <button onClick={() => onShowModal('recurrence', task)} className="btn icon-btn btn-ghost btn-sm" aria-label="Configurar recorrência"><RepeatIcon className="h-4 w-4" /></button>
                        <button onClick={() => onDelete(task.id)} className="btn icon-btn btn-ghost btn-sm" aria-label="Deletar tarefa"><XIcon className="h-4 w-4" /></button>
                    </>
                )}
            </div>
        </div>
    );
};

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

const RunningTab = ({ runLogs, onAddRunLog }) => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [distance, setDistance] = useState('');
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isRunning) {
            timerRef.current = window.setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning]);

    const handleStartStop = () => setIsRunning(!isRunning);

    const handleSave = () => {
        const distKm = parseFloat(distance);
        if (!distKm || distKm <= 0 || time === 0) {
            alert("Por favor, insira uma distância válida e inicie o cronômetro.");
            return;
        }

        const paceSeconds = time / distKm;
        const paceMinutes = Math.floor(paceSeconds / 60);
        const paceRemainingSeconds = Math.round(paceSeconds % 60);
        const pace = `${paceMinutes.toString().padStart(2, '0')}:${paceRemainingSeconds.toString().padStart(2, '0')}`;
        
        onAddRunLog({ date: new Date().toISOString(), distance: distKm, time, pace });
        setTime(0);
        setDistance('');
        setIsRunning(false);
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
         <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
                <div className="card-content text-center">
                    <h3 className="text-xl font-bold mb-4">Registrar Corrida</h3>
                    <div className="stopwatch-container">
                        <div className="stopwatch-display">{formatTime(time)}</div>
                    </div>
                    <div className="flex justify-center gap-4 mb-6">
                        <button onClick={handleStartStop} className={`btn btn-lg ${isRunning ? 'btn-red' : 'btn-green'}`}>
                            {isRunning ? <PauseIcon /> : <PlayIcon />}
                        </button>
                    </div>
                    <div className="run-log-form">
                         <div className="form-group">
                            <label htmlFor="distance" className="form-label text-left">Distância (km)</label>
                            <input
                                id="distance"
                                type="number"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                placeholder="Ex: 5.2"
                                className="input text-center"
                                disabled={isRunning}
                            />
                        </div>
                        <button onClick={handleSave} className="btn btn-primary w-full" disabled={isRunning || time === 0}>
                           <CheckCircle2Icon className="icon-left" /> Salvar Corrida
                        </button>
                    </div>
                </div>
            </div>
             <div className="card">
                <div className="card-content">
                    <h3 className="text-xl font-bold mb-4">Histórico de Corridas</h3>
                    {runLogs.length > 0 ? (
                        <ul className="run-history-list">
                            {runLogs.map(log => (
                                <li key={log.id} className="run-history-item">
                                    <span className="run-item-date">{new Date(log.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric'})}</span>
                                    <div className="run-item-stats">
                                        <span><strong>Distância:</strong> {log.distance.toFixed(2)} km</span>
                                        <span><strong>Tempo:</strong> {formatTime(log.time)}</span>
                                        <span><strong>Pace:</strong> {log.pace} /km</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-secondary text-center py-8">Nenhum registro de corrida ainda. Vamos começar?</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const StretchingTab = () => {
    return (
        <div className="stretching-grid">
            {stretchingExercises.map(exercise => (
                <StretchingExerciseCard key={exercise.id} exercise={exercise} />
            ))}
        </div>
    );
};

const StretchingExerciseCard = ({ exercise }) => {
    const [timeLeft, setTimeLeft] = useState(exercise.duration);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            timerRef.current = window.setTimeout(() => {
                setTimeLeft(t => t - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            setIsRunning(false);
            // Maybe play a sound or show a notification
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isRunning, timeLeft]);

    const handleStartPause = () => setIsRunning(!isRunning);
    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(exercise.duration);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const progress = (exercise.duration - timeLeft) / exercise.duration * 100;

    return (
        <div className="card stretching-card">
            <div className="stretching-img-placeholder">
                <StretchingIcon className="icon" />
                <p>Imagem do exercício aqui</p>
            </div>
            <div className="card-content">
                <h3 className="stretching-card-title">{exercise.name}</h3>
                <p className="stretching-card-description">{exercise.description}</p>
                <div className="stretching-timer">
                    <div className="timer-display-wrapper">
                        <div className="timer-progress" style={{ width: `${progress}%` }}></div>
                        <span className="timer-display">{formatTime(timeLeft)}</span>
                    </div>
                    <div className="timer-controls">
                        <button onClick={handleStartPause} className="btn btn-primary">
                            {isRunning ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                        </button>
                        <button onClick={handleReset} className="btn btn-ghost">
                           <RepeatIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const useServiceWorker = () => {
    // FIX: Explicitly type playerState to avoid inference issues with `currentTrackIndex`.
    // The initial value of `currentTrackIndex` is `null`, but it becomes a `number`
    // after a track is selected, which would cause a type error without this explicit typing.
    const [playerState, setPlayerState] = useState<PlayerState>({
        isPlaying: false,
        currentTrackIndex: null,
        volume: 0.75,
    });
    const isInitialized = useRef(false);

    const postMessage = (message: any) => {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage(message);
        }
    };

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            const handleMessage = (event: MessageEvent) => {
                if (event.data.type === 'STATE_UPDATE') {
                    // FIX: The `event.data` from a MessageEvent is of type `any` (or `unknown` in stricter configs).
                    // This was causing a downstream error where `currentTrackIndex` was treated as `unknown`
                    // and could not be used as an array index (which must be a number).
                    // Casting the payload to the correct `PlayerState` type ensures type safety.
// FIX: Cast event.data.payload to PlayerState to ensure type safety.
                    const payload = event.data.payload as PlayerState;
                    if (payload) {
                        setPlayerState({
                            isPlaying: payload.isPlaying,
                            currentTrackIndex: payload.currentTrackIndex,
                            volume: payload.volume,
                        });
                    }
                }
            };
            navigator.serviceWorker.addEventListener('message', handleMessage);

            navigator.serviceWorker.ready.then(() => {
                if (!isInitialized.current) {
                    postMessage({ type: 'GET_STATUS' });
                    isInitialized.current = true;
                }
            });

            return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
        }
    }, []);

    const controls = useMemo(() => ({
        setTrack: (index: number) => postMessage({ type: 'SET_TRACK', payload: { index, url: focusMusicTracks[index].url } }),
        play: () => postMessage({ type: 'PLAY' }),
        pause: () => postMessage({ type: 'PAUSE' }),
        setVolume: (volume: number) => {
             setPlayerState(s => ({ ...s, volume })); // Optimistic update
             postMessage({ type: 'SET_VOLUME', payload: { volume } });
        },
    }), []);

    return { playerState, controls };
};


const FocusMusicTab = () => {
    const { playerState, controls } = useServiceWorker();
    const { isPlaying, currentTrackIndex, volume } = playerState;

    const handleTrackSelect = (index: number) => {
        if (index === currentTrackIndex) {
            isPlaying ? controls.pause() : controls.play();
        } else {
            controls.setTrack(index);
        }
    };
    
    // FIX: `currentTrackIndex` can be of type `unknown` and cannot be used directly as an array index.
    // A `typeof` check is used to safely narrow the type to `number` before accessing the array.
    // The previous explicit cast `as number` was redundant and has been removed to resolve the type error.
    const currentTrack = typeof currentTrackIndex === 'number' ? focusMusicTracks[currentTrackIndex] : null;

    return (
         <div className="card focus-music-player">
            <div className="card-content">
                <h3 className="card-title text-xl font-bold mb-4">Música para Foco</h3>
                <ul className="music-track-list">
                    {focusMusicTracks.map((track, index) => (
                        <li key={track.id}>
                           <button
                                className={`music-track-item ${currentTrackIndex === index ? 'active' : ''}`}
                                onClick={() => handleTrackSelect(index)}
                            >
                                <track.icon className="icon" />
                                <span>{track.name}</span>
                                {currentTrackIndex === index && isPlaying && <div className="playing-indicator"></div>}
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="music-controls">
                   {currentTrack && (
                       <div className="now-playing">
                           <span>Tocando agora</span>
                           <p>{currentTrack.name}</p>
                       </div>
                   )}
                   <div className="main-controls">
                       <button onClick={controls.pause} className="btn btn-ghost" disabled={!isPlaying}>
                           <PauseIcon className="w-6 h-6" />
                       </button>
                       <button onClick={controls.play} className="btn btn-primary" disabled={isPlaying || currentTrackIndex === null}>
                           <PlayIcon className="w-8 h-8"/>
                       </button>
                       <div className="volume-control">
                            <button onClick={() => controls.setVolume(volume > 0 ? 0 : 0.75)}>
                                {volume === 0 ? <VolumeXIcon /> : <Volume2Icon />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={volume}
                                className="volume-slider"
                                onChange={(e) => controls.setVolume(parseFloat(e.target.value))}
                            />
                       </div>
                   </div>
                </div>
            </div>
        </div>
    );
};

const RewardsView = ({ tasks }) => {
    const completedTasks = useMemo(() => tasks.filter(t => t.completed), [tasks]);

    const unlockedTrophies = useMemo(() => {
        const streak = calculateStreak(completedTasks);
        const unlocked: { [key: string]: number } = {};

        // Streaks
        if (streak >= 7) unlocked['streak-7'] = 1; else unlocked['streak-7'] = streak / 7;
        if (streak >= 30) unlocked['streak-30'] = 1; else unlocked['streak-30'] = streak / 30;

        // Total tasks
        if (completedTasks.length >= 100) unlocked['tasks-100'] = 1; else unlocked['tasks-100'] = completedTasks.length / 100;
        if (completedTasks.length >= 500) unlocked['tasks-500'] = 1; else unlocked['tasks-500'] = completedTasks.length / 500;
        
        // Area master
        const tasksByArea = completedTasks.reduce((acc, task) => {
            acc[task.areaId] = (acc[task.areaId] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });
        const maxAreaCount = Math.max(0, ...Object.values(tasksByArea));
        if (maxAreaCount >= 50) unlocked['area-master'] = 1; else unlocked['area-master'] = maxAreaCount / 50;


        // TODO: Perfect week
        unlocked['perfect-week'] = 0.3; // Placeholder

        return unlocked;
    }, [completedTasks]);

    return (
        <div className="view-container">
            <header className="view-header">
               <div className="view-header-content">
                    <h1 className="text-3xl font-bold">Conquistas</h1>
                    <p className="text-lg text-secondary">Seu Hall da Fama pessoal.</p>
                </div>
            </header>
            
            <section className="mb-12">
                <h2 className="section-title">Medalhas por Território</h2>
                 <div className="grid md-grid-cols-2 lg-grid-cols-3 gap-6">
                    {Object.entries(healthAreas).map(([id, area]) => {
                        const areaTasks = completedTasks.filter(t => t.areaId === id).length;
                        const progress = Math.min(areaTasks / 50, 1);
                        return (
                            <div key={id} className="card text-center reward-area-card" style={{ '--area-color': area.color } as React.CSSProperties}>
                                <div className="card-content">
                                    <div className="reward-area-icon-wrapper">
                                        <area.icon className="reward-area-icon" />
                                    </div>
                                    <h3 className="text-lg font-bold">{area.name}</h3>
                                    <p className="text-sm text-secondary mb-4">{areaTasks} tarefas concluídas</p>
                                    <ProgressBar progress={progress * 100} color={area.color} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
            
             <section className="mb-12">
                <h2 className="section-title">Troféus</h2>
                <div className="grid md-grid-cols-2 lg-grid-cols-3 gap-6">
                     {Object.entries(trophies).map(([id, trophy]) => {
                        const progress = unlockedTrophies[id] || 0;
                        const isUnlocked = progress >= 1;
                        const trophyColor = isUnlocked ? trophy.color : 'var(--border)';

                        return (
                             <div key={id} className={`card text-center trophy-card ${isUnlocked ? 'trophy-unlocked' : ''}`} style={{ '--trophy-color': trophy.color } as React.CSSProperties}>
                                <div className="card-content">
                                    <trophy.icon className="trophy-icon" />
                                    <h3 className={`font-bold text-lg ${isUnlocked ? 'trophy-status-unlocked' : ''}`}>{trophy.name}</h3>
                                    <p className="text-sm text-secondary h-10">{trophy.description}</p>
                                    {!isUnlocked &&
                                        <div className="mt-4 trophy-progress">
                                            <ProgressBar progress={progress * 100} color={trophy.color} />
                                        </div>
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
            
            <section>
                <h2 className="section-title">Calendário de Atividade</h2>
                <div className="card">
                    <div className="card-content">
                        <ActivityCalendar tasks={completedTasks} />
                    </div>
                </div>
            </section>

        </div>
    );
};

const ProgressView = ({ tasks }) => {
    return (
        <div className="view-container">
            <header className="view-header">
               <div className="view-header-content">
                <h1 className="text-3xl font-bold">Meu Progresso</h1>
                <p className="text-lg text-secondary">Visualize sua jornada de crescimento.</p>
                </div>
            </header>
            <div className="card">
                <div className="card-content progress-chart-container">
                    <ProgressChart tasks={tasks} />
                </div>
            </div>
        </div>
    );
};

const PlannerView = ({ tasks, onToggleTask, onShowModal }) => {
    const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()));

    const changeWeek = (amount: number) => {
        setWeekStart(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + (7 * amount));
            return newDate;
        });
    };
    
    const goToToday = () => {
        setWeekStart(getStartOfWeek(new Date()));
    };
    
    const days = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        return day;
    });
    
    const today = new Date();
    const isCurrentWeek = getStartOfWeek(today).getTime() === weekStart.getTime();

    return (
        <div className="view-container planner-container">
             <header className="view-header">
               <div className="view-header-content">
                 <div className="flex items-center gap-4">
                     <div className="task-header-icon-wrapper" style={{ backgroundColor: 'var(--primary)' }}>
                        <CalendarDaysIcon className="icon" style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
                     </div>
                     <div>
                         <h1 className="text-3xl font-bold">Planejador Semanal</h1>
                         <p className="text-lg text-secondary">Planeje seus pequenos passos para a semana.</p>
                     </div>
                 </div>
               </div>
            </header>
            
            <div className="card">
                <div className="card-content">
                    <div className="planner-header">
                        <h2 className="planner-month-year">
                           {weekStart.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        </h2>
                        <div className="planner-nav">
                            <button onClick={() => changeWeek(-1)} className="btn icon-btn btn-ghost" aria-label="Semana anterior"><ArrowLeftIcon /></button>
                            <button onClick={goToToday} className={`btn btn-ghost today-btn ${isCurrentWeek ? 'disabled': ''}`} disabled={isCurrentWeek}>Hoje</button>
                            <button onClick={() => changeWeek(1)} className="btn icon-btn btn-ghost" aria-label="Próxima semana"><ArrowRightIcon /></button>
                        </div>
                    </div>

                    <div className="planner-grid">
                        {days.map(day => {
                            const dateString = day.toISOString().split('T')[0];
                            const tasksForDay = tasks.filter(t => t.dueDate === dateString);
                            const isToday = day.toDateString() === today.toDateString();

                            return (
                                <div key={dateString} className={`planner-day-column ${isToday ? 'is-today' : ''}`}>
                                    <div className="planner-day-header">
                                        <span className="planner-day-name">{day.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0,3)}</span>
                                        <span className="planner-day-date">{day.getDate()}</span>
                                    </div>
                                    <div className="planner-tasks-list">
                                        {tasksForDay.length > 0 ? tasksForDay.map(task => 
                                            <PlannerTaskItem key={task.id} task={task} onToggle={onToggleTask} onShowModal={onShowModal} />
                                        ) : <div className="planner-no-tasks"></div>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PlannerTaskItem = ({ task, onToggle, onShowModal }) => {
    const AreaIcon = healthAreas[task.areaId]?.icon;
    const areaColor = healthAreas[task.areaId]?.color || 'var(--primary)';

    return (
        <div 
            className={`planner-task-item ${task.completed ? 'completed' : ''}`}
            style={{ '--area-color': areaColor } as React.CSSProperties}
            onClick={() => onShowModal('recurrence', task)}
        >
            <div className="planner-task-content">
                <button 
                    className="planner-task-toggle"
                    onClick={(e) => { e.stopPropagation(); onToggle(task.id, !task.completed); }}
                    aria-label={`Marcar ${task.text} como ${task.completed ? 'não concluída' : 'concluída'}`}
                >
                    {task.completed ? <CheckCircle2Icon className="icon icon-check" /> : <CircleIcon className="icon" />}
                </button>
                <span className="planner-task-text">{task.text}</span>
            </div>
        </div>
    );
};

const TodaysTasksHeader = ({ tasks, onToggleTask, onViewChange }) => {
    const [isExpanded, setIsExpanded] = useLocalStorage('todaysTasksExpanded', true);

    const todaysTasks = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        return tasks.filter(task => task.dueDate === todayStr);
    }, [tasks]);

    if (todaysTasks.length === 0) {
        return null;
    }

    const completedTasks = todaysTasks.filter(t => t.completed);
    const incompleteTasks = todaysTasks.filter(t => !t.completed);
    const allCompleted = incompleteTasks.length === 0;
    const progress = todaysTasks.length > 0 ? (completedTasks.length / todaysTasks.length) * 100 : 0;

    const toggleExpansion = (e) => {
        if (e.target.closest('button')) {
            e.stopPropagation();
        }
        setIsExpanded(prev => !prev);
    };
    
    const handleGoToPlanner = () => {
        onViewChange('planner');
    }

    if (!isExpanded) {
        return (
            <div className="todays-tasks-header collapsed" onClick={toggleExpansion} role="button" tabIndex={0} onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && toggleExpansion(e)}>
                <div className="header-content">
                    <CalendarIcon className="icon" />
                    <span className="header-title">Tarefas de Hoje</span>
                    <span className="header-summary">{completedTasks.length}/{todaysTasks.length}</span>
                </div>
                 <div className="header-progress-bar">
                    <div className="header-progress-inner" style={{ width: `${progress}%` }}></div>
                </div>
                <button className="btn icon-btn btn-ghost" aria-label="Expandir tarefas de hoje" onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}>
                    <ChevronDownIcon />
                </button>
            </div>
        );
    }
    
    return (
        <div className="todays-tasks-header expanded">
            <div className="header-content">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="icon" />
                    <span className="header-title">Tarefas de Hoje</span>
                    <span className="header-summary">({completedTasks.length}/{todaysTasks.length} concluídas)</span>
                </div>
                <button onClick={() => setIsExpanded(false)} className="btn icon-btn btn-ghost" aria-label="Recolher tarefas de hoje">
                    <ChevronUpIcon />
                </button>
            </div>
            <div className="tasks-preview-list">
                {allCompleted ? (
                    <div className="all-completed-message">
                        <TrophyIcon className="icon" />
                        <p>Parabéns! Você concluiu todas as suas tarefas de hoje.</p>
                    </div>
                ) : (
                    <>
                        {incompleteTasks.slice(0, 3).map(task => (
                            <div key={task.id} className="preview-task-item">
                                <button 
                                    className="planner-task-toggle"
                                    onClick={() => onToggleTask(task.id, true)}
                                    aria-label={`Marcar ${task.text} como concluída`}
                                >
                                    <CircleIcon className="icon" />
                                </button>
                                <span className="planner-task-text">{task.text}</span>
                            </div>
                        ))}
                        {incompleteTasks.length > 3 && (
                            <button className="btn btn-ghost see-all-btn" onClick={handleGoToPlanner}>
                                Ver mais {incompleteTasks.length - 3} tarefas
                                <ArrowRightIcon className="icon-right" />
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};


// --- MODALS ---
const Modal = ({ isOpen, onClose, title, children }) => {
    const [isClosing, setIsClosing] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);
    
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 300); // match animation duration
    };

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
            <div ref={modalRef} className={`modal-content ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <button onClick={handleClose} className="btn icon-btn btn-ghost" aria-label="Fechar modal"><XIcon /></button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

const AlarmListModal = ({ tasks, onClose }) => {
    const scheduledTasks = tasks.filter(t => t.alarmTime && t.dueDate && !t.completed);
    return (
        <div>
            {scheduledTasks.length > 0 ? (
                <ul className="alarm-list">
                    {scheduledTasks.map(task => (
                        <li key={task.id} className="alarm-list-item">
                            <div>
                                <p className="alarm-item-task">{task.text}</p>
                                <span className="alarm-item-area">{healthAreas[task.areaId]?.name}</span>
                            </div>
                            <div className="alarm-item-controls">
                                <span className="alarm-time-display">{task.alarmTime}</span>
                                <span className="alarm-time-display">{new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-secondary text-center py-8">Nenhum alarme agendado.</p>
            )}
        </div>
    );
};

const RecurrenceModal = ({ task, onSave, onClose }) => {
    const [recurrence, setRecurrence] = useState(task.recurrence || 'none');
    const [dueDate, setDueDate] = useState(task.dueDate || '');
    const [alarmTime, setAlarmTime] = useState(task.alarmTime || '');
    const [timeout, setTimeoutValue] = useState(task.timeout ? String(task.timeout) : '');

    const handleSave = () => {
        onSave({
            recurrence,
            dueDate,
            alarmTime: alarmTime || undefined,
            timeout: timeout ? Number(timeout) : undefined,
        });
    };

    return (
        <div className="space-y-4">
            <p className="modal-task-text">{task.text}</p>
            <div className="form-group">
                <label htmlFor="recurrence" className="form-label">Recorrência</label>
                <select id="recurrence" value={recurrence} onChange={(e) => setRecurrence(e.target.value)} className="select">
                    <option value="none">Nenhuma</option>
                    <option value="daily">Diária</option>
                    <option value="weekly">Semanal</option>
                    <option value="weekdays">Dias de Semana</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="dueDate" className="form-label">Data de Vencimento</label>
                <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input" />
            </div>
             <div className="form-group">
                <label htmlFor="alarmTime" className="form-label">Horário do Alarme</label>
                <input type="time" id="alarmTime" value={alarmTime} onChange={(e) => setAlarmTime(e.target.value)} className="input alarm-input" />
            </div>
            <div className="form-group">
                <label htmlFor="timeout" className="form-label">Temporizador (minutos)</label>
                <input type="number" id="timeout" value={timeout} onChange={(e) => setTimeoutValue(e.target.value)} placeholder="Ex: 25" className="input timeout-input" />
                <p className="form-help-text">Adiciona um cronômetro à tarefa. Deixe em branco para nenhum.</p>
            </div>
            <div className="modal-actions">
                <button onClick={onClose} className="btn btn-ghost">Cancelar</button>
                <button onClick={handleSave} className="btn btn-primary">Salvar</button>
            </div>
        </div>
    );
};

const VoiceCommandModal: React.FC<{ onCommand: (command: string) => void; onClose: () => void; isProcessing: boolean; error: string | null }> = ({ onCommand, onClose, isProcessing, error }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<any>(null);
    const transcriptRef = useRef('');

    useEffect(() => {
        transcriptRef.current = transcript;
    }, [transcript]);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("Seu navegador não suporta a API de Reconhecimento de Voz.");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            const currentTranscript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            setTranscript(currentTranscript);
        };

        recognition.onend = () => {
            setIsListening(false);
            if (transcriptRef.current.trim()) {
                onCommand(transcriptRef.current.trim());
            }
        };
        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [onCommand]);

    const handleListen = () => {
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setTranscript('');
            transcriptRef.current = '';
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    return (
        <div className="voice-modal-body">
            <div className="voice-modal-content-centered">
                {isProcessing ? (
                     <>
                        <SparklesIcon className="icon animate-spin text-primary" style={{ width: '3rem', height: '3rem' }} />
                        <p>Processando seu comando...</p>
                    </>
                ) : (
                    <>
                        <p>{isListening ? 'Ouvindo...' : 'Pressione o microfone para começar'}</p>
                        <button
                            onClick={handleListen}
                            className={`btn btn-lg ${isListening ? 'recording' : 'btn-primary'}`}
                            aria-label={isListening ? 'Parar de ouvir' : 'Começar a ouvir'}
                        >
                            <MicIcon className="icon" />
                        </button>
                        {transcript && <p className="text-sm mt-4"><em>"{transcript}"</em></p>}
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </>
                )}
            </div>
        </div>
    );
};

const DatePickerModal = ({ currentDate, onDateSelect, onClose }) => {
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

const ActionButton = ({ onGenerateGoals, onGenerateFeatures, onShowVoiceModal, isLoading, hasGoals, hasFeatures }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="action-button-container">
             {isOpen && (
                <div className="action-options">
                    <button className="action-option-btn" onClick={onShowVoiceModal} style={{ animationDelay: '0.2s' }}>
                        <span className="action-option-label">Comando de Voz</span>
                        <MicIcon className="icon" />
                    </button>
                    <button className="action-option-btn" onClick={onGenerateFeatures} disabled={hasFeatures || isLoading} style={{ animationDelay: '0.1s' }}>
                        <span className="action-option-label">Sugerir Novidades</span>
                        <LightbulbIcon className="icon" />
                    </button>
                    <button className="action-option-btn" onClick={onGenerateGoals} disabled={hasGoals || isLoading} style={{ animationDelay: '0s' }}>
                        <span className="action-option-label">Gerar Metas</span>
                         <SparklesIcon className="icon" />
                    </button>
                </div>
            )}
            <button className={`main-action-btn ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
                {isLoading ? <div className="animate-spin"><SparklesIcon className="icon" /></div> : isOpen ? <XIcon className="icon" /> : <PlusIcon className="icon" />}
            </button>
        </div>
    );
};

const GeminiWrapper = ({ children, tasks, onNewGoals, onNewFeatures, onAddTask, onCompleteTask }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY as string }), []);

    const callGemini = async (prompt: string, schema?: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const config = schema ? {
                responseMimeType: "application/json",
                responseSchema: schema,
            } : {};

            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: config,
            });
            
            const text = response.text;

            if (schema) {
                // Ensure text is not empty before parsing, and trim whitespace.
                const trimmedText = text.trim();
                if (trimmedText) {
                    try {
                        return JSON.parse(trimmedText);
                    } catch(parseError) {
                        console.error("Failed to parse Gemini JSON response:", parseError, "Raw text:", trimmedText);
                        setError("A resposta da IA não estava em um formato válido.");
                        return null;
                    }
                }
                return null;
            }
            return text;

        } catch (e: any) {
            console.error("Gemini API call failed:", e);
            setError(`Ocorreu um erro: ${e.message}`);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const generateWeeklyGoals = async () => {
        const recentTasks = tasks.slice(0, 10).map(t => `- ${t.text} (${t.completed ? 'concluído' : 'pendente'}) na área de ${healthAreas[t.areaId].name}`).join('\n');
        const prompt = `Baseado nas minhas tarefas recentes:\n${recentTasks}\n\nGere 3 metas semanais SMART (Específicas, Mensuráveis, Alcançáveis, Relevantes, Temporais) para me ajudar a progredir. Foque em diversidade de áreas.`;
        
        const schema = {
            type: Type.OBJECT,
            properties: {
                goals: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            area: { type: Type.STRING, enum: Object.keys(healthAreas) },
                            goal: { type: Type.STRING }
                        },
                        required: ["area", "goal"]
                    }
                }
            }
        };
        
        const result = await callGemini(prompt, schema);
        if (result && result.goals) {
            onNewGoals(result.goals);
        }
    };
    
    const generatePendingFeatures = async () => {
        const prompt = `Analise este app de produtividade gamificado chamado "Pequenos Passos". O app tem as seguintes áreas: ${Object.values(healthAreas).map(a => a.name).join(', ')}. O usuário completa tarefas, ganha conquistas e visualiza o progresso. Gere 2 ideias criativas para novas funcionalidades que poderiam ser adicionadas ao app para torná-lo mais engajador.`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                features: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING }
                        },
                        required: ["title", "description"]
                    }
                }
            }
        };

        const result = await callGemini(prompt, schema);
        if (result && result.features) {
            onNewFeatures(result.features);
        }
    };

    const handleVoiceCommand = async (command: string) => {
        const prompt = `
            Você é um assistente para o aplicativo "Pequenos Passos".
            Analise o comando do usuário e determine a intenção e as entidades.
            O comando é: "${command}"

            As intenções possíveis são: 'ADD_TASK', 'COMPLETE_TASK', 'UNKNOWN'.
            
            Para 'ADD_TASK', as entidades são:
            - text: o nome da tarefa (obrigatório)
            - areaId: a área da tarefa (opcional, use uma das chaves: ${Object.keys(healthAreas).join(', ')})
            - dueDate: a data de vencimento (opcional, formato YYYY-MM-DD)

            Para 'COMPLETE_TASK', a entidade é:
            - text: o nome da tarefa a ser concluída (obrigatório)

            Responda APENAS com o JSON.
        `;
        const schema = {
            type: Type.OBJECT,
            properties: {
                intent: { type: Type.STRING, enum: ['ADD_TASK', 'COMPLETE_TASK', 'UNKNOWN'] },
                entities: { type: Type.OBJECT, properties: {
                    text: { type: Type.STRING },
                    areaId: { type: Type.STRING, enum: Object.keys(healthAreas) },
                    dueDate: { type: Type.STRING }
                }}
            }
        };
        const result = await callGemini(prompt, schema);
        if (result) {
            if (result.intent === 'ADD_TASK' && result.entities.text) {
                onAddTask({
                    text: result.entities.text,
                    areaId: result.entities.areaId || 'social',
                    dueDate: result.entities.dueDate || new Date().toISOString().split('T')[0],
                });
            } else if (result.intent === 'COMPLETE_TASK' && result.entities.text) {
                onCompleteTask(result.entities.text);
            } else {
                setError("Não entendi o comando. Tente algo como 'Adicionar tarefa ler um livro' ou 'Concluir a tarefa meditar'.");
            }
        }
    };


    return children({ isLoading, error, generateWeeklyGoals, generatePendingFeatures, handleVoiceCommand });
};

// --- Helper Components & Functions ---

const ProgressBar = ({ progress, color }) => (
    <div className="progress-bar">
        <div className="progress-bar-inner" style={{ width: `${progress}%`, backgroundColor: color || 'var(--primary)' }}></div>
    </div>
);

const ActivityCalendar = ({ tasks }) => {
    const today = new Date();
    // Go back ~16 weeks to fill the calendar
    const startDate = new Date();
    startDate.setDate(today.getDate() - (16 * 7) - today.getDay());
    
    const tasksByDate = useMemo(() => {
        const map = new Map<string, number>();
        tasks.forEach(task => {
            if (task.completedAt) {
                const date = task.completedAt.split('T')[0];
                map.set(date, (map.get(date) || 0) + 1);
            }
        });
        return map;
    }, [tasks]);

    const days = [];
    let currentDate = new Date(startDate);
    const totalDays = 17 * 7;

    for (let i = 0; i < totalDays; i++) {
        const dateString = currentDate.toISOString().split('T')[0];
        const count = tasksByDate.get(dateString) || 0;
        let level = 0;
        if (count > 0) level = 1;
        if (count >= 3) level = 2;
        if (count >= 5) level = 3;
        if (count >= 8) level = 4;
        
        days.push(
            <div key={dateString} className="calendar-day-wrapper" title={`${count} tarefas em ${currentDate.toLocaleDateString()}`}>
                 <div className={`calendar-day day-level-${level}`}></div>
            </div>
        );
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return <div className="activity-calendar">{days}</div>;
};

const ProgressChart = ({ tasks }) => {
    const [timeframe, setTimeframe] = useState('week'); // 'week', 'month', 'all'

    const data = useMemo(() => {
        // This is a simplified data processing logic
        const completed = tasks.filter(t => t.completed && t.completedAt);
        const grouped = completed.reduce((acc, task) => {
            const date = new Date(task.completedAt!).toLocaleDateString('pt-BR');
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        // Return last 7 days for 'week'
        const chartData = Object.entries(grouped).slice(-7).map(([label, value]) => ({ label, value: value as number }));

        return chartData;
    }, [tasks, timeframe]);

    const maxValue = Math.max(...data.map(d => d.value), 1);
    const barWidth = 90 / (data.length || 1);

    return (
        <div>
            <div className="chart-header">
                <h3 className="text-lg font-bold">Tarefas Concluídas</h3>
                {/* Timeframe toggle buttons would go here */}
            </div>
            <div className="chart-wrapper">
                <svg className="chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Y-axis lines (simplified) */}
                    <line x1="5" y1="10" x2="95" y2="10" className="grid-line" />
                    <line x1="5" y1="50" x2="95" y2="50" className="grid-line" />
                    <line x1="5" y1="90" x2="95" y2="90" className="grid-line" />
                    {/* Bars */}
                    {data.map(({ label, value }, index) => (
                        <rect
                            key={label}
                            x={5 + index * barWidth}
                            y={90 - (value / maxValue) * 80}
                            width={barWidth * 0.8}
                            height={(value / maxValue) * 80}
                            fill={healthAreas.physical.color}
                            className="chart-bar"
                        />
                    ))}
                    {/* X-axis labels (simplified) */}
                     {data.map(({ label }, index) => (
                         <text key={label} x={5 + index * barWidth + barWidth * 0.4} y="98" className="axis-label">
                            {label.substring(0,5)}
                         </text>
                     ))}
                </svg>
            </div>
             {/* Legend would go here */}
        </div>
    );
};

function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}

function calculateStreak(completedTasks: Task[]): number {
    if (completedTasks.length === 0) return 0;
    
    const completedDates = [...new Set(completedTasks.map(t => t.completedAt?.split('T')[0]))]
        .filter(Boolean)
        .map(d => new Date(d + 'T00:00:00')) // Ensure local timezone interpretation
        .sort((a, b) => b.getTime() - a.getTime());

    if (completedDates.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0,0,0,0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const mostRecentCompletion = new Date(completedDates[0]);
    mostRecentCompletion.setHours(0,0,0,0);
    
    if (mostRecentCompletion.getTime() !== today.getTime() && mostRecentCompletion.getTime() !== yesterday.getTime()) {
        return 0;
    }

    streak = 1;
    let lastDate = mostRecentCompletion;

    for (let i = 1; i < completedDates.length; i++) {
        const currentDate = new Date(completedDates[i]);
        currentDate.setHours(0,0,0,0);
        const diffDays = (lastDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);
        
        if (diffDays === 1) {
            streak++;
            lastDate = currentDate;
        } else if (diffDays > 1) {
            break;
        }
        // if diffDays is 0, it's the same day, so we continue to the next unique day
    }

    return streak;
}

function getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    d.setHours(0,0,0,0);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

function getEndOfWeek(date: Date): Date {
    const start = getStartOfWeek(date);
    start.setDate(start.getDate() + 6);
    return start;
}

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