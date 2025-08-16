import React, { useState, useEffect, useRef } from 'react';
import { StardustIcon, ClockIcon, NebulaGasIcon, AntimatterIcon, ResearchIcon, SingularityEssenceIcon } from './icons';
import { useLanguage } from '../context/LanguageContext';

interface ResourceDisplayProps {
    stardust: number;
    nebulaGas: number;
    antimatter: number;
    researchPoints: number;
    singularityEssence: number;
    researchPointsPerSecond: number;
}

const formatNumber = (num: number, precision: number = 2): string => {
    if (num < 1000) return num.toFixed(precision).replace(/\.00$/, '');
    const suffixes = ["", "k", "M", "B", "T", "q", "Q", "s", "S", "o", "n", "d"];
    const i = Math.floor(Math.log10(num) / 3);
    if (i >= suffixes.length) return num.toExponential(2);
    const shortNum = (num / Math.pow(1000, i));
    return shortNum.toFixed(precision) + suffixes[i];
};

const usePrevious = <T,>(value: T): T | undefined => {
    const ref = useRef<T | undefined>(undefined);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

const AnimatedResource: React.FC<{ value: number, id: string }> = ({ value, id }) => {
    const [isPopping, setIsPopping] = useState(false);
    const prevValue = usePrevious(value);

    useEffect(() => {
        if (prevValue !== undefined && value > prevValue) {
            setIsPopping(true);
            const timer = setTimeout(() => setIsPopping(false), 300);
            return () => clearTimeout(timer);
        }
    }, [value, prevValue]);
    
    return (
        <span id={id} className={`font-bold text-lg transition-transform duration-300 ${isPopping ? 'resource-pop' : ''}`}>
            {formatNumber(value)}
        </span>
    );
}

const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ stardust, nebulaGas, antimatter, researchPoints, singularityEssence, researchPointsPerSecond }) => {
    const { t } = useLanguage();
    
    return (
        <div className="flex flex-col items-end text-sm md:text-base resource-display">
            <div className="flex flex-wrap items-center justify-end gap-4">
                 {singularityEssence > 0 && (
                    <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded-full border border-purple-400/50" title={`${singularityEssence.toLocaleString()} ${t('resources.singularityEssence')}`}>
                        <SingularityEssenceIcon />
                        <span className="font-bold text-lg text-purple-300">{formatNumber(singularityEssence)}</span>
                    </div>
                 )}
                 {antimatter > 0 && (
                    <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-500/50" title={`${antimatter.toLocaleString()} ${t('resources.antimatter')}`}>
                        <AntimatterIcon />
                        <span className="font-bold text-lg text-cyan-300">{formatNumber(antimatter)}</span>
                    </div>
                 )}
                 <div className="flex items-center gap-2 bg-teal-900/50 px-3 py-1 rounded-full border border-teal-500/50" title={`${researchPoints.toLocaleString()} ${t('resources.researchPoints')}`}>
                    <ResearchIcon />
                    <AnimatedResource value={researchPoints} id="resource-researchPoints" />
                </div>
                 <div className="flex items-center gap-2 bg-indigo-900/50 px-3 py-1 rounded-full border border-indigo-500/50" title={`${nebulaGas.toLocaleString()} ${t('resources.nebulaGas')}`}>
                    <NebulaGasIcon />
                    <AnimatedResource value={nebulaGas} id="resource-nebulaGas" />
                </div>
                <div className="flex items-center gap-2 bg-purple-900/50 px-3 py-1 rounded-full border border-purple-500/50" title={`${stardust.toLocaleString()} ${t('resources.stardust')}`}>
                    <StardustIcon />
                    <AnimatedResource value={stardust} id="resource-stardust" />
                </div>
            </div>
            <div className="flex items-center gap-4 mt-1">
                 <div className="flex items-center gap-2 text-teal-300 rate">
                    <ClockIcon />
                    <span title={`${researchPointsPerSecond.toLocaleString()} ${t('resources.perSecond')}`}>{formatNumber(researchPointsPerSecond, 2)} {t('resources.rps')}</span>
                </div>
            </div>
        </div>
    );
};

export default ResourceDisplay;