
import React from 'react';
import type { GameState, Spell } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SpellbookPanelProps {
    gameState: GameState;
    onCastSpell: (id: string) => void;
}

const formatNumber = (num: number): string => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
};

const SpellbookPanel: React.FC<SpellbookPanelProps> = ({ gameState, onCastSpell }) => {
    const { t } = useLanguage();
    const { mana, maxMana, spells, activeSpellEffects, settings: { compactMode } } = gameState;

    const manaPercentage = (mana / maxMana) * 100;

    return (
        <div className={`h-full flex flex-col ${compactMode ? 'p-2' : 'p-4'}`}>
            <h2 className={`font-bold text-center text-purple-300 ${compactMode ? 'text-lg mb-2' : 'text-xl mb-4'}`}>{t('spellbook.title')}</h2>
            
            {/* Mana Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-sm mb-1 text-cyan-200">
                    <span>{t('resources.mana')}</span>
                    <span>{formatNumber(mana)} / {formatNumber(maxMana)}</span>
                </div>
                <div className="w-full bg-black/50 rounded-full h-4 border border-cyan-800">
                    <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-100 ease-linear" 
                        style={{ width: `${manaPercentage}%` }}>
                    </div>
                </div>
            </div>

            {/* Spells List */}
            <div className="overflow-y-auto flex-grow pr-2 space-y-2">
                {spells.map(spell => {
                    const canAfford = mana >= spell.manaCost;
                    const activeEffect = activeSpellEffects.find(e => e.spellId === spell.id);
                    
                    return (
                        <div key={spell.id} className={`purchase-item bg-blue-900/40 rounded-lg border border-blue-700/50 transition-all duration-200 ${compactMode ? 'p-2' : 'p-3'}`}>
                            <div className="flex justify-between items-center">
                                <div className="flex-1 mr-2">
                                    <h3 className={`font-bold text-blue-200 ${compactMode ? 'text-sm' : 'text-base'}`}>{t(spell.nameKey)}</h3>
                                    {!compactMode && <p className="text-xs text-gray-400">{t(spell.descriptionKey)}</p>}
                                    {activeEffect && (
                                        <p className="text-xs text-green-400">
                                            Active: {activeEffect.remainingDuration.toFixed(0)}s
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => onCastSpell(spell.id)}
                                    disabled={!canAfford}
                                    className={`purchase-btn flex flex-col items-center justify-center rounded-md font-semibold transition-all duration-200 border ${compactMode ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'} ${
                                        canAfford 
                                        ? 'can-afford bg-blue-600 hover:bg-blue-500 border-blue-500 text-white shadow-md' 
                                        : 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <span>{t('spellbook.cast')}</span>
                                    <span className="text-xs opacity-80">({t('spellbook.cost')}: {spell.manaCost})</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SpellbookPanel;
