import React from 'react';
import { FootprintsIcon, CalendarDaysIcon, UsersIcon, AwardIcon } from './Icons';

const BottomNavBar = ({ activeView, onViewChange }: { activeView: string, onViewChange: (view: string) => void }) => {
    const navItems = [
        { id: 'dashboard', label: 'Início', icon: FootprintsIcon },
        { id: 'planner', label: 'Plano', icon: CalendarDaysIcon },
        { id: 'challenges', label: 'Desafios', icon: UsersIcon },
        { id: 'rewards', label: 'Prêmios', icon: AwardIcon },
    ];

    return (
        <nav className="bottom-nav-bar">
            {navItems.map(({ id, label, icon: Icon }) => (
                <button
                    key={id}
                    className={`nav-item ${activeView === id ? 'active' : ''}`}
                    onClick={() => onViewChange(id)}
                    aria-label={label}
                >
                    <Icon className="icon" />
                    <span className="nav-label">{label}</span>
                </button>
            ))}
        </nav>
    );
};

export default BottomNavBar;