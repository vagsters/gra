import React from 'react';
import type { PurchaseableItem } from '../types';
import { StardustIcon, NebulaGasIcon } from './icons';

interface PurchasePanelProps<T extends PurchaseableItem> {
    title: string;
    items: T[];
    onPurchase: (id: string) => void;
    currencies: { stardust: number; nebulaGas: number };
    getCost: (item: T) => number;
    getEffect: (item: T) => string;
    getOwnedCount: (item: T) => number;
    isCompact: boolean;
    getName: (item: T) => string;
    getDescription: (item: T) => string;
}

const formatNumber = (num: number): string => {
    if (num < 1000) return num.toLocaleString(undefined, { maximumFractionDigits: 0});
    const suffixes = ["", "k", "M", "B", "T", "q", "Q", "s", "S", "o", "n", "d"];
    const i = Math.floor(Math.log10(num) / 3);
    if (i >= suffixes.length) return num.toExponential(2);
    const shortNum = (num / Math.pow(1000, i));
    return shortNum.toFixed(2) + suffixes[i];
};

const CurrencyIcon: React.FC<{ currency: PurchaseableItem['currency'] }> = ({ currency }) => {
    if (currency === 'nebulaGas') return <NebulaGasIcon />;
    return <StardustIcon />;
};


function PurchasePanel<T extends PurchaseableItem> ({ 
    title, 
    items, 
    onPurchase, 
    currencies,
    getCost,
    getEffect,
    getOwnedCount,
    isCompact,
    getName,
    getDescription
}: PurchasePanelProps<T>) {
    return (
        <div className={`panel h-full flex flex-col ${isCompact ? 'p-2' : 'p-4'}`}>
            <h2 className={`font-bold text-center text-purple-300 ${isCompact ? 'text-lg mb-2' : 'text-xl mb-4'}`}>{title}</h2>
            <div className="overflow-y-auto flex-grow pr-2 space-y-2">
                {items.map(item => {
                    const cost = getCost(item);
                    const currentAmount = item.currency === 'stardust' ? currencies.stardust : currencies.nebulaGas;
                    const canAfford = currentAmount >= cost;
                    const ownedCount = getOwnedCount(item);
                    const Icon = item.icon;

                    return (
                        <div key={item.id} className={`purchase-item bg-purple-900/40 rounded-lg border border-purple-700/50 transition-all duration-200 ${isCompact ? 'p-2' : 'p-3'}`}>
                            <div className="flex justify-between items-center">
                                {Icon && !isCompact && (
                                    <div className="mr-3 text-purple-300">
                                       <Icon />
                                    </div>
                                )}
                                <div className="flex-1 mr-2">
                                    <h3 className={`font-bold text-purple-200 flex items-center gap-2 ${isCompact ? 'text-sm' : 'text-base'}`}>
                                        {Icon && isCompact && <Icon />}
                                        {getName(item)} 
                                        <span className="text-sm font-normal text-gray-400">({ownedCount})</span>
                                    </h3>
                                    {!isCompact && <p className="text-xs text-gray-400">{getDescription(item)}</p>}
                                    <p className={`effect text-green-400 ${isCompact ? 'text-xs' : 'text-sm'}`}>{getEffect(item)}</p>
                                </div>
                                <button
                                    onClick={() => onPurchase(item.id)}
                                    disabled={!canAfford}
                                    className={`purchase-btn flex items-center gap-2 rounded-md font-semibold transition-all duration-200 border ${isCompact ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'} ${
                                        canAfford 
                                        ? 'can-afford bg-purple-600 hover:bg-purple-500 border-purple-500 text-white shadow-md hover:shadow-purple-500/50' 
                                        : 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <CurrencyIcon currency={item.currency} />
                                    <span title={cost.toLocaleString()}>{formatNumber(cost)}</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default PurchasePanel;