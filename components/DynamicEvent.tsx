import React, { useState, useEffect, useRef } from 'react';
import type { DynamicEvent, Theme } from '../types';

interface DynamicEventProps {
    event: DynamicEvent;
    onClick: () => void;
    theme: Theme;
}

const DynamicEventComponent: React.FC<DynamicEventProps> = ({ event, onClick, theme }) => {
    const [position, setPosition] = useState({ x: event.x, y: event.y });
    const lastTimeRef = useRef<number | null>(null);
    const elementRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (lastTimeRef.current === null) {
                lastTimeRef.current = timestamp;
            }
            const deltaTime = (timestamp - lastTimeRef.current) / 1000; // in seconds
            lastTimeRef.current = timestamp;

            setPosition(prevPos => {
                const newX = prevPos.x + event.vx * deltaTime;
                const newY = prevPos.y + event.vy * deltaTime;
                
                // For simplicity, we'll let it fly off-screen. The parent will despawn it.
                return { x: newX, y: newY };
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [event.vx, event.vy]);
    
    const isWizarding = theme === 'wizarding';
    const className = isWizarding ? 'golden-snitch' : 'shooting-star';

    // Calculate rotation for shooting star tail
    const rotation = Math.atan2(event.vy, event.vx) * (180 / Math.PI);

    return (
        <div
            ref={elementRef}
            className={`dynamic-event ${className}`}
            style={{ 
                left: `${position.x}%`, 
                top: `${position.y}%`,
                transform: `translate(-50%, -50%)`
            }}
            onClick={onClick}
            role="button"
            aria-label="Click for a bonus"
        >
          {!isWizarding && <div style={{transform: `rotate(${rotation}deg)`}}></div>}
        </div>
    );
};

export default DynamicEventComponent;