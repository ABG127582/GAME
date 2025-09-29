import React, { useState, useMemo } from 'react';
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Task, WeeklyGoal, PendingFeature } from '../types';
import { healthAreas } from '../utils/config';

type GeminiWrapperProps = {
    children: (props: {
        isLoading: boolean;
        error: string | null;
        generateWeeklyGoals: () => void;
        generatePendingFeatures: () => void;
        handleVoiceCommand: (command: string) => void;
    }) => React.ReactNode;
    tasks: Task[];
    onNewGoals: (goals: WeeklyGoal[]) => void;
    onNewFeatures: (features: PendingFeature[]) => void;
    onAddTask: (taskData: { text: string; areaId: keyof typeof healthAreas; dueDate: string }) => void;
    onCompleteTask: (taskText: string) => void;
};

const GeminiWrapper = ({ children, tasks, onNewGoals, onNewFeatures, onAddTask, onCompleteTask }: GeminiWrapperProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const ai = useMemo(() => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("Chave da API do Gemini não encontrada. Funções de IA estarão desabilitadas.");
            return null;
        }
        return new GoogleGenAI({ apiKey: apiKey as string });
    }, []);

    const callGemini = async (prompt: string, schema?: any) => {
        if (!ai) {
            setError("A chave da API de IA não está configurada. Por favor, adicione VITE_GEMINI_API_KEY ao seu ambiente.");
            return null;
        }
        setIsLoading(true);
        setError(null);
        try {
            const config = schema ? {
                responseMimeType: "application/json",
                responseSchema: schema,
            } : {};

            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: prompt,
                generationConfig: config,
            });

            const text = response.text;

            if (config.responseMimeType === "application/json") {
                // Ensure text is not empty before parsing, and trim whitespace.
                const trimmedText = text.trim();
                if (trimmedText) {
                    try {
                        return JSON.parse(trimmedText);
                    } catch(parseError) {
                        console.error("Failed to parse Gemini JSON response:", parseError, "Raw text:", trimmedText);
                        setError("A resposta da IA não estava em um formato válido.");
                        return null;
                    }
                }
                return null;
            }
            return text;

        } catch (e: any) {
            console.error("Gemini API call failed:", e);
            setError(`Ocorreu um erro: ${e.message}`);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const generateWeeklyGoals = async () => {
        const recentTasks = tasks.slice(0, 10).map(t => `- ${t.text} (${t.completed ? 'concluído' : 'pendente'}) na área de ${healthAreas[t.areaId].name}`).join('\n');
        const prompt = `Baseado nas minhas tarefas recentes:\n${recentTasks}\n\nGere 3 metas semanais SMART (Específicas, Mensuráveis, Alcançáveis, Relevantes, Temporais) para me ajudar a progredir. Foque em diversidade de áreas.`;

        const schema = {
            type: Type.OBJECT,
            properties: {
                goals: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            area: { type: Type.STRING, enum: Object.keys(healthAreas) },
                            goal: { type: Type.STRING }
                        },
                        required: ["area", "goal"]
                    }
                }
            }
        };

        const result = await callGemini(prompt, { responseMimeType: "application/json", responseSchema: schema });
        if (result && result.goals) {
            onNewGoals(result.goals);
        }
    };

    const generatePendingFeatures = async () => {
        const prompt = `Analise este app de produtividade gamificado chamado "Pequenos Passos". O app tem as seguintes áreas: ${Object.values(healthAreas).map(a => a.name).join(', ')}. O usuário completa tarefas, ganha conquistas e visualiza o progresso. Gere 2 ideias criativas para novas funcionalidades que poderiam ser adicionadas ao app para torná-lo mais engajador.`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                features: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING }
                        },
                        required: ["title", "description"]
                    }
                }
            }
        };

        const result = await callGemini(prompt, { responseMimeType: "application/json", responseSchema: schema });
        if (result && result.features) {
            onNewFeatures(result.features);
        }
    };

    const handleVoiceCommand = async (command: string) => {
        const prompt = `
            Você é um assistente para o aplicativo "Pequenos Passos".
            Analise o comando do usuário e determine a intenção e as entidades.
            O comando é: "${command}"

            As intenções possíveis são: 'ADD_TASK', 'COMPLETE_TASK', 'UNKNOWN'.

            Para 'ADD_TASK', as entidades são:
            - text: o nome da tarefa (obrigatório)
            - areaId: a área da tarefa (opcional, use uma das chaves: ${Object.keys(healthAreas).join(', ')})
            - dueDate: a data de vencimento (opcional, formato YYYY-MM-DD)

            Para 'COMPLETE_TASK', a entidade é:
            - text: o nome da tarefa a ser concluída (obrigatório)

            Responda APENAS com o JSON.
        `;
        const schema = {
            type: Type.OBJECT,
            properties: {
                intent: { type: Type.STRING, enum: ['ADD_TASK', 'COMPLETE_TASK', 'UNKNOWN'] },
                entities: { type: Type.OBJECT, properties: {
                    text: { type: Type.STRING },
                    areaId: { type: Type.STRING, enum: Object.keys(healthAreas) },
                    dueDate: { type: Type.STRING }
                }}
            }
        };
        const result = await callGemini(prompt, { responseMimeType: "application/json", responseSchema: schema });
        if (result) {
            if (result.intent === 'ADD_TASK' && result.entities.text) {
                onAddTask({
                    text: result.entities.text,
                    areaId: result.entities.areaId || 'social',
                    dueDate: result.entities.dueDate || new Date().toISOString().split('T')[0],
                });
            } else if (result.intent === 'COMPLETE_TASK' && result.entities.text) {
                onCompleteTask(result.entities.text);
            } else {
                setError("Não entendi o comando. Tente algo como 'Adicionar tarefa ler um livro' ou 'Concluir a tarefa meditar'.");
            }
        }
    };


    return children({ isLoading, error, generateWeeklyGoals, generatePendingFeatures, handleVoiceCommand });
};

export default GeminiWrapper;