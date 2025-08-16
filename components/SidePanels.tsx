import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import type { GameState, Generator, Milestone, Language, Theme } from '../types';
import { INITIAL_MILESTONES, PRESTIGE_REQUIREMENT, ASCENSION_REQUIREMENT, INITIAL_CHALLENGES, INITIAL_ASCENSION_TREE } from '../constants';
import ArtifactPanel from './ArtifactPanel';
import ResearchPanel from './ResearchPanel';
import SpellbookPanel from './SpellbookPanel';
import AscensionTreePanel from './AscensionTreePanel';
import { GeneratorIcon, MilestoneIcon, ChartIcon, SettingsIcon, PrestigeIcon, AntimatterIcon, ResearchIcon, DownloadIcon, SpellbookIcon, AscensionIcon, SingularityEssenceIcon } from './icons';
import { useLanguage } from '../context/LanguageContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Tab = 'generators' | 'milestones' | 'research' | 'charts' | 'settings' | 'spellbook' | 'prestige' | 'ascension';

interface ManagementTabsProps {
    gameState: GameState;
    onPurchaseGenerator: (id: string) => void;
    onCollectArtifact: (id: string, element: HTMLElement) => void;
    onCastSpell: (id: string) => void;
    onPrestige: () => void;
    onAscend: () => void;
    onActivateChallenge: (id: string | null) => void;
    onPurchaseAscensionUpgrade: (id: string) => void;
    onToggleCompact: () => void;
    onLanguageChange: (lang: Language) => void;
    onThemeChange: (theme: Theme) => void;
    onDownloadAnalytics: () => void;
    onPurchaseResearch: (id: string) => void;
    autoCollectorUnlocked: boolean;
    onToggleAutoCollector: () => void;
}

const TabButton: React.FC<{ icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void, disabled?: boolean, tooltip?: string }> = ({ icon, label, isActive, onClick, disabled = false, tooltip }) => (
    <button 
        onClick={onClick} 
        disabled={disabled}
        title={disabled ? tooltip : undefined}
        className={`tab-button flex-1 flex flex-col items-center justify-center p-2 text-xs transition-colors duration-200 border-b-2 relative group ${
            isActive 
                ? 'active text-purple-300 border-purple-400' 
                : disabled 
                ? 'text-gray-600 border-transparent cursor-not-allowed'
                : 'text-gray-400 hover:text-white border-transparent hover:bg-white/5'
        }`}
    >
        {icon}
        <span>{label}</span>
        {disabled && tooltip && (
            <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30">
                {tooltip}
            </div>
        )}
    </button>
);

const MilestonesPanel: React.FC<{ milestones: Record<string, boolean>, isCompact: boolean }> = ({ milestones, isCompact }) => {
    const { t } = useLanguage();
    return (
        <div className="p-4 space-y-2 overflow-y-auto">
            {INITIAL_MILESTONES.map(m => (
                <div key={m.id} className={`p-3 rounded-lg border transition-all duration-300 ${milestones[m.id] ? 'bg-green-900/50 border-green-500/50' : 'bg-gray-800/50 border-gray-600/50'}`}>
                    <p className={isCompact ? 'text-sm' : ''}>{t(m.descriptionKey)}</p>
                    <p className={`font-semibold ${isCompact ? 'text-xs' : 'text-sm'} ${milestones[m.id] ? 'text-green-300' : 'text-yellow-400'}`}>{milestones[m.id] ? `${t('milestones.completed')}: ${t(m.rewardDescriptionKey)}` : `${t('milestones.reward')}: ${t(m.rewardDescriptionKey)}`}</p>
                </div>
            ))}
        </div>
    );
};

const ChartsPanel: React.FC<{ history: GameState['history'] }> = ({ history }) => {
    const { t } = useLanguage();
    const chartData = useMemo(() => ({
        labels: history.map(p => new Date(p.time).toLocaleTimeString()),
        datasets: [
            {
                label: t('charts.stardust'),
                data: history.map(p => p.stardust),
                borderColor: 'rgb(250, 204, 21)',
                backgroundColor: 'rgba(250, 204, 21, 0.5)',
                yAxisID: 'y',
            },
            {
                label: t('charts.nebulaGas'),
                data: history.map(p => p.nebulaGas),
                borderColor: 'rgb(244, 114, 182)',
                backgroundColor: 'rgba(244, 114, 182, 0.5)',
                yAxisID: 'y1',
            },
        ],
    }), [history, t]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { ticks: { color: '#9ca3af' } },
            y: { type: 'linear' as const, display: true, position: 'left' as const, ticks: { color: '#facc15' } },
            y1: { type: 'linear' as const, display: true, position: 'right' as const, ticks: { color: '#f472b6' }, grid: { drawOnChartArea: false } },
        },
        plugins: { legend: { labels: { color: '#d1d5db' } } }
    };

    return <div className="p-4 h-full"><Line options={options} data={chartData} /></div>;
};

const SettingsPanel: React.FC<{ gameState: GameState; onToggleCompact: () => void; onLanguageChange: (lang: Language) => void; onThemeChange: (theme: Theme) => void; onDownloadAnalytics: () => void; }> = ({ gameState, onToggleCompact, onLanguageChange, onThemeChange, onDownloadAnalytics }) => {
    const { t } = useLanguage();
    const { settings } = gameState;
    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <label htmlFor="compactMode" className="text-gray-300">{t('settings.compactMode')}</label>
                <button onClick={onToggleCompact} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings.compactMode ? 'bg-purple-600' : 'bg-gray-600'}`}>
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.compactMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
            <div className="flex items-center justify-between">
                <label className="text-gray-300">{t('settings.language')}</label>
                <div className="flex gap-2">
                    <button onClick={() => onLanguageChange('en')} className={`px-3 py-1 text-sm rounded ${settings.language === 'en' ? 'bg-purple-600 text-white' : 'bg-gray-600'}`}>EN</button>
                    <button onClick={() => onLanguageChange('pl')} className={`px-3 py-1 text-sm rounded ${settings.language === 'pl' ? 'bg-purple-600 text-white' : 'bg-gray-600'}`}>PL</button>
                </div>
            </div>
             <div className="flex items-center justify-between">
                <label className="text-gray-300">{t('settings.theme')}</label>
                <div className="flex gap-2">
                    <button onClick={() => onThemeChange('cosmic')} className={`px-3 py-1 text-sm rounded ${settings.theme === 'cosmic' ? 'bg-purple-600 text-white' : 'bg-gray-600'}`}>{t('settings.theme.cosmic')}</button>
                    <button onClick={() => onThemeChange('wizarding')} className={`px-3 py-1 text-sm rounded ${settings.theme === 'wizarding' ? 'bg-purple-600 text-white' : 'bg-gray-600'}`}>{t('settings.theme.wizarding')}</button>
                </div>
            </div>
             <div className="pt-4 border-t border-purple-500/20">
                 <button onClick={onDownloadAnalytics} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-800/50 hover:bg-teal-700/70 border border-teal-500/50 rounded-lg transition-all duration-200">
                    <DownloadIcon /> {t('settings.downloadAnalytics')}
                </button>
            </div>
        </div>
    );
};

const PrestigeAscensionPanel: React.FC<{ gameState: GameState; onPrestige: () => void; onAscend: () => void; onActivateChallenge: (id: string | null) => void }> = ({ gameState, onPrestige, onAscend, onActivateChallenge }) => {
    const { t } = useLanguage();
    const { totalStardustEver, antimatter, activeChallenge, completedChallenges } = gameState;

    const canPrestige = totalStardustEver >= PRESTIGE_REQUIREMENT;
    const antimatterGain = canPrestige ? Math.floor(150 * Math.sqrt(totalStardustEver / 1e15)) : 0;
    
    const canAscend = antimatter >= ASCENSION_REQUIREMENT;
    const singularityEssenceGain = canAscend ? Math.floor(Math.sqrt(antimatter / 1000)) : 0;

    return (
        <div className="p-4 text-center flex flex-col items-center justify-center h-full overflow-y-auto">
            {/* Prestige Section */}
            <div className="w-full">
                <PrestigeIcon />
                <h3 className="text-lg font-bold mt-2">{t('prestige.title')}</h3>
                <p className="text-sm text-gray-400 mt-2">{t('prestige.description', { requirement: PRESTIGE_REQUIREMENT.toExponential() })}</p>
                {canPrestige ? (
                    <div className="mt-4">
                        <p className="text-green-400">{t('prestige.canPrestige')}</p>
                        <button onClick={onPrestige} className="mt-2 flex items-center justify-center w-full sm:w-auto mx-auto gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-600 border border-purple-500 rounded-lg transition-all duration-200 shadow-md hover:shadow-purple-500/50">
                            {t('prestige.button')} <AntimatterIcon /> {antimatterGain.toLocaleString()}
                        </button>
                    </div>
                ) : (
                    <p className="mt-4 text-red-400">{t('prestige.cannotPrestige')}</p>
                )}
            </div>
            
            {/* Ascension Section */}
            {canAscend && (
                <div className="w-full mt-8 pt-6 border-t border-purple-500/30">
                     <AscensionIcon />
                    <h3 className="text-xl font-bold mt-2 text-purple-300">{t('ascension.title')}</h3>
                    <p className="text-sm text-gray-400 mt-2">{t('ascension.description', { requirement: ASCENSION_REQUIREMENT.toLocaleString() })}</p>
                    <button onClick={onAscend} className="mt-4 flex items-center justify-center w-full sm:w-auto mx-auto gap-2 px-4 py-2 bg-fuchsia-700 hover:bg-fuchsia-600 border border-fuchsia-500 rounded-lg transition-all duration-200 shadow-lg hover:shadow-fuchsia-500/50">
                        {t('ascension.button')} <SingularityEssenceIcon /> {singularityEssenceGain.toLocaleString()}
                    </button>
                    
                    {/* Challenges Section */}
                    <div className="mt-8">
                        <h4 className="text-lg font-bold text-teal-300">{t('challenges.title')}</h4>
                        <div className="space-y-2 mt-2 text-left">
                           {INITIAL_CHALLENGES.map(challenge => {
                                const isCompleted = completedChallenges.includes(challenge.id);
                                const isActive = activeChallenge === challenge.id;
                                return (
                                    <div key={challenge.id} className={`p-3 rounded-lg border ${isCompleted ? 'bg-green-900/30 border-green-700/50' : 'bg-gray-800/40 border-gray-600/50'}`}>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-bold">{t(challenge.nameKey)}</p>
                                                <p className="text-xs text-gray-400">{t(challenge.descriptionKey)}</p>
                                                <p className={`text-xs ${isCompleted ? 'text-green-300' : 'text-yellow-400'}`}>{t('challenges.reward_prefix')}: {t(challenge.rewardKey)}</p>
                                            </div>
                                            <button 
                                                onClick={() => onActivateChallenge(isActive ? null : challenge.id)}
                                                disabled={isCompleted}
                                                className={`text-xs px-3 py-1 rounded transition-colors ${isCompleted ? 'bg-green-700 cursor-default' : isActive ? 'bg-red-600 hover:bg-red-500' : 'bg-teal-600 hover:bg-teal-500'}`}
                                            >
                                                {isCompleted ? t('challenges.completed') : isActive ? 'Deactivate' : t('challenges.activate')}
                                            </button>
                                        </div>
                                    </div>
                                )
                           })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export const ManagementTabs: React.FC<ManagementTabsProps> = (props) => {
    const { gameState, onPurchaseGenerator, onCollectArtifact, onCastSpell, onPrestige, onAscend, onActivateChallenge, onPurchaseAscensionUpgrade, onToggleCompact, onLanguageChange, onThemeChange, onDownloadAnalytics, onPurchaseResearch, autoCollectorUnlocked, onToggleAutoCollector } = props;
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<Tab>('generators');
    
    const isPrestiged = gameState.prestiges > 0 || gameState.ascensions > 0;
    const isAscended = gameState.ascensions > 0;

    const renderContent = () => {
        switch (activeTab) {
            case 'generators':
                return <ArtifactPanel gameState={gameState} onPurchase={onPurchaseGenerator} onCollect={onCollectArtifact} autoCollectorUnlocked={autoCollectorUnlocked} onToggleAutoCollector={onToggleAutoCollector} />;
            case 'milestones':
                return <MilestonesPanel milestones={gameState.milestones} isCompact={gameState.settings.compactMode} />;
            case 'research':
                return <ResearchPanel gameState={gameState} onPurchaseResearch={onPurchaseResearch} />;
            case 'charts':
                return <ChartsPanel history={gameState.history} />;
            case 'settings':
                return <SettingsPanel gameState={gameState} onToggleCompact={onToggleCompact} onLanguageChange={onLanguageChange} onThemeChange={onThemeChange} onDownloadAnalytics={onDownloadAnalytics} />;
            case 'spellbook':
                 return isPrestiged ? <SpellbookPanel gameState={gameState} onCastSpell={onCastSpell} /> : null;
            case 'prestige':
                 return isPrestiged ? <PrestigeAscensionPanel gameState={gameState} onPrestige={onPrestige} onAscend={onAscend} onActivateChallenge={onActivateChallenge} /> : null;
            case 'ascension':
                 return isAscended ? <AscensionTreePanel gameState={gameState} onPurchase={onPurchaseAscensionUpgrade} /> : null;
        }
    }
    
    return (
        <div className="panel bg-black/30 backdrop-blur-md rounded-xl border border-purple-500/30 shadow-lg shadow-purple-900/50 h-full flex flex-col">
            <div className="tab-bar flex border-b border-purple-500/30 overflow-x-auto">
                <TabButton icon={<GeneratorIcon />} label={t('tabs.generators')} isActive={activeTab === 'generators'} onClick={() => setActiveTab('generators')} />
                <TabButton 
                    icon={<SpellbookIcon />} 
                    label={t('tabs.spellbook')} 
                    isActive={activeTab === 'spellbook'} 
                    onClick={() => { if(isPrestiged) setActiveTab('spellbook')}} 
                    disabled={!isPrestiged}
                    tooltip={t('spellbook.unlock_tooltip')}
                />
                 <TabButton 
                    icon={<PrestigeIcon />} 
                    label={t('tabs.prestige')} 
                    isActive={activeTab === 'prestige'} 
                    onClick={() => { if(isPrestiged) setActiveTab('prestige')}} 
                    disabled={!isPrestiged}
                    tooltip={t('spellbook.unlock_tooltip')}
                />
                 <TabButton 
                    icon={<AscensionIcon />} 
                    label={t('tabs.ascension')} 
                    isActive={activeTab === 'ascension'} 
                    onClick={() => { if(isAscended) setActiveTab('ascension')}} 
                    disabled={!isAscended}
                    tooltip={t('ascension.unlock_tooltip', { requirement: ASCENSION_REQUIREMENT.toLocaleString() })}
                />
                <TabButton icon={<ResearchIcon />} label={t('tabs.research')} isActive={activeTab === 'research'} onClick={() => setActiveTab('research')} />
                <TabButton icon={<MilestoneIcon />} label={t('tabs.milestones')} isActive={activeTab === 'milestones'} onClick={() => setActiveTab('milestones')} />
                <TabButton icon={<ChartIcon />} label={t('tabs.charts')} isActive={activeTab === 'charts'} onClick={() => setActiveTab('charts')} />
                <TabButton icon={<SettingsIcon />} label={t('tabs.settings')} isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
            </div>
            <div className="flex-grow overflow-hidden relative">
                <div key={activeTab} className="tab-content w-full h-full">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}