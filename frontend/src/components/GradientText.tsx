import React from 'react';

interface GradientTextProps {
    children: React.ReactNode;
    className?: string;
    from?: string;
    via?: string;
    to?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({
    children,
    className = '',
    from = '#58cc02',
    via = '#1cb0f6',
    to = '#ff4b9a'
}) => {
    return (
        <span
            className={className}
            style={{
                background: `linear-gradient(135deg, ${from} 0%, ${via} 50%, ${to} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block'
            }}
        >
            {children}
        </span>
    );
};

export default GradientText;
