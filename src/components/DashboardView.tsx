import React from 'react';
import { UserData } from '../types/types';
import { healthAreas } from '../data/healthAreas';
import { TrophyIcon, FlameIcon, TargetIcon } from '../icons';

interface DashboardViewProps {
  userData: UserData;
  getDayProgress: (areaKey: string) => { completed: number; total: number; percentage: number };
  hasMedalToday: (areaKey: string) => boolean;
  setCurrentView: (view: string) => void;
  setSelectedArea: (area: string | null) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userData,
  getDayProgress,
  hasMedalToday,
  setCurrentView,
  setSelectedArea,
}) => {
  return (
    <div className="view-container">
      <header className="dashboard-hero">
          <h1>PEQUENOS PASSOS</h1>
          <p>Para uma Vida Extraordinária</p>
          <div className="stats-grid">
            <div className="card">
              <div className="card-content stat-card-content">
                <TrophyIcon className="text-yellow-500" style={{color: 'var(--accent-yellow)'}}/>
                <div className="stat-value">
                  {Number(Object.values(userData.medals || {}).reduce((total: number, areaMedals: { [date: string]: boolean }) =>
                    total + Object.keys(areaMedals || {}).length, 0
                  ))}
                </div>
                <div className="stat-label">Medalhas Conquistadas</div>
              </div>
            </div>
            <div className="card">
              <div className="card-content stat-card-content">
                <FlameIcon className="text-orange-500" style={{color: 'var(--accent-orange)'}}/>
                <div className="stat-value">
                  {Math.max(...Object.values(userData.streaks || {}).map((s: number) => s || 0), 0)}
                </div>
                <div className="stat-label">Maior Sequência</div>
              </div>
            </div>
            <div className="card">
              <div className="card-content stat-card-content">
                <TargetIcon className="text-green-500" style={{color: 'var(--primary)'}} />
                <div className="stat-value">
                  {Object.keys(healthAreas).filter(area => getDayProgress(area).percentage === 100).length}
                </div>
                <div className="stat-label">Áreas Completas Hoje</div>
              </div>
            </div>
          </div>
      </header>

      <main>
        <h2 style={{fontSize: '1.875rem', fontWeight: 700, textAlign: 'center', margin: '3rem 0'}}>
          Suas 8 Áreas de Saúde
        </h2>
        <div className="areas-grid">
          {Object.entries(healthAreas).map(([key, area]) => {
            const progress = getDayProgress(key)
            const hasMedal = hasMedalToday(key)
            const streak = userData.streaks[key] || 0
            const IconComponent = area.icon

            return (
              <div key={key} className="card area-card" onClick={() => { setSelectedArea(key); setCurrentView('tasks'); }}>
                <div className="card-content">
                  <div className="flex items-center justify-between">
                    <IconComponent style={{width: '2rem', height: '2rem', color: 'var(--primary-light)'}} />
                    {hasMedal && <div className="pulse" style={{fontSize: '1.5rem'}}>{area.medalIcon}</div>}
                  </div>
                  <h3 style={{fontSize: '1.125rem', fontWeight: 700, transition: 'color 0.2s'}}>{area.name}</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between" style={{fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem'}}>
                        <span>Progresso Hoje</span>
                        <span>{progress.completed}/{progress.total}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-inner" style={{width: `${progress.percentage}%`}}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between" style={{fontSize: '0.875rem'}}>
                      <div className="flex items-center gap-1" style={{color: 'var(--accent-orange)'}}>
                        <FlameIcon style={{width: '1rem', height: '1rem'}} />
                        <span>{streak} dias</span>
                      </div>
                      {hasMedal && <span className="badge">{area.medalName}</span>}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex justify-center gap-4" style={{marginTop: '3rem'}}>
          <button onClick={() => setCurrentView('rewards')} className="btn btn-primary" style={{padding: '0.75rem 2rem', fontSize: '1.125rem'}}>
            <TrophyIcon style={{width: '1.25rem', height: '1.25rem', marginRight: '0.5rem'}} />
            Ver Recompensas
          </button>
        </div>
      </main>
    </div>
  )
}
