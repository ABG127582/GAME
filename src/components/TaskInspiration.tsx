import React from 'react';
import { LightbulbIcon } from './Icons';
import { bookInspiredTasks } from '../utils/config';

type TaskInspirationProps = {
    area: keyof typeof bookInspiredTasks;
    onSelectSuggestion: (suggestion: string) => void;
};

const TaskInspiration = ({ area, onSelectSuggestion }: TaskInspirationProps) => {
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

export default TaskInspiration;