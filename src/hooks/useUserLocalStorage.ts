import { useState, useEffect, useCallback } from 'react';

export function useUserLocalStorage<T>(key: string, initialValue: T | (() => T), userId: string | null = null): [T, React.Dispatch<React.SetStateAction<T>>] {
    const getCompositeKey = useCallback(() => (userId ? `${key}_${userId}` : key), [key, userId]);

    const [storedValue, setStoredValue] = useState<T>(() => {
        // Don't load user-specific data on initial render if there's no user,
        // unless it's the user profile itself.
        if (!userId && key !== 'userProfile') {
            return initialValue instanceof Function ? initialValue() : initialValue;
        }
        try {
            const item = window.localStorage.getItem(getCompositeKey());
            return item ? JSON.parse(item) : (initialValue instanceof Function ? initialValue() : initialValue);
        } catch (error) {
            console.error(error);
            return initialValue instanceof Function ? initialValue() : initialValue;
        }
    });

    // This effect re-syncs state from localStorage when the user logs in or out.
    useEffect(() => {
        // If there's no user, and this is user-specific data, reset to initial state.
        if (!userId && key !== 'userProfile') {
            setStoredValue(initialValue instanceof Function ? initialValue() : initialValue);
            return;
        }
        try {
            const item = window.localStorage.getItem(getCompositeKey());
            setStoredValue(item ? JSON.parse(item) : (initialValue instanceof Function ? initialValue() : initialValue));
        } catch (error) {
            console.error(error);
            setStoredValue(initialValue instanceof Function ? initialValue() : initialValue);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, key]);

    const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
        // Do not save user-specific data if there is no user logged in.
        if (!userId && key !== 'userProfile') {
            return;
        }
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(getCompositeKey(), JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}