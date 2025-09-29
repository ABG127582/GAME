import { Task } from '../types';

export function calculateStreak(completedTasks: Task[]): number {
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

export function getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    d.setHours(0,0,0,0);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

export function getEndOfWeek(date: Date): Date {
    const start = getStartOfWeek(date);
    start.setDate(start.getDate() + 6);
    return start;
}