import React, { useMemo } from 'react';
import { TrophyIcon, FlameIcon, TargetIcon, BellIcon, LightbulbIcon, SparklesIcon } from '../../icons';
import { healthAreas } from '../../data/healthAreas';
import ProgressBar from '../shared/ProgressBar';

// This helper function is duplicated here for now. It should be moved to a shared helpers file.
const handleKeyboardClick = (e: React.KeyboardEvent, callback: () => void) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    callback();
  }
};

const DashboardView = ({ userData, getDayProgress, hasMedalToday, setCurrentView, setSelectedArea, setIsAlarmsModalOpen, setIsFeatureModalOpen }: any) => {
    const weeklyGoals = useMemo(() =>
        Object.entries(userData.weeklyGoals || {}).filter(([, goal]) => typeof goal === 'string' && goal.trim() !== ''),
        [userData.weeklyGoals]
    );

    const pendingFeatures = useMemo(() => userData.pendingFeatures || [], [userData.pendingFeatures]);

    return (
    <div className="view-container">
      <header className="dashboard-hero">
          <h1>PEQUENOS PASSOS</h1>
          <p>Para uma Vida Extraordinária</p>
          <div className="stats-grid">
            <div className="card">
              <div className="card-content stat-card-content">
                <TrophyIcon className="icon" style={{color: 'var(--accent-yellow)'}}/>
                <div>
                  <div className="stat-value">
                    {Number(Object.values(userData.medals || {}).reduce((total: number, areaMedals: any) =>
                      total + Object.keys(areaMedals || {}).length, 0
                    ))}
                  </div>
                  <div className="stat-label">Medalhas Conquistadas</div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-content stat-card-content">
                <FlameIcon className="icon" style={{color: 'var(--accent-orange)'}}/>
                <div>
                  <div className="stat-value">
                    {Math.max(...Object.values(userData.streaks || {}).map((s: any) => Number(s) || 0), 0)}
                  </div>
                  <div className="stat-label">Maior Sequência</div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-content stat-card-content">
                <TargetIcon className="icon" style={{color: 'var(--primary)'}} />
                <div>
                  <div className="stat-value">
                    {Object.keys(healthAreas).filter(area => getDayProgress(area).percentage === 100).length}
                  </div>
                  <div className="stat-label">Áreas Completas Hoje</div>
                </div>
              </div>
            </div>
            <div
                className="card stat-card-clickable"
                role="button"
                tabIndex={0}
                onClick={() => setIsAlarmsModalOpen(true)}
                onKeyDown={(e) => handleKeyboardClick(e, () => setIsAlarmsModalOpen(true))}
                aria-label="Gerenciar alarmes"
            >
                <div className="card-content stat-card-content">
                    <BellIcon className="icon" style={{color: 'var(--accent-blue)'}}/>
                    <div>
                        <div className="stat-value">
                            {Object.keys(userData.alarms || {}).length}
                        </div>
                        <div className="stat-label">Alarmes Ativos</div>
                    </div>
                </div>
            </div>
          </div>
      </header>
      <main>
        <h2 className="section-title">Metas da Semana</h2>
        {weeklyGoals.length > 0 ? (
            <div className="weekly-goals-grid">
                {weeklyGoals.map(([key, goal]) => {
                    const area = healthAreas[key as keyof typeof healthAreas];
                    if (!area) return null;
                    const IconComponent = area.icon;
                    const handleCardClick = () => { setSelectedArea(key); setCurrentView('tasks'); };
                    return (
                        <div
                            key={key}
                            className="card goal-card"
                            style={{ '--area-color': `var(--accent-${area.color.split('-')[1]}-500)` } as React.CSSProperties}
                            onClick={handleCardClick}
                            onKeyDown={(e) => handleKeyboardClick(e, handleCardClick)}
                            role="button"
                            tabIndex={0}
                            aria-label={`Ver metas e tarefas de ${area.name}`}
                        >
                            <div className="card-content">
                                <div className="goal-card-header">
                                    <IconComponent className="icon" />
                                    <h3>{area.name}</h3>
                                </div>
                                <p className="goal-card-text">{goal as string}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="card no-goals-card">
                <TargetIcon className="icon" />
                <p>
                    Você ainda não definiu nenhuma meta para esta semana.
                    Clique em uma área abaixo e vá para a aba 'Metas & Reflexões' para começar!
                </p>
            </div>
        )}

        <h2 className="section-title">Funções em Análise</h2>
        {pendingFeatures.length > 0 ? (
          <div className="pending-features-grid">
            {pendingFeatures.map((feature: any) => (
              <div key={feature.id} className="card feature-card">
                <div className="card-content">
                  <div className="feature-card-header">
                    <LightbulbIcon className="icon" />
                    <h3>{feature.name}</h3>
                  </div>
                  <p className="feature-card-text">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card no-features-card">
            <LightbulbIcon className="icon" />
            <p>
              Nenhuma nova função foi sugerida ainda.
              Seja o primeiro a compartilhar uma ideia para melhorar o app!
            </p>
          </div>
        )}

        <h2 className="section-title">
          Suas 8 Áreas de Saúde
        </h2>
        <div className="areas-grid">
          {Object.entries(healthAreas).map(([key, area]) => {
            const progress = getDayProgress(key);
            const hasMedal = hasMedalToday(key);
            const streak = userData.streaks[key] || 0;
            const IconComponent = area.icon;
            const handleCardClick = () => { setSelectedArea(key); setCurrentView('tasks'); };

            return (
              <div
                key={key}
                className="card area-card"
                onClick={handleCardClick}
                onKeyDown={(e) => handleKeyboardClick(e, handleCardClick)}
                role="button"
                tabIndex={0}
                aria-label={`Acessar área de ${area.name}`}
              >
                <div className="card-content">
                  <div className="flex items-center justify-between">
                    <IconComponent className="icon" style={{width: '2rem', height: '2rem', color: `var(--accent-${area.color.split('-')[1]}-500)`}} />
                    {hasMedal && <div className="pulse" style={{fontSize: '1.5rem'}}>{area.medalIcon}</div>}
                  </div>
                  <h3 style={{transition: 'color 0.2s'}}>{area.name}</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between" style={{fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem'}}>
                        <span>Progresso Hoje</span>
                        <span>{progress.completed}/{progress.total}</span>
                      </div>
                      <ProgressBar
                        percentage={progress.percentage}
                        color={`var(--accent-${area.color.split('-')[1]}-500)`}
                      />
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
        <div className="dashboard-actions">
          <button onClick={() => setCurrentView('rewards')} className="btn btn-primary">
            <TrophyIcon className="icon-left"/>
            Ver Recompensas
          </button>
          <button onClick={() => setIsFeatureModalOpen(true)} className="btn btn-blue">
            <SparklesIcon className="icon-left"/>
            Sugerir Função
          </button>
        </div>
      </main>
    </div>
)};

export default DashboardView;
