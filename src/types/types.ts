import React from 'react';

export type HealthAreaKey = 'fisica' | 'mental' | 'financeira' | 'familiar' | 'profissional' | 'social' | 'espiritual' | 'preventiva';

export interface Alarm {
  time: string;
  timeoutId?: number;
  taskText: string;
  areaName: string;
}

export interface UserData {
  medals: { [key: string]: { [date: string]: boolean } };
  streaks: { [key: string]: number };
  weeklyGoals: { [key: string]: string };
  achievements: { [key: string]: string };
  notes: { [key: string]: string };
  completedToday: { [key: string]: { [date: string]: string[] } };
  customTasks: { [key: string]: string[] };
  alarms: { [taskId: string]: Alarm };
}

export interface HealthArea {
    name: string;
    icon: React.FC<React.SVGProps<SVGSVGElement> & { className?: string }>;
    color: string;
    medalName: string;
    medalIcon: string;
    bookTasks: string[];
    motivationalPhrases: string[];
}

export type HealthAreas = {
    [key in HealthAreaKey]: HealthArea;
}
