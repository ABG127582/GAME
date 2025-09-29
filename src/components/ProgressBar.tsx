import React from 'react';

const ProgressBar = ({ progress, color }: { progress: number, color: string }) => (
    <div className="progress-bar">
        <div className="progress-bar-inner" style={{ width: `${progress}%`, backgroundColor: color || 'var(--primary)' }}></div>
    </div>
);

export default ProgressBar;