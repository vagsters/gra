import React, { useRef } from 'react';
import type { GameState, Generator, PurchaseableItem } from '../types';
import { StardustIcon, NebulaGasIcon } from './icons';
import { useLanguage } from '../context/LanguageContext';

interface ArtifactPanelProps {
    gameState: GameState;
    onPurchase: (id: string) => void;
    onCollect: (id: string, element: HTMLElement) => void;
    autoCollectorUnlocked: boolean;
    onToggleAutoCollector: () => void;
}

const formatNumber = (num: number): string => {
    if (num < 1000) return num.toLocaleString(undefined, { maximumFractionDigits: 0});
    const suffixes = ["", "k", "M", "B", "T", "q", "Q", "s", "S", "o", "n", "d"];
    const i = Math.floor(Math.log10(num) / 3);
    if (i >= suffixes.length) return num.toExponential(2);
    const shortNum = (num / Math.pow(1000, i));
    return shortNum.toFixed(2) + suffixes[i];
};

const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds.toFixed(0)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
}

const CurrencyIcon: React.FC<{ currency: PurchaseableItem['currency'] }> = ({ currency }) => {
    if (currency === 'nebulaGas') return <NebulaGasIcon />;
    return <StardustIcon />;
};

const Artifact: React.FC<{ item: Generator; onCollect: (id: string, element: HTMLElement) => void; onPurchase: (id: string) => void; stardust: number; nebulaGas: number; compactMode: boolean; t: (key: string, replacements?: any) => string; }> = ({ item, onCollect, onPurchase, stardust, nebulaGas, compactMode, t }) => {
    const collectBtnRef = useRef<HTMLButtonElement>(null);
    
    const cost = item.baseCost * Math.pow(item.costGrowth, item.count);
    const currentAmount = item.currency === 'stardust' ? stardust : nebulaGas;
    const canAfford = currentAmount >= cost;
    const isCharged = item.chargeTimer >= item.baseChargeTime;
    const chargePercentage = Math.min(100, (item.chargeTimer / item.baseChargeTime) * 100);
    const Icon = item.icon;
    
    const handleCollectClick = () => {
        if (collectBtnRef.current) {
            onCollect(item.id, collectBtnRef.current);
        }
    };

    return (
        <div className={`purchase-item bg-purple-900/40 rounded-lg border border-purple-700/50 transition-all duration-200 ${compactMode ? 'p-2 space-y-2' : 'p-3 space-y-2'}`}>
            {/* Top Row: Info and Buy Button */}
            <div className="flex justify-between items-start">
                {Icon && !compactMode && (
                    <div className="mr-3 text-purple-300">
                        <Icon />
                    </div>
                )}
                <div className="flex-1 mr-2">
                    <h3 className={`font-bold text-purple-200 flex items-center gap-2 ${compactMode ? 'text-sm' : 'text-base'}`}>
                        {Icon && compactMode && <Icon />}
                        {t(item.nameKey)}
                        <span className="text-sm font-normal text-gray-400">({item.count})</span>
                    </h3>
                    {!compactMode && <p className="text-xs text-gray-400">{t(item.descriptionKey)}</p>}
                        <div className={`flex gap-4 text-xs ${compactMode ? 'flex-col gap-0' : ''}`}>
                        <p className={`flex items-center gap-1 ${item.produces === 'nebulaGas' ? 'text-pink-300' : 'text-yellow-300'}`}>
                            {t('generators.payout')}: {formatNumber(item.basePayout * item.count)}
                            {item.produces === 'nebulaGas' ? <NebulaGasIcon /> : <StardustIcon />}
                        </p>
                        <p className="text-cyan-300">{t('generators.charge_time')}: {formatTime(item.baseChargeTime)}</p>
                        </div>
                </div>
                <button
                    onClick={() => onPurchase(item.id)}
                    disabled={!canAfford}
                    className={`purchase-btn flex-shrink-0 flex items-center gap-2 rounded-md font-semibold transition-all duration-200 border ${compactMode ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'} ${
                        canAfford 
                        ? 'can-afford bg-purple-600 hover:bg-purple-500 border-purple-500 text-white shadow-md hover:shadow-purple-500/50' 
                        : 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    <CurrencyIcon currency={item.currency} />
                    <span title={cost.toLocaleString()}>{formatNumber(cost)}</span>
                </button>
            </div>
            
            {/* Bottom Row: Progress and Collect Button */}
                {item.count > 0 && (
                <div className="flex items-center gap-2">
                    <div className="w-full bg-black/50 rounded-full h-4 border border-purple-800">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-100 ease-linear" style={{ width: `${chargePercentage}%` }}></div>
                    </div>
                    <button
                        ref={collectBtnRef}
                        onClick={handleCollectClick}
                        disabled={!isCharged}
                        className={`collect-btn flex-shrink-0 rounded-md font-semibold transition-all duration-200 border text-white ${compactMode ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'} ${
                            isCharged
                            ? 'bg-green-600 hover:bg-green-500 border-green-500 shadow-md'
                            : 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {t('generators.collect')}
                    </button>
                </div>
            )}
        </div>
    );
};


const ArtifactPanel: React.FC<ArtifactPanelProps> = ({ gameState, onPurchase, onCollect, autoCollectorUnlocked, onToggleAutoCollector }) => {
    const { t } = useLanguage();
    const { generators, stardust, nebulaGas, settings: { compactMode, autoCollectorActive } } = gameState;

    return (
        <div className={`h-full flex flex-col ${compactMode ? 'p-2' : 'p-4'}`}>
            <h2 className={`font-bold text-center text-purple-300 ${compactMode ? 'text-lg mb-2' : 'text-xl mb-4'}`}>{t('generators.title')}</h2>
            
            {autoCollectorUnlocked && (
                 <div className={`flex items-center justify-between bg-purple-900/30 rounded-md mb-2 ${compactMode ? 'p-1' : 'p-2'}`}>
                    <label htmlFor="autoCollectorToggle" className={`text-gray-300 ${compactMode ? 'text-sm' : 'text-base'}`}>{t('generators.auto_collect_toggle')}</label>
                    <button onClick={onToggleAutoCollector} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${autoCollectorActive ? 'bg-purple-600' : 'bg-gray-600'}`}>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${autoCollectorActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            )}

            <div className="overflow-y-auto flex-grow pr-2 space-y-2">
                {generators.map(item => (
                    <Artifact 
                        key={item.id}
                        item={item}
                        onCollect={onCollect}
                        onPurchase={onPurchase}
                        stardust={stardust}
                        nebulaGas={nebulaGas}
                        compactMode={compactMode}
                        t={t}
                    />
                ))}
            </div>
        </div>
    );
}

export default ArtifactPanel;