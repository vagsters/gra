import React from 'react';
import type { GameState } from '../types';
import { INITIAL_ASCENSION_TREE } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { SingularityEssenceIcon } from './icons';

interface AscensionTreePanelProps {
    gameState: GameState;
    onPurchase: (id: string) => void;
}

const AscensionTreePanel: React.FC<AscensionTreePanelProps> = ({ gameState, onPurchase }) => {
    const { t } = useLanguage();
    const { singularityEssence, purchasedAscensionUpgrades } = gameState;

    const getNodeStatus = (upgradeId: string) => {
        const upgrade = INITIAL_ASCENSION_TREE.find(u => u.id === upgradeId)!;
        const isPurchased = purchasedAscensionUpgrades.includes(upgradeId);
        if (isPurchased) return 'purchased';
        
        const depsMet = upgrade.dependencies.every(dep => purchasedAscensionUpgrades.includes(dep));
        const canAfford = singularityEssence >= upgrade.cost;
        
        if (depsMet && canAfford) return 'available';
        if (depsMet && !canAfford) return 'unaffordable';
        return 'locked';
    };

    return (
        <div className="h-full flex flex-col p-4">
            <h2 className="font-bold text-center text-xl text-purple-300 mb-4">{t('ascension_tree.title')}</h2>
            <div className="relative flex-grow border-2 border-purple-500/20 rounded-lg bg-black/20 overflow-hidden">
                <svg className="absolute w-full h-full" style={{ zIndex: 0 }}>
                    {INITIAL_ASCENSION_TREE.map(upgrade =>
                        upgrade.dependencies.map(depId => {
                            const dep = INITIAL_ASCENSION_TREE.find(d => d.id === depId)!;
                            const isDepPurchased = purchasedAscensionUpgrades.includes(depId);
                            return (
                                <line
                                    key={`${depId}-${upgrade.id}`}
                                    x1={`${dep.position.x}%`}
                                    y1={`${dep.position.y}%`}
                                    x2={`${upgrade.position.x}%`}
                                    y2={`${upgrade.position.y}%`}
                                    className={`transition-all duration-500 ${isDepPurchased ? 'stroke-purple-400' : 'stroke-gray-600'}`}
                                    strokeWidth="2"
                                />
                            );
                        })
                    )}
                </svg>

                {INITIAL_ASCENSION_TREE.map(upgrade => {
                    const status = getNodeStatus(upgrade.id);
                    let buttonClass = 'bg-gray-800 border-gray-600'; // Locked
                    if (status === 'available') buttonClass = 'bg-purple-700 border-purple-400 hover:bg-purple-600 animate-pulse';
                    if (status === 'unaffordable') buttonClass = 'bg-gray-700 border-gray-500';
                    if (status === 'purchased') buttonClass = 'bg-yellow-500 border-yellow-300';
                    
                    return (
                        <div
                            key={upgrade.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                            style={{ left: `${upgrade.position.x}%`, top: `${upgrade.position.y}%`, zIndex: 1 }}
                        >
                            <button
                                onClick={() => onPurchase(upgrade.id)}
                                disabled={status !== 'available'}
                                className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${buttonClass}`}
                            >
                                <SingularityEssenceIcon />
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 border border-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                                <p className="font-bold text-purple-300">{t(upgrade.nameKey)}</p>
                                <p className="text-gray-300">{t(upgrade.descriptionKey)}</p>
                                <p className="mt-1 text-yellow-400">Cost: {upgrade.cost} {t('resources.singularityEssence')}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AscensionTreePanel;