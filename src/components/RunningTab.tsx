import React, { useState, useRef, useEffect } from 'react';
import { RunLog } from '../types';
import { PauseIcon, PlayIcon, CheckCircle2Icon } from './Icons';

type RunningTabProps = {
    runLogs: RunLog[];
    onAddRunLog: (log: Omit<RunLog, 'id'>) => void;
};

const RunningTab = ({ runLogs, onAddRunLog }: RunningTabProps) => {
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

export default RunningTab;