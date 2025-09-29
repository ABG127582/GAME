import React, { useState, useEffect, useRef } from 'react';
import { SparklesIcon, MicIcon } from '../Icons';

type VoiceCommandModalProps = {
    onCommand: (command: string) => void;
    onClose: () => void;
    isProcessing: boolean;
    error: string | null;
};

const VoiceCommandModal: React.FC<VoiceCommandModalProps> = ({ onCommand, onClose, isProcessing, error }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<any>(null);
    const transcriptRef = useRef('');

    useEffect(() => {
        transcriptRef.current = transcript;
    }, [transcript]);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("Seu navegador não suporta a API de Reconhecimento de Voz.");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            const currentTranscript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            setTranscript(currentTranscript);
        };

        recognition.onend = () => {
            setIsListening(false);
            if (transcriptRef.current.trim()) {
                onCommand(transcriptRef.current.trim());
            }
        };
        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [onCommand]);

    const handleListen = () => {
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setTranscript('');
            transcriptRef.current = '';
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    return (
        <div className="voice-modal-body">
            <div className="voice-modal-content-centered">
                {isProcessing ? (
                     <>
                        <SparklesIcon className="icon animate-spin text-primary" style={{ width: '3rem', height: '3rem' }} />
                        <p>Processando seu comando...</p>
                    </>
                ) : (
                    <>
                        <p>{isListening ? 'Ouvindo...' : 'Pressione o microfone para começar'}</p>
                        <button
                            onClick={handleListen}
                            className={`btn btn-lg ${isListening ? 'recording' : 'btn-primary'}`}
                            aria-label={isListening ? 'Parar de ouvir' : 'Começar a ouvir'}
                        >
                            <MicIcon className="icon" />
                        </button>
                        {transcript && <p className="text-sm mt-4"><em>"{transcript}"</em></p>}
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </>
                )}
            </div>
        </div>
    );
};

export default VoiceCommandModal;