import { useState, useEffect, useMemo, useRef } from 'react';
import { PlayerState } from '../types';
import { focusMusicTracks } from '../utils/config';

export const useServiceWorker = () => {
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