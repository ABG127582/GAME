import React from 'react';
import {
    FlameIcon, TrophyIcon, CheckCircle2Icon, TargetIcon, LightbulbIcon, AwardIcon, TrendingUpIcon, CalendarDaysIcon
} from '../components/Icons';
import { healthAreas } from '../utils/config';
import { User, WeeklyGoal, PendingFeature } from '../types';

type DashboardProps = {
    user: User;
    stats: {
        totalCompleted: number;
        streak: number;
        weeklyCompleted: number;
        totalGoals: number;
    };
    onViewChange: (view: string, areaId?: string | null) => void;
    weeklyGoals: WeeklyGoal[];
    pendingFeatures: PendingFeature[];
    onShowModal: (modalName: string, data?: any) => void;
};

const Dashboard = ({ user, stats, onViewChange, weeklyGoals, pendingFeatures, onShowModal }: DashboardProps) => (
    <div className="view-container">
        <header className="dashboard-hero text-center">
            <div className="dashboard-header">
                <h1>Pequenos Passos</h1>
                <button className="profile-avatar-btn" onClick={() => onViewChange('profile')} aria-label="Ver perfil">
                    {user.avatar}
                </button>
            </div>
            <p>Sua Jornada para uma Vida Extraordinária, {user.name}.</p>
            <div className="stats-grid">
                <div className="card stat-card-clickable" onClick={() => onViewChange('rewards')}>
                    <div className="stat-card-content">
                        <FlameIcon className="icon" style={{ color: 'var(--accent-orange)'}}/>
                        <div>
                            <div className="stat-value">{stats.streak}</div>
                            <div className="stat-label">Dias em sequência</div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="stat-card-content">
                        <TrophyIcon className="icon" style={{ color: 'var(--accent-yellow)'}}/>
                        <div>
                            <div className="stat-value">{stats.totalCompleted}</div>
                            <div className="stat-label">Tarefas concluídas</div>
                        </div>
                    </div>
                </div>
                 <div className="card">
                    <div className="stat-card-content">
                       <CheckCircle2Icon className="icon" style={{ color: 'var(--accent-green-500)'}}/>
                       <div>
                            <div className="stat-value">{stats.weeklyCompleted}</div>
                            <div className="stat-label">Concluídas na semana</div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="stat-card-content">
                       <TargetIcon className="icon" style={{ color: 'var(--accent-blue-500)'}}/>
                       <div>
                            <div className="stat-value">{stats.totalGoals}</div>
                            <div className="stat-label">Metas semanais</div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <h2 className="section-title">Suas Metas da Semana</h2>
        {weeklyGoals.length > 0 ? (
            <div className="weekly-goals-grid">
                {weeklyGoals.map((goal, index) => {
                    const Icon = healthAreas[goal.area]?.icon;
                    return (
                        <div key={index} className="card goal-card" style={{ '--area-color': healthAreas[goal.area]?.color || 'var(--primary)' } as React.CSSProperties} onClick={() => onViewChange('tasks', goal.area)}>
                            <div className="card-content">
                                <div className="goal-card-header">
                                    {Icon && <Icon className="icon" />}
                                    <h3>{healthAreas[goal.area]?.name || 'Meta'}</h3>
                                </div>
                                <p className="goal-card-text">{goal.goal}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        ) : (
            <div className="no-goals-card card">
                <TargetIcon className="icon" />
                <p>Nenhuma meta semanal definida ainda. Que tal usar a varinha mágica para gerar algumas ideias personalizadas?</p>
            </div>
        )}

        <h2 className="section-title">Novidades no Horizonte</h2>
        {pendingFeatures.length > 0 ? (
             <div className="pending-features-grid">
                {pendingFeatures.map((feature, index) => (
                    <div key={index} className="card feature-card">
                         <div className="card-content">
                            <div className="feature-card-header">
                                <LightbulbIcon className="icon" />
                                <h3>{feature.title}</h3>
                            </div>
                            <p className="feature-card-text">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
             <div className="no-features-card card">
                <LightbulbIcon className="icon" />
                <p>Nenhuma novidade planejada no momento. Use o poder da IA para sugerir a próxima grande funcionalidade do app!</p>
            </div>
        )}


        <h2 className="section-title">Territórios do Bem-Estar</h2>
        <div className="areas-grid">
            {Object.entries(healthAreas).map(([id, { name, icon: Icon }]) => (
                <div key={id} className="card area-card text-center" onClick={() => onViewChange('tasks', id as keyof typeof healthAreas)}>
                    <div className="card-content">
                        <Icon className="icon" style={{ width: '3rem', height: '3rem', margin: '0 auto', color: 'var(--primary)' }} />
                        <h3>{name}</h3>
                    </div>
                </div>
            ))}
        </div>

        <div className="dashboard-actions">
            <button className="btn btn-primary" onClick={() => onViewChange('rewards')}>
                <AwardIcon className="icon-left" />
                Ver Minhas Conquistas
            </button>
            <button className="btn btn-ghost" onClick={() => onViewChange('progress')}>
                 <TrendingUpIcon className="icon-left" />
                Ver Meu Progresso
            </button>
            <button className="btn btn-ghost" onClick={() => onViewChange('planner')}>
                 <CalendarDaysIcon className="icon-left" />
                Planejador Semanal
            </button>
        </div>
    </div>
);

export default Dashboard;