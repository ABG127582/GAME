import React from 'react';

const ProgressBar = ({ percentage, color, className = '' }: { percentage: number; color?: string; className?: string }) => (
    <div className={`progress-bar ${className}`}>
        <div
            className="progress-bar-inner"
            style={{
                width: `${percentage}%`,
                ...(color && { backgroundColor: color })
            }}
        />
    </div>
);

export default ProgressBar;
