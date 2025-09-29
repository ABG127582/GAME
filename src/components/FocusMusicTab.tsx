import React from 'react';
import { useServiceWorker } from '../hooks/useServiceWorker';
import { focusMusicTracks } from '../utils/config';
import { PauseIcon, PlayIcon, VolumeXIcon, Volume2Icon } from './Icons';

const FocusMusicTab = () => {
    const { playerState, controls } = useServiceWorker();
    const { isPlaying, currentTrackIndex, volume } = playerState;

    const handleTrackSelect = (index: number) => {
        if (index === currentTrackIndex) {
            isPlaying ? controls.pause() : controls.play();
        } else {
            controls.setTrack(index);
        }
    };

    const currentTrack = typeof currentTrackIndex === 'number' ? focusMusicTracks[currentTrackIndex] : null;

    return (
         <div className="card focus-music-player">
            <div className="card-content">
                <h3 className="card-title text-xl font-bold mb-4">Música para Foco</h3>
                <ul className="music-track-list">
                    {focusMusicTracks.map((track, index) => (
                        <li key={track.id}>
                           <button
                                className={`music-track-item ${currentTrackIndex === index ? 'active' : ''}`}
                                onClick={() => handleTrackSelect(index)}
                            >
                                <track.icon className="icon" />
                                <span>{track.name}</span>
                                {currentTrackIndex === index && isPlaying && <div className="playing-indicator"></div>}
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="music-controls">
                   {currentTrack && (
                       <div className="now-playing">
                           <span>Tocando agora</span>
                           <p>{currentTrack.name}</p>
                       </div>
                   )}
                   <div className="main-controls">
                       <button onClick={controls.pause} className="btn btn-ghost" disabled={!isPlaying}>
                           <PauseIcon className="w-6 h-6" />
                       </button>
                       <button onClick={controls.play} className="btn btn-primary" disabled={isPlaying || currentTrackIndex === null}>
                           <PlayIcon className="w-8 h-8"/>
                       </button>
                       <div className="volume-control">
                            <button onClick={() => controls.setVolume(volume > 0 ? 0 : 0.75)}>
                                {volume === 0 ? <VolumeXIcon /> : <Volume2Icon />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={volume}
                                className="volume-slider"
                                onChange={(e) => controls.setVolume(parseFloat(e.target.value))}
                            />
                       </div>
                   </div>
                </div>
            </div>
        </div>
    );
};

export default FocusMusicTab;