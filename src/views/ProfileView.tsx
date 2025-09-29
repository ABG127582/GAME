import React, { useState } from 'react';
import { User } from '../types';
import { UserIcon, LogOutIcon } from '../components/Icons';

type ProfileViewProps = {
    user: User;
    onLogout: () => void;
    onUpdateUser: (user: User) => void;
};

const ProfileView = ({ user, onLogout, onUpdateUser }: ProfileViewProps) => {
    const [name, setName] = useState(user.name);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        if (name.trim()) {
            onUpdateUser({ ...user, name: name.trim() });
            setIsEditing(false);
        }
    };

    return (
        <div className="view-container">
            <header className="view-header">
                <div className="view-header-content text-center">
                    <div className="profile-avatar-large">{user.avatar}</div>
                    {isEditing ? (
                         <input
                             type="text"
                             value={name}
                             onChange={(e) => setName(e.target.value)}
                             onBlur={handleSave}
                             onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                             className="input profile-name-input"
                             autoFocus
                         />
                    ) : (
                        <h1 className="text-3xl font-bold mt-4" onClick={() => setIsEditing(true)}>
                            {user.name}
                        </h1>
                    )}
                    <p className="text-lg text-secondary">Gerencie suas informações.</p>
                </div>
            </header>

            <div className="profile-actions">
                 <button className="btn btn-ghost" onClick={() => setIsEditing(true)}>
                    <UserIcon className="icon-left" />
                    Alterar Nome
                </button>
                <button className="btn btn-red" onClick={onLogout}>
                    <LogOutIcon className="icon-left" />
                    Sair (Logout)
                </button>
            </div>
        </div>
    );
};

export default ProfileView;