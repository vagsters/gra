import React from 'react';
import type { OfflineGains } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { StardustIcon, NebulaGasIcon, ResearchIcon } from './icons';

interface WelcomeBackModalProps {
    gains: OfflineGains;
    onClaim: () => void;
}

const formatNumber = (num: number): string => {
    if (num < 1000) return num.toLocaleString(undefined, { maximumFractionDigits: 0});
    const suffixes = ["", "k", "M", "B", "T", "q", "Q", "s", "S", "o", "n", "d"];
    const i = Math.floor(Math.log10(num) / 3);
    if (i >= suffixes.length) return num.toExponential(2);
    const shortNum = (num / Math.pow(1000, i));
    return shortNum.toFixed(2) + suffixes[i];
};

const formatDuration = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return [hours, minutes, seconds]
        .map(v => v.toString().padStart(2, '0'))
        .join(':');
};

const WelcomeBackModal: React.FC<WelcomeBackModalProps> = ({ gains, onClaim }) => {
    const { t } = useLanguage();
    const formattedTime = formatDuration(gains.timeAwaySeconds);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
            <div className="panel bg-black/50 backdrop-blur-lg rounded-xl border-2 border-purple-500/50 shadow-lg shadow-purple-900/80 w-full max-w-md m-4 flex flex-col theme-wizarding:border-theme-border-dark theme-wizarding:shadow-theme-panel-shadow">
                <div className="p-6 text-center">
                    <h2 className="text-2xl font-bold font-serif text-purple-300 theme-wizarding:text-theme-text-main">{t('offline.title')}</h2>
                    <p className="mt-2 text-gray-300 theme-wizarding:text-theme-text-light">
                        {t('offline.description', { time: formattedTime })}
                    </p>
                </div>

                <div className="px-6 py-4 space-y-3 bg-black/20 theme-wizarding:bg-theme-panel-bg">
                    <div className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-3">
                            <StardustIcon />
                            <span className="text-yellow-300 theme-wizarding:text-theme-text-main">{t('resources.stardust')}</span>
                        </div>
                        <span className="font-bold text-yellow-300 theme-wizarding:text-theme-text-main">+{formatNumber(gains.stardust)}</span>
                    </div>
                     <div className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-3">
                            <NebulaGasIcon />
                            <span className="text-pink-300 theme-wizarding:text-theme-text-main">{t('resources.nebulaGas')}</span>
                        </div>
                        <span className="font-bold text-pink-300 theme-wizarding:text-theme-text-main">+{formatNumber(gains.nebulaGas)}</span>
                    </div>
                     <div className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-3">
                            <ResearchIcon />
                            <span className="text-teal-300 theme-wizarding:text-theme-text-main">{t('resources.researchPoints')}</span>
                        </div>
                        <span className="font-bold text-teal-300 theme-wizarding:text-theme-text-main">+{formatNumber(gains.researchPoints)}</span>
                    </div>
                </div>

                <div className="p-4">
                    <button
                        onClick={onClaim}
                        className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-500 border border-purple-500 text-white rounded-lg font-bold text-lg transition-all duration-200 shadow-md hover:shadow-purple-500/50
                                   theme-wizarding:bg-theme-accent-secondary theme-wizarding:hover:bg-theme-accent-primary theme-wizarding:border-theme-accent-primary theme-wizarding:text-theme-bg theme-wizarding:shadow-sm"
                    >
                        {t('offline.claim')}
                    </button>
                </div>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default WelcomeBackModal;
