import React, { useState, useEffect, useRef } from 'react';
import { StretchingIcon } from '../../icons';

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

export default StretchingExercise;
