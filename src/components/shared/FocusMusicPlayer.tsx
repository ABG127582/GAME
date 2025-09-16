import React from 'react';
import { PlayIcon, PauseIcon, Volume2Icon, VolumeXIcon } from '../../icons';
import { focusMusicTracks } from '../../data/focusMusicTracks';

// This helper function is duplicated here for now. It should be moved to a shared helpers file.
const handleKeyboardClick = (e: React.KeyboardEvent, callback: () => void) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    callback();
  }
};

const FocusMusicPlayer = ({ playerState, playerControls }: { playerState: any, playerControls: any }) => {
    const { currentTrackIndex, isPlaying, volume } = playerState;
    const { setTrack, play, pause, setVolume } = playerControls;

    const handleTrackSelect = (index: number) => {
        if (index === currentTrackIndex) {
            if (isPlaying) {
                pause();
            } else {
                play();
            }
        } else {
            setTrack(index);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
    };

    const handleTogglePlay = () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    };

    const currentTrack = currentTrackIndex !== null ? focusMusicTracks[currentTrackIndex] : null;

    return (
        <div className="card focus-music-player">
            <div className="card-content">
                <h3 className="card-title mb-4">Música de Foco</h3>
                <ul className="music-track-list">
                    {focusMusicTracks.map((track, index) => {
                        const TrackIcon = track.icon;
                        const isActive = index === currentTrackIndex;
                        return (
                            <li
                                key={track.name}
                                className={`music-track-item ${isActive ? 'active' : ''}`}
                                onClick={() => handleTrackSelect(index)}
                                onKeyDown={(e) => handleKeyboardClick(e, () => handleTrackSelect(index))}
                                tabIndex={0}
                                role="button"
                                aria-pressed={isActive}
                            >
                                <TrackIcon className="icon" />
                                <span>{track.name}</span>
                                {isActive && isPlaying && <div className="playing-indicator" />}
                            </li>
                        );
                    })}
                </ul>
                {currentTrack && (
                    <div className="music-controls">
                        <div className="now-playing">
                            <span>Tocando agora:</span>
                            <p>{currentTrack.name}</p>
                        </div>
                        <div className="main-controls">
                            <button className="btn btn-ghost icon-btn" onClick={handleTogglePlay} aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}>
                                {isPlaying ? <PauseIcon /> : <PlayIcon />}
                            </button>
                            <div className="volume-control">
                                {volume > 0 ? <Volume2Icon /> : <VolumeXIcon />}
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="volume-slider"
                                    aria-label="Controle de volume"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FocusMusicPlayer;
