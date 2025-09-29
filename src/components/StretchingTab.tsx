import React, { useState, useRef, useEffect } from 'react';
import { stretchingExercises } from '../utils/config';
import { StretchingIcon, PauseIcon, PlayIcon, RepeatIcon } from './Icons';

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

const StretchingTab = () => {
    return (
        <div className="stretching-grid">
            {stretchingExercises.map(exercise => (
                <StretchingExerciseCard key={exercise.id} exercise={exercise} />
            ))}
        </div>
    );
};

export default StretchingTab;