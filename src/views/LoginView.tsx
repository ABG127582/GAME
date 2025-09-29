import React, { useState } from 'react';
import { ArrowRightIcon } from '../components/Icons';
import { User } from '../types';
import { avatars } from '../utils/config';

const LoginView = ({ onLogin }: { onLogin: (user: User) => void }) => {
    const [name, setName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onLogin({
                id: crypto.randomUUID(),
                name: name.trim(),
                avatar: selectedAvatar,
            });
        }
    };

    return (
        <div className="login-view">
            <div className="login-card card">
                <div className="card-content">
                    <header className="text-center mb-6">
                        <h1 className="text-3xl font-bold">Bem-vindo(a) aos</h1>
                        <h2 className="text-4xl font-black text-primary">Pequenos Passos</h2>
                        <p className="text-secondary mt-2">Crie seu perfil para começar sua jornada.</p>
                    </header>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Seu Nome</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input text-lg text-center"
                                placeholder="Como podemos te chamar?"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label text-center">Escolha seu Avatar</label>
                            <div className="avatar-grid">
                                {avatars.map(avatar => (
                                    <button
                                        key={avatar}
                                        type="button"
                                        className={`avatar-selector ${selectedAvatar === avatar ? 'selected' : ''}`}
                                        onClick={() => setSelectedAvatar(avatar)}
                                    >
                                        {avatar}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-full text-lg mt-4" disabled={!name.trim()}>
                            Começar Jornada <ArrowRightIcon className="icon-right" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginView;