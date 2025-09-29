// --- DATA TYPES ---
export type User = {
    id: string;
    name: string;
    avatar: string;
};

export type Task = {
  id: string;
  text: string;
  areaId: keyof typeof import('../utils/config').healthAreas;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  isGoal?: boolean;
  dueDate?: string;
  recurrence?: string; // 'none', 'daily', 'weekly', 'weekdays'
  alarmTime?: string; // 'HH:MM'
  timeout?: number; // minutes
};

export type WeeklyGoal = {
    area: keyof typeof import('../utils/config').healthAreas;
    goal: string;
};

export type PendingFeature = {
    title: string;
    description: string;
}

export type RunLog = {
    id: string;
    date: string;
    distance: number;
    time: number; // in seconds
    pace: string; // MM:SS per km
};

export type PlayerState = {
    isPlaying: boolean;
    currentTrackIndex: number | null;
    volume: number;
};

export type ChallengeFriend = {
    id: string;
    name: string;
    avatar: string;
    score: number;
    lastUpdated: string;
};

export type Challenge = {
    id: string;
    name: string;
    endDate: string;
    friends: ChallengeFriend[];
};