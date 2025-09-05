import React from 'react';
import { UserData, HealthAreaKey } from '../types/types';
import { healthAreas } from '../data/healthAreas';
import { TrophyIcon, FlameIcon, TargetIcon, ArrowLeftIcon } from '../icons';

interface RewardsViewProps {
  userData: UserData;
  getDayProgress: (areaKey: string) => { completed: number; total: number; percentage: number };
  setCurrentView: (view: string) => void;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  userData,
  getDayProgress,
  setCurrentView,
}) => {
  const totalMedals = Object.values(userData.medals || {}).reduce((total: number, areaMedals: { [date: string]: boolean }) => total + Object.keys(areaMedals || {}).length, 0);
  const maxStreak: number = Math.max(...Object.values(userData.streaks || {}).map((s: number) => s || 0), 0);
  const completedAreasToday = Object.keys(healthAreas).filter(area => getDayProgress(area).percentage === 100).length;

  return (
    <div>
      <header className="view-header">
        <div className="view-header-content">
          <div className="flex items-center gap-4 mb-6">
            <button className="btn btn-ghost" onClick={() => setCurrentView('dashboard')}>
              <ArrowLeftIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} /> Voltar
            </button>
          </div>
          <div className="text-center">
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>SUAS CONQUISTAS</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Celebre cada passo da sua jornada extraordinária</p>
          </div>
        </div>
      </header>

      <main className="view-container">
        <div className="grid md-grid-cols-3 gap-6 mb-12">
          <div className="card" style={{ borderColor: 'var(--accent-yellow)' }}><div className="card-content text-center">
            <TrophyIcon style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', color: 'var(--accent-yellow)' }} />
            <div style={{ fontSize: '2.25rem', fontWeight: 700 }}>{totalMedals}</div>
            <div style={{ color: 'var(--accent-yellow)', fontWeight: 600 }}>Medalhas Conquistadas</div>
          </div></div>
          <div className="card" style={{ borderColor: 'var(--accent-orange)' }}><div className="card-content text-center">
            <FlameIcon style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', color: 'var(--accent-orange)' }} />
            <div style={{ fontSize: '2.25rem', fontWeight: 700 }}>{maxStreak}</div>
            <div style={{ color: 'var(--accent-orange)', fontWeight: 600 }}>Maior Sequência</div>
          </div></div>
          <div className="card" style={{ borderColor: 'var(--primary)' }}><div className="card-content text-center">
            <TargetIcon style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', color: 'var(--primary)' }} />
            <div style={{ fontSize: '2.25rem', fontWeight: 700 }}>{completedAreasToday}</div>
            <div style={{ color: 'var(--primary)', fontWeight: 600 }}>Áreas Completas Hoje</div>
          </div></div>
        </div>

        <div className="mb-12">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '1.5rem' }}>MEDALHAS POR ÁREA</h2>
          <div className="grid md-grid-cols-2 lg-grid-cols-4 gap-6">
            {Object.entries(healthAreas).map(([key, area]) => {
              const medalCount = Object.keys(userData.medals[key as HealthAreaKey] || {}).length;
              const streak = userData.streaks[key as HealthAreaKey] || 0;
              const IconComponent = area.icon;
              return (<div key={key} className="card"><div className="card-content text-center">
                <div className="reward-shield">
                  <svg className="reward-shield-bg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 0L0 25V75L50 100L100 75V25L50 0Z" fill="url(#shield-gradient)" />
                    <defs><linearGradient id="shield-gradient" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse"><stop stopColor="#10b981" /><stop offset="1" stopColor="#059669" /></linearGradient></defs>
                  </svg>
                  <div className="reward-shield-content">
                    <IconComponent style={{ width: '2.5rem', height: '2.5rem' }} />
                    <span style={{ fontSize: '1.25rem' }}>{area.medalIcon}</span>
                  </div>
                </div>
                <h3 style={{ fontWeight: 700 }}>{area.medalName}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{area.name}</p>
                <div className="space-y-2" style={{ fontSize: '0.875rem', textAlign: 'left', padding: '0 1rem' }}>
                  <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>Medalhas:</span> <span style={{ fontWeight: 600 }}>{medalCount}</span></div>
                  <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>Sequência:</span> <span style={{ fontWeight: 600, color: 'var(--accent-orange)' }}>{streak} dias</span></div>
                </div>
              </div></div>)
            })}
          </div>
        </div>
        <div className="mb-12">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '1.5rem' }}>TROFÉUS ESPECIAIS</h2>
          <div className="grid md-grid-cols-3 gap-6">
            <div className={`card ${maxStreak >= 7 ? 'border-amber-500' : ''}`} style={{ borderColor: maxStreak >= 7 ? '#a16207' : '' }}><div className="card-content text-center">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🥉</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Troféu Bronze</h3><p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>7 dias seguidos</p>
              <div style={{ fontSize: '1.125rem', fontWeight: 600, color: maxStreak >= 7 ? '#f59e0b' : 'var(--text-secondary)' }}>{maxStreak >= 7 ? 'CONQUISTADO!' : `${maxStreak}/7 dias`}</div>
            </div></div>
            <div className={`card ${maxStreak >= 15 ? 'border-gray-400' : ''}`} style={{ borderColor: maxStreak >= 15 ? '#9ca3af' : '' }}><div className="card-content text-center">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🥈</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Troféu Prata</h3><p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>15 dias seguidos</p>
              <div style={{ fontSize: '1.125rem', fontWeight: 600, color: maxStreak >= 15 ? '#d1d5db' : 'var(--text-secondary)' }}>{maxStreak >= 15 ? 'CONQUISTADO!' : `${maxStreak}/15 dias`}</div>
            </div></div>
            <div className={`card ${maxStreak >= 30 ? 'border-yellow-500' : ''}`} style={{ borderColor: maxStreak >= 30 ? '#eab308' : '' }}><div className="card-content text-center">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🥇</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Troféu Ouro</h3><p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>30 dias seguidos</p>
              <div style={{ fontSize: '1.125rem', fontWeight: 600, color: maxStreak >= 30 ? '#facc15' : 'var(--text-secondary)' }}>{maxStreak >= 30 ? 'CONQUISTADO!' : `${maxStreak}/30 dias`}</div>
            </div></div>
          </div>
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '1.5rem' }}>HISTÓRICO DA SEMANA</h2>
          <div className="card"><div className="card-content">
            <div className="weekly-history-grid">
              {Array.from({ length: 7 }).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const dateString = date.toDateString();
                const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
                const dayMedals = Object.keys(healthAreas).filter(area => (userData.medals[area as HealthAreaKey] || {})[dateString]).length;
                return (<div key={i} className="history-day">
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{dayName.replace('.', '')}</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{dayMedals}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>medalhas</div>
                </div>)
              })}
            </div>
          </div></div>
        </div>
      </main>
    </div>
  );
};
