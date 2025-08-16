import React, { useState, useCallback } from 'react';
import { CRITICAL_CLICK_MULTIPLIER } from '../constants';
import { useLanguage } from '../context/LanguageContext';

interface StarProps {
    onStarClick: (power: number) => void;
    clickPower: number;
    critChance: number;
    cpmMultiplier: number;
    clickCombo: number;
}

interface ClickFeedback {
    id: number;
    x: number;
    y: number;
    value: number;
    isCritical: boolean;
}

interface Spark {
    id: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
}


const Star: React.FC<StarProps> = ({ onStarClick, clickPower, critChance, cpmMultiplier, clickCombo }) => {
    const { t } = useLanguage();
    const [isPulsing, setIsPulsing] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const [clickFeedbacks, setClickFeedbacks] = useState<ClickFeedback[]>([]);
    const [bursts, setBursts] = useState<number[]>([]);
    const [sparks, setSparks] = useState<Spark[]>([]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const isCritical = Math.random() < critChance;
        const actualPower = isCritical ? clickPower * CRITICAL_CLICK_MULTIPLIER : clickPower;
        onStarClick(actualPower);

        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 150);

        if (isCritical) {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 200);
            
            const newBurstId = Date.now();
            setBursts(prev => [...prev, newBurstId]);
            setTimeout(() => {
                setBursts(prev => prev.filter(id => id !== newBurstId));
            }, 500);
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (cpmMultiplier > 1) {
             for (let i = 0; i < 10; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const distance = Math.random() * 40 + 20;
                const newSpark: Spark = {
                    id: Math.random(),
                    x: x,
                    y: y,
                    dx: Math.cos(angle) * distance,
                    dy: Math.sin(angle) * distance
                };
                setSparks(prev => [...prev, newSpark]);
                setTimeout(() => setSparks(prev => prev.filter(s => s.id !== newSpark.id)), 600);
            }
        }


        const newFeedback: ClickFeedback = {
            id: Date.now() + Math.random(),
            x,
            y,
            value: actualPower,
            isCritical,
        };

        setClickFeedbacks(prev => [...prev, newFeedback]);

        setTimeout(() => {
            setClickFeedbacks(prev => prev.filter(f => f.id !== newFeedback.id));
        }, 1500);
    };

    const formatNumber = (num: number): string => {
        if (num < 1000) return `+${num.toFixed(0)}`;
        const suffixes = ["", "k", "M", "B", "T", "q", "Q", "s", "S", "o", "n", "d"];
        const i = Math.floor(Math.log10(num) / 3);
        const shortNum = (num / Math.pow(1000, i));
        return `+${shortNum.toFixed(2)}${suffixes[i]}`;
    };
    
    const isFrenzy = cpmMultiplier > 1;

    return (
        <div className={`relative flex items-center justify-center w-full h-full min-h-[250px] md:min-h-[300px] transition-transform duration-200 ${isShaking ? 'animate-screen-shake' : ''}`}>
            <div
                className={`star-container relative w-48 h-48 md:w-64 md:h-64 cursor-pointer select-none group ${isFrenzy ? 'in-frenzy' : ''}`}
                onClick={handleClick}
                aria-label="Click to generate resources"
            >
                {bursts.map(id => <div key={id} className="radial-burst"></div>)}
                <div className="frenzy-aura"></div>
                <div className={`star-gradient-1 absolute inset-0 bg-yellow-400 rounded-full transition-all duration-300 animate-pulse group-hover:blur-2xl blur-xl ${isShaking ? 'bg-orange-500' : ''}`}></div>
                <div className={`star-gradient-2 absolute inset-2 bg-yellow-300 rounded-full transition-all duration-300 group-hover:blur-lg blur-md ${isShaking ? 'bg-orange-400' : ''}`}></div>
                <div 
                    className={`star-main-gradient absolute inset-4 bg-gradient-radial from-white to-yellow-300 rounded-full transition-all duration-150 ease-out group-hover:scale-105 ${isPulsing ? 'scale-95' : 'scale-100'}`}
                ></div>

                {sparks.map(spark => (
                    <div 
                        key={spark.id} 
                        className="frenzy-spark"
                        style={{
                            '--x': `${spark.x}px`,
                            '--y': `${spark.y}px`,
                            '--dx': `${spark.dx}px`,
                            '--dy': `${spark.dy}px`
                        } as React.CSSProperties}
                    ></div>
                ))}

                {clickFeedbacks.map(feedback => (
                    <span
                        key={feedback.id}
                        className={`absolute font-bold pointer-events-none animate-fade-up ${
                            feedback.isCritical
                                ? 'text-2xl text-yellow-300'
                                : 'text-xl text-yellow-200'
                        }`}
                        style={{ left: `${feedback.x}px`, top: `${feedback.y}px`, transform: 'translate(-50%, -50%)', textShadow: feedback.isCritical ? '0 0 8px #f59e0b' : 'none' }}
                    >
                        {formatNumber(feedback.value)}
                    </span>
                ))}
            </div>
            <div className="absolute -bottom-4 text-center">
                 {isFrenzy && (
                    <div className="frenzy-display">
                        <p className="font-bold text-2xl text-red-400 uppercase tracking-widest" style={{ textShadow: '0 0 8px #ef4444' }}>
                            {t('star.frenzy_active', { multiplier: cpmMultiplier })}
                        </p>
                    </div>
                )}
                {clickCombo > 1 && (
                    <div className="combo-display mt-1">
                        <p className="font-bold text-xl text-cyan-300" style={{ textShadow: '0 0 8px #22d3ee' }}>
                            {t('star.combo_display', { combo: clickCombo })}
                        </p>
                    </div>
                )}
            </div>
             <style>{`
                @keyframes fade-up {
                    0% { opacity: 1; transform: translate(-50%, -50%) translateY(0) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) translateY(-60px) scale(0.8); }
                }
                .animate-fade-up {
                    animation: fade-up 1.5s forwards ease-out;
                }
            `}</style>
        </div>
    );
};

export default Star;