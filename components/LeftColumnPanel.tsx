import React from 'react';
import type { GameState, Upgrade } from '../types';
import { useLanguage } from '../context/LanguageContext';
import StatsPanel from './StatsPanel';
import PurchasePanel from './PurchasePanel';

interface LeftColumnPanelProps {
    gameState: GameState;
    onPurchase: (id: string) => void;
    clickPower: number;
    avgSps: number;
    avgNgs: number;
    researchPointsPerSecond: number;
    critChance: number;
    cpmMultiplier: number;
    comboMultiplier: number;
}

const LeftColumnPanel: React.FC<LeftColumnPanelProps> = (props) => {
    const { gameState, onPurchase, clickPower, avgSps, avgNgs, researchPointsPerSecond, critChance, cpmMultiplier, comboMultiplier } = props;
    const { t } = useLanguage();

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex-shrink-0">
                <StatsPanel
                    statsHistory={gameState.statsHistory}
                    avgSps={avgSps}
                    avgNgs={avgNgs}
                    researchPointsPerSecond={researchPointsPerSecond}
                    clickPower={clickPower}
                    critChance={critChance}
                    cpmMultiplier={cpmMultiplier}
                    comboMultiplier={comboMultiplier}
                    isCompact={gameState.settings.compactMode}
                />
            </div>
            <div className="flex-grow min-h-0">
                 <PurchasePanel<Upgrade>
                    title={t('upgrades.title')} items={gameState.upgrades} onPurchase={onPurchase}
                    currencies={{stardust: gameState.stardust, nebulaGas: gameState.nebulaGas}}
                    getCost={item => item.baseCost * Math.pow(item.costGrowth, item.level)}
                    getEffect={item => t('upgrades.effect', { power: item.power.toLocaleString() })}
                    getOwnedCount={item => item.level} isCompact={gameState.settings.compactMode}
                    getName={item => t(item.nameKey)} getDescription={item => t(item.descriptionKey)}
                />
            </div>
        </div>
    );
};

export default LeftColumnPanel;