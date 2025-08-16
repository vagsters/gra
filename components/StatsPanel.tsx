import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';
import { useLanguage } from '../context/LanguageContext';
import { StardustIcon, NebulaGasIcon, ResearchIcon, ClickIcon, CritChanceIcon, FrenzyIcon, ComboIcon } from './icons';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

interface StatsPanelProps {
    statsHistory: { time: number; sps: number }[];
    avgSps: number;
    avgNgs: number;
    researchPointsPerSecond: number;
    clickPower: number;
    critChance: number;
    cpmMultiplier: number;
    comboMultiplier: number;
    isCompact: boolean;
}

const formatNumber = (num: number, precision: number = 2): string => {
    if (num < 1000) return num.toFixed(precision).replace(/\.00$/, '');
    const suffixes = ["", "k", "M", "B", "T", "q", "Q", "s", "S", "o", "n", "d"];
    const i = Math.floor(Math.log10(num) / 3);
    if (i >= suffixes.length) return num.toExponential(2);
    const shortNum = (num / Math.pow(1000, i));
    return shortNum.toFixed(precision) + suffixes[i];
};

const StatItem: React.FC<{ icon: React.ReactNode; label: string; value: string; isCompact: boolean; className?: string }> = ({ icon, label, value, isCompact, className = '' }) => (
    <div className={`flex items-center gap-2 bg-purple-900/30 p-2 rounded-md ${className}`}>
        <div className="text-purple-300">{icon}</div>
        <div className="flex-1">
            {!isCompact && <p className="text-xs text-gray-400">{label}</p>}
            <p className="font-bold text-sm text-white">{value}</p>
        </div>
    </div>
);

const StatsPanel: React.FC<StatsPanelProps> = ({ statsHistory, avgSps, avgNgs, researchPointsPerSecond, clickPower, critChance, cpmMultiplier, comboMultiplier, isCompact }) => {
    const { t } = useLanguage();

    const chartData = useMemo(() => ({
        labels: statsHistory.map(p => new Date(p.time).toLocaleTimeString()),
        datasets: [
            {
                label: t('stats.gps'),
                data: statsHistory.map(p => p.sps),
                borderColor: 'rgba(250, 204, 21, 0.7)',
                backgroundColor: 'rgba(250, 204, 21, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
            },
        ],
    }), [statsHistory, t]);

    const chartOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { display: false },
            y: {
                display: false,
                beginAtZero: true,
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: false,
            },
        },
        animation: {
            duration: 200,
        },
    }), []);


    return (
        <div className={`panel ${isCompact ? 'p-2' : 'p-4'}`}>
            <h2 className={`font-bold text-center text-purple-300 ${isCompact ? 'text-lg mb-2' : 'text-xl mb-3'}`}>{t('stats.title')}</h2>
            
            <div className={`grid gap-2 ${isCompact ? 'grid-cols-3' : 'grid-cols-2'}`}>
                <StatItem icon={<StardustIcon />} label={t('stats.gps')} value={formatNumber(avgSps)} isCompact={isCompact} />
                <StatItem icon={<NebulaGasIcon />} label={t('stats.ngs')} value={formatNumber(avgNgs)} isCompact={isCompact} />
                <StatItem icon={<ResearchIcon />} label={t('stats.rps')} value={formatNumber(researchPointsPerSecond)} isCompact={isCompact} />
                <StatItem icon={<ClickIcon />} label={t('stats.click_power')} value={formatNumber(clickPower)} isCompact={isCompact} />
                <StatItem icon={<CritChanceIcon />} label={t('stats.crit_chance')} value={`${(critChance * 100).toFixed(1)}%`} isCompact={isCompact} />
                {comboMultiplier > 1 && (
                     <StatItem icon={<ComboIcon />} label={t('stats.combo_bonus')} value={`+${((comboMultiplier - 1) * 100).toFixed(0)}%`} isCompact={isCompact} className="bg-cyan-900/50" />
                )}
                {cpmMultiplier > 1 && (
                     <StatItem icon={<FrenzyIcon />} label={t('stats.click_frenzy')} value={`x${cpmMultiplier}`} isCompact={isCompact} className="bg-red-900/50" />
                )}
            </div>

            <div className="mt-3 h-16">
                 <Line options={chartOptions as any} data={chartData} />
            </div>
        </div>
    );
};

export default StatsPanel;