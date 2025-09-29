import React, { useEffect } from 'react';
import { Challenge, Task, User } from '../types';
import { getStartOfWeek } from '../utils/helpers';
import { UsersIcon, PlusIcon, TrophyIcon } from '../components/Icons';

const LeaderboardCard = ({ challenge, user, userScore }: { challenge: Challenge, user: User, userScore: number }) => {
    const playerList = [
        { id: user.id, name: user.name, avatar: user.avatar, score: userScore, isUser: true },
        ...challenge.friends
    ].sort((a, b) => b.score - a.score);

    return (
        <div className="card leaderboard-card">
            <div className="card-content">
                <h3 className="leaderboard-title">{challenge.name}</h3>
                <ol className="leaderboard-list">
                    {playerList.map((player, index) => (
                        <li key={player.id} className={`leaderboard-item ${player.isUser ? 'is-user' : ''}`}>
                            <div className="leaderboard-rank">
                                {index === 0 && <TrophyIcon style={{ color: 'var(--trophy-gold)' }} />}
                                {index === 1 && <TrophyIcon style={{ color: 'var(--trophy-silver)' }} />}
                                {index === 2 && <TrophyIcon style={{ color: 'var(--trophy-bronze)' }} />}
                                {index > 2 && <span>{index + 1}</span>}
                            </div>
                            <div className="leaderboard-player">
                                <span className="player-avatar">{player.avatar}</span>
                                <span className="player-name">{player.name} {player.isUser && "(Você)"}</span>
                            </div>
                            <div className="leaderboard-score">{player.score} pts</div>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
};

type ChallengesViewProps = {
    challenges: Challenge[];
    tasks: Task[];
    user: User;
    onAddChallenge: (challenge: Omit<Challenge, 'id'>) => void;
    setChallenges: React.Dispatch<React.SetStateAction<Challenge[]>>;
    onShowModal: (modalName: string) => void;
};

const ChallengesView = ({ challenges, tasks, user, onAddChallenge, setChallenges, onShowModal }: ChallengesViewProps) => {

    useEffect(() => {
        // Simulate friend progress
        const now = new Date();
        const updatedChallenges = challenges.map(challenge => {
            const updatedFriends = challenge.friends.map(friend => {
                const lastUpdated = new Date(friend.lastUpdated);
                const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
                if (hoursDiff > 12) { // Update roughly twice a day
                    const scoreIncrease = Math.floor(Math.random() * 3); // 0, 1, or 2 tasks
                    return { ...friend, score: friend.score + scoreIncrease, lastUpdated: now.toISOString() };
                }
                return friend;
            });
            return { ...challenge, friends: updatedFriends };
        });
        setChallenges(updatedChallenges);
    }, []); // Run once on component mount

    const startOfWeek = getStartOfWeek(new Date());
    const tasksThisWeek = tasks.filter(t => t.completed && t.completedAt && new Date(t.completedAt) >= startOfWeek).length;

    return (
        <div className="view-container">
            <header className="view-header">
               <div className="view-header-content">
                 <div className="flex items-center gap-4">
                     <div className="task-header-icon-wrapper" style={{ backgroundColor: 'var(--accent-indigo-500)' }}>
                        <UsersIcon className="icon" style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
                     </div>
                     <div>
                         <h1 className="text-3xl font-bold">Desafios Semanais</h1>
                         <p className="text-lg text-secondary">Compita com seus amigos e motive-se!</p>
                     </div>
                 </div>
               </div>
            </header>

            {challenges.length > 0 ? (
                <div className="challenges-grid">
                    {challenges.map(challenge => (
                        <LeaderboardCard key={challenge.id} challenge={challenge} user={user} userScore={tasksThisWeek} />
                    ))}
                </div>
            ) : (
                <div className="no-goals-card card">
                    <UsersIcon className="icon" />
                    <p>Você ainda não está em nenhum desafio. Que tal criar um e convidar seus amigos para uma competição amigável?</p>
                </div>
            )}

            <div className="dashboard-actions">
                <button className="btn btn-primary" onClick={() => onShowModal('addChallenge')}>
                    <PlusIcon className="icon-left" />
                    Criar Novo Desafio
                </button>
            </div>
        </div>
    );
};

export default ChallengesView;