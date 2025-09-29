import React, { useState } from 'react';
import { PlusIcon, XIcon, SparklesIcon, LightbulbIcon, MicIcon } from './Icons';

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

export default ActionButton;