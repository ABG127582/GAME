import React, { useState } from 'react';
import { Challenge, ChallengeFriend } from '../../types';
import { avatars } from '../../utils/config';
import { getEndOfWeek } from '../../utils/helpers';

type CreateChallengeModalProps = {
    onSave: (challenge: Omit<Challenge, 'id'>) => void;
    onClose: () => void;
};

const CreateChallengeModal = ({ onSave, onClose }: CreateChallengeModalProps) => {
    const [name, setName] = useState('Desafio Semanal');
    const [friends, setFriends] = useState(['Amigo 1', 'Amigo 2', 'Amigo 3']);

    const handleFriendChange = (index, value) => {
        const newFriends = [...friends];
        newFriends[index] = value;
        setFriends(newFriends);
    };

    const handleSave = () => {
        const now = new Date();
        const endOfWeek = getEndOfWeek(now);
        const challengeFriends: ChallengeFriend[] = friends
            .filter(f => f.trim() !== '')
            .map(f => ({
                id: crypto.randomUUID(),
                name: f.trim(),
                avatar: avatars[Math.floor(Math.random() * avatars.length)],
                score: Math.floor(Math.random() * 5), // Start with a random score
                lastUpdated: now.toISOString(),
            }));

        onSave({
            name: name.trim(),
            endDate: endOfWeek.toISOString(),
            friends: challengeFriends,
        });
        onClose();
    };

    return (
        <div className="space-y-4">
            <div className="form-group">
                <label htmlFor="challengeName" className="form-label">Nome do Desafio</label>
                <input id="challengeName" type="text" value={name} onChange={e => setName(e.target.value)} className="input" />
            </div>
            <div className="form-group">
                <label className="form-label">Convide seus Amigos</label>
                <div className="space-y-2">
                    {friends.map((friend, index) => (
                        <input
                            key={index}
                            type="text"
                            value={friend}
                            onChange={e => handleFriendChange(index, e.target.value)}
                            className="input"
                            placeholder={`Nome do Amigo ${index + 1}`}
                        />
                    ))}
                </div>
                <p className="form-help-text">Adicione os nomes dos amigos para competir. O progresso deles será simulado.</p>
            </div>
             <div className="modal-actions">
                <button onClick={onClose} className="btn btn-ghost">Cancelar</button>
                <button onClick={handleSave} className="btn btn-primary">Criar Desafio</button>
            </div>
        </div>
    )
};

export default CreateChallengeModal;