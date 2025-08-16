import React from 'react';
import type { GameState } from '../types';
import { INITIAL_RESEARCH_TREE } from '../constants';
import { ResearchIcon } from './icons';
import { useLanguage } from '../context/LanguageContext';

interface ResearchPanelProps {
    gameState: GameState;
    onPurchaseResearch: (id: string) => void;
}

const formatNumber = (num: number): string => {
    if (num < 1000) return num.toLocaleString(undefined, { maximumFractionDigits: 0});
    const suffixes = ["", "k", "M", "B", "T", "q", "Q", "s", "S", "o", "n", "d"];
    const i = Math.floor(Math.log10(num) / 3);
    if (i >= suffixes.length) return num.toExponential(2);
    const shortNum = (num / Math.pow(1000, i));
    return shortNum.toFixed(2) + suffixes[i];
};

const ResearchPanel: React.FC<ResearchPanelProps> = ({ gameState, onPurchaseResearch }) => {
    const { t } = useLanguage();
    const { researchPoints, completedResearch, settings: { compactMode } } = gameState;

    return (
        <div className={`h-full flex flex-col ${compactMode ? 'p-2' : 'p-4'}`}>
            <h2 className={`font-bold text-center text-purple-300 ${compactMode ? 'text-lg mb-2' : 'text-xl mb-4'}`}>{t('research.title')}</h2>
            <div className="overflow-y-auto flex-grow pr-2 space-y-2">
                {INITIAL_RESEARCH_TREE.map(item => {
                    const isCompleted = completedResearch.includes(item.id);
                    const dependenciesMet = item.dependencies.every(dep => completedResearch.includes(dep));
                    const canAfford = researchPoints >= item.cost;
                    const canPurchase = !isCompleted && dependenciesMet && canAfford;
                    const isLocked = !isCompleted && !dependenciesMet;

                    let buttonClass = 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed';
                    if (canPurchase) {
                        buttonClass = 'bg-teal-600 hover:bg-teal-500 border-teal-500 text-white shadow-md hover:shadow-teal-500/50';
                    } else if (isCompleted) {
                        buttonClass = 'bg-green-800 border-green-700 text-green-300 cursor-default';
                    }

                    const depNames = item.dependencies.map(depId => {
                        const depItem = INITIAL_RESEARCH_TREE.find(r => r.id === depId);
                        return depItem ? t(depItem.nameKey) : depId;
                    }).join(', ');

                    const tooltipText = isLocked ? t('research.requires', { deps: depNames }) : undefined;

                    return (
                        <div 
                            key={item.id} 
                            title={tooltipText}
                            className={`rounded-lg border transition-all duration-200 ${compactMode ? 'p-2' : 'p-3'} ${isCompleted ? 'bg-green-900/40 border-green-700/50' : isLocked ? 'bg-gray-800/60 border-gray-700/50 opacity-60' : 'bg-teal-900/40 border-teal-700/50'}`}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex-1 mr-2">
                                    <h3 className={`font-bold ${compactMode ? 'text-sm' : 'text-base'} ${isCompleted ? 'text-green-200' : 'text-teal-200'}`}>{t(item.nameKey)}</h3>
                                    {!compactMode && <p className="text-xs text-gray-400">{t(item.descriptionKey)}</p>}
                                </div>
                                <button
                                    onClick={() => onPurchaseResearch(item.id)}
                                    disabled={!canPurchase}
                                    className={`flex items-center gap-2 rounded-md font-semibold transition-all duration-200 border ${compactMode ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'} ${buttonClass}`}
                                >
                                    <ResearchIcon />
                                    {isCompleted ? '✓' : <span title={item.cost.toLocaleString()}>{formatNumber(item.cost)}</span>}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ResearchPanel;