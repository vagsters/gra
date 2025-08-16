import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { GameState, Upgrade, Generator, Milestone, ResearchItem, OfflineGains, ActiveSpellEffect, Challenge, AscensionUpgrade, FlyingResource } from './types';
import { INITIAL_UPGRADES, INITIAL_GENERATORS, INITIAL_MILESTONES, INITIAL_RESEARCH_TREE, LOCAL_STORAGE_KEY, GAME_LOOP_INTERVAL, PRESTIGE_REQUIREMENT, CHART_UPDATE_INTERVAL, MAX_CHART_POINTS, OFFLINE_PROGRESS_CAP_HOURS, INITIAL_SPELLS, INITIAL_MAX_MANA, MANA_REGEN_PER_SECOND, DYNAMIC_EVENT_CHANCE_PER_TICK, DYNAMIC_EVENT_DURATION_MS, DYNAMIC_EVENT_REWARD_SPS_MULTIPLE, ASCENSION_REQUIREMENT, INITIAL_ASCENSION_TREE, INITIAL_CHALLENGES, CRITICAL_CLICK_CHANCE, STATS_CHART_INTERVAL, MAX_STATS_CHART_POINTS, FRENZY_CPM_THRESHOLD, FRENZY_CPM_TIER_SIZE, FRENZY_TIME_WINDOW_MS, CLICK_COMBO_TIMEOUT_MS, CLICK_COMBO_MAX_COUNT, CLICK_COMBO_MULTIPLIER_PER_CLICK } from './constants';
import ResourceDisplay from './components/ResourceDisplay';
import Star from './components/Star';
import PurchasePanel from './components/PurchasePanel';
import WelcomeBackModal from './components/WelcomeBackModal';
import { ManagementTabs } from './components/SidePanels';
import DynamicEventComponent from './components/DynamicEvent';
import FlyingResourcesContainer from './components/FlyingResource';
import { ResetIcon } from './components/icons';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { downloadAnalyticsData } from './utils/analytics';
import LeftColumnPanel from './components/LeftColumnPanel';

const calculateOfflineGains = (savedState: GameState): OfflineGains | null => {
    if (!savedState.lastSaveTimestamp) return null;

    const now = Date.now();
    const timeDifferenceSeconds = (now - savedState.lastSaveTimestamp) / 1000;

    if (timeDifferenceSeconds < 60) return null;

    const cappedTimeSeconds = Math.min(timeDifferenceSeconds, OFFLINE_PROGRESS_CAP_HOURS * 3600);

    let gains = { stardust: 0, nebulaGas: 0, researchPoints: 0 };

    // This is a simplified simulation and doesn't account for bonuses.
    // A full simulation would be too complex for this structure.
    savedState.generators.forEach(gen => {
        if (gen.count > 0) {
            const cyclesCompleted = Math.floor((gen.chargeTimer + cappedTimeSeconds) / gen.baseChargeTime);
            const totalPayout = cyclesCompleted * gen.basePayout * gen.count;
            if (gen.produces === 'stardust') gains.stardust += totalPayout;
            else if (gen.produces === 'nebulaGas') gains.nebulaGas += totalPayout;
        }
    });
    
    const prestigeBonus = 1 + (savedState.antimatter * 0.02);
    const avgSps = savedState.generators.reduce((sps, gen) => {
        if (gen.produces === 'stardust') return sps + (gen.count * gen.basePayout) / gen.baseChargeTime;
        return sps;
    }, 0) * prestigeBonus;
    const researchPointsPerSecond = 1 + Math.log10(1 + avgSps);
    gains.researchPoints = researchPointsPerSecond * cappedTimeSeconds;


    return { ...gains, timeAwaySeconds: timeDifferenceSeconds };
};


const Game: React.FC = () => {
    const { t, setLanguage } = useLanguage();
    const [offlineGains, setOfflineGains] = useState<OfflineGains | null>(null);

    const [gameState, setGameState] = useState<GameState>(() => {
        const savedGame = localStorage.getItem(LOCAL_STORAGE_KEY);
        let initialState: GameState = {
            stardust: 0, nebulaGas: 0, antimatter: 0, researchPoints: 0, singularityEssence: 0,
            totalStardustEver: 0, prestiges: 0, ascensions: 0, mana: 0, maxMana: INITIAL_MAX_MANA,
            upgrades: INITIAL_UPGRADES, 
            generators: INITIAL_GENERATORS.map(g => ({...g, chargeTimer: 0})),
            spells: [], activeSpellEffects: [],
            milestones: {}, settings: { compactMode: false, language: 'en', theme: 'cosmic', autoCollectorActive: false },
            history: [], statsHistory: [], completedResearch: [], analytics: [], dynamicEvent: null, lastSaveTimestamp: 0,
            purchasedAscensionUpgrades: [], activeChallenge: null, completedChallenges: [],
            flyingResources: [],
            clickTimestamps: [],
            clickCombo: 0,
            lastClickTimestamp: 0,
        };

        if (savedGame) {
            try {
                const parsed = JSON.parse(savedGame) as GameState;
                initialState = {
                    ...initialState, // Start with defaults
                    ...parsed, // Overwrite with saved data
                    settings: { ...initialState.settings, ...parsed.settings },
                    generators: parsed.generators && parsed.generators.length > 0 ? parsed.generators.map(g => ({...g, chargeTimer: g.chargeTimer || 0})) : INITIAL_GENERATORS,
                    upgrades: parsed.upgrades && parsed.upgrades.length > 0 ? parsed.upgrades : INITIAL_UPGRADES,
                    dynamicEvent: null, // Do not persist
                    flyingResources: [], // Do not persist
                    statsHistory: [], // Do not persist
                    clickTimestamps: [], // Do not persist
                    clickCombo: 0, // Do not persist
                    lastClickTimestamp: 0, // Do not persist
                };
                
                if (initialState.prestiges > 0 && initialState.spells.length === 0) {
                    initialState.spells = INITIAL_SPELLS;
                }

                const gains = calculateOfflineGains(initialState);
                if(gains) {
                    setTimeout(() => setOfflineGains(gains), 100);
                }

            } catch (error) {
                console.error("Failed to parse saved game data:", error);
            }
        }
        return initialState;
    });
    
    const handleClaimOfflineGains = useCallback(() => {
        if (!offlineGains) return;
        setGameState(prev => {
            const newState = { ...prev };
            newState.stardust += offlineGains.stardust;
            newState.nebulaGas += offlineGains.nebulaGas;
            newState.researchPoints += offlineGains.researchPoints;
            newState.totalStardustEver += offlineGains.stardust;
            
            const cappedTimeSeconds = Math.min(offlineGains.timeAwaySeconds, OFFLINE_PROGRESS_CAP_HOURS * 3600);
            newState.generators = newState.generators.map(gen => {
                const newChargeTimer = (gen.chargeTimer + cappedTimeSeconds) % gen.baseChargeTime;
                return { ...gen, chargeTimer: newChargeTimer };
            });

            return newState;
        });
        setOfflineGains(null);
    }, [offlineGains]);

    useEffect(() => {
        setLanguage(gameState.settings.language);
    }, [gameState.settings.language, setLanguage]);

    const logEvent = useCallback((eventType: string, payload: object) => {
        setGameState(prev => ({
            ...prev,
            analytics: [...prev.analytics, { timestamp: Date.now(), eventType, payload }]
        }));
    }, []);
    
    // --- Bonus Calculations ---
    const researchBonuses = useMemo(() => {
        let bonuses = { clickPowerMultiplier: 1, spsMultiplier: 1, generatorMultipliers: {} as Record<string, number>, autoCollectorUnlocked: false };
        gameState.completedResearch.forEach(id => {
            const research = INITIAL_RESEARCH_TREE.find(r => r.id === id);
            if (research?.effect.type === 'CLICK_POWER_MULTIPLIER') bonuses.clickPowerMultiplier += research.effect.value;
            if (research?.effect.type === 'SPS_MULTIPLIER') bonuses.spsMultiplier += research.effect.value;
            if (research?.effect.type === 'GENERATOR_MULTIPLIER' && research.effect.generatorId) {
                bonuses.generatorMultipliers[research.effect.generatorId] = (bonuses.generatorMultipliers[research.effect.generatorId] || 1) + research.effect.value;
            }
            if (research?.effect.type === 'UNLOCK_AUTOCLICKER') bonuses.autoCollectorUnlocked = true;
        });
        return bonuses;
    }, [gameState.completedResearch]);
    
    const ascensionBonuses = useMemo(() => {
        let bonuses = { antimatterGainMultiplier: 1, criticalClickChanceBoost: 0, researchPointsGainMultiplier: 1 };
        gameState.purchasedAscensionUpgrades.forEach(id => {
            const upgrade = INITIAL_ASCENSION_TREE.find(u => u.id === id);
            if(upgrade?.effect.type === 'ANTIMATTER_GAIN_MULTIPLIER') bonuses.antimatterGainMultiplier += upgrade.effect.value;
            if(upgrade?.effect.type === 'CRITICAL_CLICK_CHANCE_BOOST') bonuses.criticalClickChanceBoost += upgrade.effect.value;
            if(upgrade?.effect.type === 'RESEARCH_POINTS_GAIN_MULTIPLIER') bonuses.researchPointsGainMultiplier += upgrade.effect.value;
        });
        return bonuses;
    }, [gameState.purchasedAscensionUpgrades]);

    const challengeBonuses = useMemo(() => {
        let bonuses = { spsMultiplier: 1, clickPowerCap: Infinity, costGrowthMultiplier: 1 };
        const challenge = INITIAL_CHALLENGES.find(c => c.id === gameState.activeChallenge);
        if(!challenge) return bonuses;

        if (challenge.handicap.type === 'SPS_REDUCTION') bonuses.spsMultiplier = 1 - challenge.handicap.value;
        if (challenge.handicap.type === 'CLICK_POWER_CAP') bonuses.clickPowerCap = challenge.handicap.value;
        if (challenge.handicap.type === 'COST_GROWTH_INCREASE') bonuses.costGrowthMultiplier = 1 + challenge.handicap.value;

        return bonuses;
    }, [gameState.activeChallenge]);
    
    const challengeRewardBonuses = useMemo(() => {
        let bonuses = { flatSpsBoost: 0, antimatterGainMultiplier: 1 };
         gameState.completedChallenges.forEach(id => {
            const challenge = INITIAL_CHALLENGES.find(c => c.id === id);
            if (challenge?.reward.type === 'FLAT_SPS_BOOST') bonuses.flatSpsBoost += challenge.reward.value;
            if (challenge?.reward.type === 'ANTIMATTER_GAIN_MULTIPLIER') bonuses.antimatterGainMultiplier += challenge.reward.value;
        });
        return bonuses;
    }, [gameState.completedChallenges]);

    const prestigeBonus = useMemo(() => 1 + (gameState.antimatter * 0.02), [gameState.antimatter]);

    const spellBonuses = useMemo(() => {
        const bonuses = { clickPowerMultiplier: 1 };
        gameState.activeSpellEffects.forEach(effect => {
            const spell = INITIAL_SPELLS.find(s => s.id === effect.spellId);
            if(spell?.effect.type === 'CLICK_POWER_BOOST') {
                bonuses.clickPowerMultiplier *= spell.effect.multiplier || 1;
            }
        });
        return bonuses;
    }, [gameState.activeSpellEffects]);
    
    const comboMultiplier = useMemo(() => 1 + gameState.clickCombo * CLICK_COMBO_MULTIPLIER_PER_CLICK, [gameState.clickCombo]);

    const cpmMultiplier = useMemo(() => {
        const cpm = gameState.clickTimestamps.length;
        if (cpm < FRENZY_CPM_THRESHOLD) return 1;
        const tier = Math.floor((cpm - FRENZY_CPM_THRESHOLD) / FRENZY_CPM_TIER_SIZE);
        return Math.pow(2, tier + 1);
    }, [gameState.clickTimestamps]);

    const clickPower = useMemo(() => {
        const basePower = gameState.upgrades.reduce((total, upgrade) => total + upgrade.level * upgrade.power, 1);
        const totalPower = basePower * prestigeBonus * researchBonuses.clickPowerMultiplier * spellBonuses.clickPowerMultiplier * cpmMultiplier * comboMultiplier;
        return Math.min(totalPower, challengeBonuses.clickPowerCap);
    }, [gameState.upgrades, prestigeBonus, researchBonuses, spellBonuses, cpmMultiplier, comboMultiplier, challengeBonuses.clickPowerCap]);

    const avgSps = useMemo(() => {
        const baseSps = gameState.generators.reduce((totals, gen) => {
            const generatorMultiplier = researchBonuses.generatorMultipliers[gen.id] || 1;
            if (gen.produces === 'stardust') {
                totals += (gen.count * gen.basePayout * generatorMultiplier) / gen.baseChargeTime;
            }
            return totals;
        }, 0);
        return (baseSps + challengeRewardBonuses.flatSpsBoost) * prestigeBonus * researchBonuses.spsMultiplier * challengeBonuses.spsMultiplier;
    }, [gameState.generators, researchBonuses, prestigeBonus, challengeRewardBonuses.flatSpsBoost, challengeBonuses.spsMultiplier]);

    const avgNgs = useMemo(() => {
        const baseNgs = gameState.generators.reduce((totals, gen) => {
            const generatorMultiplier = researchBonuses.generatorMultipliers[gen.id] || 1;
            if (gen.produces === 'nebulaGas') {
                totals += (gen.count * gen.basePayout * generatorMultiplier) / gen.baseChargeTime;
            }
            return totals;
        }, 0);
        return baseNgs * prestigeBonus * researchBonuses.spsMultiplier * challengeBonuses.spsMultiplier;
    }, [gameState.generators, researchBonuses, prestigeBonus, challengeBonuses.spsMultiplier]);


    const researchPointsPerSecond = useMemo(() => {
        const base = 1 + Math.log10(1 + avgSps);
        return base * ascensionBonuses.researchPointsGainMultiplier;
    }, [avgSps, ascensionBonuses]);

    // Main Game Loop
    useEffect(() => {
        const timer = setInterval(() => {
            setGameState(prev => {
                const now = Date.now();
                const intervalSeconds = GAME_LOOP_INTERVAL / 1000;
                let newState = { ...prev };
                
                newState.mana = prev.prestiges > 0 || prev.ascensions > 0 ? Math.min(prev.maxMana, prev.mana + MANA_REGEN_PER_SECOND * intervalSeconds) : 0;
                
                newState.activeSpellEffects = prev.activeSpellEffects
                    .map(effect => ({ ...effect, remainingDuration: effect.remainingDuration - intervalSeconds }))
                    .filter(effect => effect.remainingDuration > 0);

                newState.generators = prev.generators.map(gen => gen.count > 0 ? { ...gen, chargeTimer: Math.min(gen.baseChargeTime, gen.chargeTimer + intervalSeconds) } : gen);

                newState.researchPoints = prev.researchPoints + researchPointsPerSecond * intervalSeconds;
                
                newState.clickTimestamps = prev.clickTimestamps.filter(t => now - t < FRENZY_TIME_WINDOW_MS);
                
                if (newState.clickCombo > 0 && now - newState.lastClickTimestamp > CLICK_COMBO_TIMEOUT_MS) {
                    newState.clickCombo = 0;
                }

                // Auto-Collector Logic
                if (researchBonuses.autoCollectorUnlocked && newState.settings.autoCollectorActive) {
                    let stardustCollected = 0;
                    let nebulaGasCollected = 0;
                    const currentPrestigeBonus = 1 + (newState.antimatter * 0.02);
                    newState.generators = newState.generators.map(gen => {
                        if (gen.count > 0 && gen.chargeTimer >= gen.baseChargeTime) {
                            const payout = gen.basePayout * gen.count * currentPrestigeBonus;
                            if (gen.produces === 'stardust') stardustCollected += payout;
                            if (gen.produces === 'nebulaGas') nebulaGasCollected += payout;
                            return { ...gen, chargeTimer: 0 };
                        }
                        return gen;
                    });
                    if (stardustCollected > 0) {
                       newState.stardust += stardustCollected;
                       newState.totalStardustEver += stardustCollected;
                    }
                    if (nebulaGasCollected > 0) {
                        newState.nebulaGas += nebulaGasCollected;
                    }
                }


                if (newState.dynamicEvent && now - newState.dynamicEvent.createdAt > DYNAMIC_EVENT_DURATION_MS) {
                    newState.dynamicEvent = null;
                }
                if (!newState.dynamicEvent && Math.random() < DYNAMIC_EVENT_CHANCE_PER_TICK) {
                    newState.dynamicEvent = { id: now, createdAt: now, x: Math.random() * 80 + 10, y: Math.random() * 80 + 10, vx: (Math.random() - 0.5) * 20, vy: (Math.random() - 0.5) * 20 };
                }

                INITIAL_MILESTONES.forEach(milestone => {
                    if (!newState.milestones[milestone.id] && milestone.requirement(newState)) {
                         newState = milestone.onComplete(newState);
                         logEvent('MILESTONE_COMPLETED', { milestoneId: milestone.id });
                    }
                });

                return newState;
            });
        }, GAME_LOOP_INTERVAL);
        return () => clearInterval(timer);
    }, [researchPointsPerSecond, logEvent, researchBonuses.autoCollectorUnlocked]);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setGameState(prev => ({ ...prev, history: [...prev.history, { time: Date.now(), stardust: prev.stardust, nebulaGas: prev.nebulaGas }].slice(-MAX_CHART_POINTS) }));
        }, CHART_UPDATE_INTERVAL);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setGameState(prev => ({...prev, statsHistory: [...prev.statsHistory, { time: Date.now(), sps: avgSps }].slice(-MAX_STATS_CHART_POINTS) }));
        }, STATS_CHART_INTERVAL);
        return () => clearInterval(timer);
    }, [avgSps]);


    useEffect(() => {
        try {
            const stateToSave = { ...gameState, lastSaveTimestamp: Date.now() };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
        } catch (error) { console.error("Failed to save game data:", error); }
    }, [gameState]);
    
    // --- Handlers ---
    const handleStarClick = useCallback((power: number) => {
        const now = Date.now();
        setGameState(prev => {
             const isCombo = prev.lastClickTimestamp && (now - prev.lastClickTimestamp < CLICK_COMBO_TIMEOUT_MS);
             const newCombo = isCombo ? Math.min(prev.clickCombo + 1, CLICK_COMBO_MAX_COUNT) : 1;

            return { 
                ...prev, 
                stardust: prev.stardust + power, 
                totalStardustEver: prev.totalStardustEver + power,
                clickTimestamps: [...prev.clickTimestamps.filter(t => now - t < FRENZY_TIME_WINDOW_MS), now],
                clickCombo: newCombo,
                lastClickTimestamp: now,
            };
        });
    }, []);

    const handleDynamicEventClick = useCallback(() => {
        setGameState(prev => {
            if (!prev.dynamicEvent) return prev;
            const reward = avgSps * DYNAMIC_EVENT_REWARD_SPS_MULTIPLE;
            logEvent('DYNAMIC_EVENT_CLICKED', { reward });
            return { ...prev, stardust: prev.stardust + reward, totalStardustEver: prev.totalStardustEver + reward, dynamicEvent: null };
        });
    }, [avgSps, logEvent]);
    
    const handlePurchase = useCallback((itemId: string, itemType: 'upgrade' | 'generator') => {
        setGameState(prev => {
            const items = itemType === 'upgrade' ? prev.upgrades : prev.generators;
            const item = items.find(i => i.id === itemId);
            if (!item) return prev;

            const isUpgrade = 'level' in item;
            const count = isUpgrade ? item.level : (item as Generator).count;
            const costGrowth = item.costGrowth * (itemType === 'generator' ? challengeBonuses.costGrowthMultiplier : 1);
            const cost = item.baseCost * Math.pow(costGrowth, count);

            if ((item.currency === 'stardust' && prev.stardust < cost) || (item.currency === 'nebulaGas' && prev.nebulaGas < cost)) return prev;
            
            logEvent(`PURCHASE_${itemType.toUpperCase()}`, { itemId, cost, count: count + 1 });
            const newStardust = item.currency === 'stardust' ? prev.stardust - cost : prev.stardust;
            const newNebulaGas = item.currency === 'nebulaGas' ? prev.nebulaGas - cost : prev.nebulaGas;

            const newItems = items.map(i => i.id === itemId ? (isUpgrade ? { ...i, level: (i as Upgrade).level + 1 } : { ...i, count: (i as Generator).count + 1 }) : i);

            if (itemType === 'upgrade') return { ...prev, stardust: newStardust, nebulaGas: newNebulaGas, upgrades: newItems as Upgrade[] };
            return { ...prev, stardust: newStardust, nebulaGas: newNebulaGas, generators: newItems as Generator[] };
        });
    }, [challengeBonuses.costGrowthMultiplier, logEvent]);

    const handleCollectArtifact = useCallback((generatorId: string, startElement: HTMLElement) => {
        setGameState(prev => {
            const gen = prev.generators.find(g => g.id === generatorId);
            if (!gen || gen.chargeTimer < gen.baseChargeTime || gen.count === 0) return prev;
            const payout = gen.basePayout * gen.count * prestigeBonus;

            const rect = startElement.getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;
            
            const newFlyingResources: FlyingResource[] = [];
            for(let i=0; i < Math.min(5, Math.log10(payout)); i++){
                newFlyingResources.push({
                    id: Date.now() + Math.random(),
                    type: gen.produces,
                    startX: startX + (Math.random() - 0.5) * 20,
                    startY: startY + (Math.random() - 0.5) * 20,
                });
            }
            
            const newState: GameState = {
                ...prev,
                flyingResources: [...prev.flyingResources, ...newFlyingResources],
                generators: prev.generators.map(g => g.id === generatorId ? { ...g, chargeTimer: 0 } : g)
            };
            
            setTimeout(() => {
                setGameState(current => {
                    const latestState = { ...current };
                    if (gen.produces === 'stardust') {
                        latestState.stardust += payout;
                        latestState.totalStardustEver += payout;
                    } else if (gen.produces === 'nebulaGas') {
                        latestState.nebulaGas += payout;
                    }
                    return latestState;
                });
            }, 500); // Delay matches animation duration

            return newState;
        });
    }, [prestigeBonus]);
    
    const removeFlyingResource = useCallback((id: number) => {
        setGameState(prev => ({
            ...prev,
            flyingResources: prev.flyingResources.filter(r => r.id !== id),
        }));
    }, []);


    const handleCastSpell = useCallback((spellId: string) => {
        setGameState(prev => {
            const spell = INITIAL_SPELLS.find(s => s.id === spellId);
            if (!spell || prev.mana < spell.manaCost) return prev;
            
            let newState = { ...prev, mana: prev.mana - spell.manaCost };
            if(spell.effect.type === 'CLICK_POWER_BOOST') newState.activeSpellEffects = [ ...newState.activeSpellEffects.filter(e => e.spellId !== spellId), { spellId, remainingDuration: spell.effect.duration || 0 }];
            else if (spell.effect.type === 'INSTANT_CHARGE') newState.generators = newState.generators.map(g => ({ ...g, chargeTimer: g.baseChargeTime }));
            
            logEvent('CAST_SPELL', { spellId });
            return newState;
        });
    }, [logEvent]);
    
    const handlePrestige = useCallback(() => {
        if (gameState.totalStardustEver < PRESTIGE_REQUIREMENT) return;
        
        const baseGain = Math.floor(150 * Math.sqrt(gameState.totalStardustEver / 1e15));
        const antimatterGain = Math.floor(baseGain * challengeRewardBonuses.antimatterGainMultiplier * ascensionBonuses.antimatterGainMultiplier);
        
        if (antimatterGain <= 0) return;

        if (window.confirm(t('prestige.confirm', { antimatter: antimatterGain }))) {
             logEvent('PRESTIGE', { antimatterGain, totalStardust: gameState.totalStardustEver });
             setGameState(prev => ({
                ...prev, stardust: 0, nebulaGas: 0, researchPoints: 0, totalStardustEver: 0,
                prestiges: prev.prestiges + 1, antimatter: prev.antimatter + antimatterGain,
                upgrades: INITIAL_UPGRADES, generators: INITIAL_GENERATORS.map(g => ({...g, chargeTimer: 0})),
                mana: 0, spells: INITIAL_SPELLS, activeSpellEffects: [],
             }));
        }
    }, [gameState.totalStardustEver, t, logEvent, ascensionBonuses, challengeRewardBonuses]);
    
    const handleAscend = useCallback(() => {
        if(gameState.antimatter < ASCENSION_REQUIREMENT) return;
        const essenceGain = Math.floor(Math.sqrt(gameState.antimatter / 1000));
        if (essenceGain <= 0) return;

        if (window.confirm(t('ascension.confirm', { echoes: essenceGain }))) {
            logEvent('ASCEND', { essenceGain, antimatter: gameState.antimatter });
            setGameState(prev => ({
                ...prev,
                stardust: 0, nebulaGas: 0, antimatter: 0, researchPoints: 0, totalStardustEver: 0, prestiges: 0, mana: 0,
                ascensions: prev.ascensions + 1, singularityEssence: prev.singularityEssence + essenceGain,
                upgrades: INITIAL_UPGRADES, generators: INITIAL_GENERATORS.map(g => ({...g, chargeTimer: 0})),
                spells: [], activeSpellEffects: [], completedResearch: [],
                completedChallenges: prev.activeChallenge && !prev.completedChallenges.includes(prev.activeChallenge) ? [...prev.completedChallenges, prev.activeChallenge] : prev.completedChallenges,
                activeChallenge: null,
            }));
        }
    }, [gameState.antimatter, t, logEvent]);
    
    const handlePurchaseAscensionUpgrade = useCallback((upgradeId: string) => {
        setGameState(prev => {
            const upgrade = INITIAL_ASCENSION_TREE.find(u => u.id === upgradeId);
            if(!upgrade || prev.singularityEssence < upgrade.cost || prev.purchasedAscensionUpgrades.includes(upgradeId)) return prev;
            const depsMet = upgrade.dependencies.every(dep => prev.purchasedAscensionUpgrades.includes(dep));
            if(!depsMet) return prev;
            
            logEvent('PURCHASE_ASCENSION_UPGRADE', { upgradeId });
            return {
                ...prev,
                singularityEssence: prev.singularityEssence - upgrade.cost,
                purchasedAscensionUpgrades: [...prev.purchasedAscensionUpgrades, upgradeId],
            };
        });
    }, [logEvent]);

    const handleActivateChallenge = useCallback((challengeId: string | null) => {
        setGameState(prev => ({ ...prev, activeChallenge: challengeId }));
    }, []);

    const handlePurchaseResearch = useCallback((researchId: string) => {
        setGameState(prev => {
            const research = INITIAL_RESEARCH_TREE.find(r => r.id === researchId);
            if (!research || prev.completedResearch.includes(researchId) || prev.researchPoints < research.cost) return prev;
            const dependenciesMet = research.dependencies.every(dep => prev.completedResearch.includes(dep));
            if (!dependenciesMet) return prev;

            logEvent('PURCHASE_RESEARCH', { researchId, cost: research.cost });
            return { ...prev, researchPoints: prev.researchPoints - research.cost, completedResearch: [...prev.completedResearch, researchId] };
        });
    }, [logEvent]);

    const resetGame = () => {
        if (window.confirm(t('reset.confirm'))) {
            logEvent('GAME_RESET', {});
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            window.location.reload();
        }
    };
    
    const toggleCompactMode = useCallback(() => setGameState(p => ({ ...p, settings: { ...p.settings, compactMode: !p.settings.compactMode }})), []);
    const handleToggleAutoCollector = useCallback(() => setGameState(p => ({ ...p, settings: { ...p.settings, autoCollectorActive: !p.settings.autoCollectorActive }})), []);
    const handleLanguageChange = useCallback((lang: 'en' | 'pl') => setGameState(p => ({ ...p, settings: { ...p.settings, language: lang }})), []);
    const handleThemeChange = useCallback((theme: 'cosmic' | 'wizarding') => setGameState(p => ({...p, settings: {...p.settings, theme }})), []);

    const themeClass = gameState.settings.theme === 'wizarding' ? 'theme-wizarding' : '';

    return (
        <div className={`min-h-screen text-white font-sans flex flex-col items-center p-4 selection:bg-purple-500/50 ${themeClass} relative overflow-hidden`}>
            {offlineGains && <WelcomeBackModal gains={offlineGains} onClaim={handleClaimOfflineGains} />}
            {gameState.dynamicEvent && <DynamicEventComponent event={gameState.dynamicEvent} onClick={handleDynamicEventClick} theme={gameState.settings.theme} />}
            <FlyingResourcesContainer resources={gameState.flyingResources} onAnimationEnd={removeFlyingResource} />
            
            <header className="w-full max-w-7xl flex justify-between items-center p-4 bg-black/30 backdrop-blur-md rounded-xl border border-purple-500/30 shadow-lg shadow-purple-900/50 mb-4 z-10">
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">{t('title')}</h1>
                <ResourceDisplay {...gameState} researchPointsPerSecond={researchPointsPerSecond} />
            </header>
            
            <main className="w-full max-w-7xl flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 z-10">
                <div className="lg:col-span-1 flex flex-col gap-4">
                     <LeftColumnPanel
                        gameState={gameState}
                        onPurchase={(id) => handlePurchase(id, 'upgrade')}
                        clickPower={clickPower}
                        avgSps={avgSps}
                        avgNgs={avgNgs}
                        researchPointsPerSecond={researchPointsPerSecond}
                        critChance={CRITICAL_CLICK_CHANCE + ascensionBonuses.criticalClickChanceBoost}
                        cpmMultiplier={cpmMultiplier}
                        comboMultiplier={comboMultiplier}
                    />
                </div>

                <div className="lg:col-span-1 flex items-center justify-center">
                    <Star 
                        onStarClick={handleStarClick} 
                        clickPower={clickPower} 
                        critChance={CRITICAL_CLICK_CHANCE + ascensionBonuses.criticalClickChanceBoost}
                        cpmMultiplier={cpmMultiplier}
                        clickCombo={gameState.clickCombo}
                    />
                </div>

                <div className="lg:col-span-1 flex flex-col gap-4">
                    <ManagementTabs 
                        gameState={gameState} onPurchaseGenerator={(id) => handlePurchase(id, 'generator')}
                        onCollectArtifact={handleCollectArtifact} onCastSpell={handleCastSpell} onPrestige={handlePrestige}
                        onAscend={handleAscend} onActivateChallenge={handleActivateChallenge} onPurchaseAscensionUpgrade={handlePurchaseAscensionUpgrade}
                        onToggleCompact={toggleCompactMode} onLanguageChange={handleLanguageChange} onThemeChange={handleThemeChange}
                        onDownloadAnalytics={() => downloadAnalyticsData(gameState.analytics)} onPurchaseResearch={handlePurchaseResearch}
                        autoCollectorUnlocked={researchBonuses.autoCollectorUnlocked}
                        onToggleAutoCollector={handleToggleAutoCollector}
                    />
                </div>
            </main>

            <footer className="w-full max-w-7xl mt-4 flex justify-center z-10">
                 <button onClick={resetGame} className="flex items-center gap-2 px-4 py-2 bg-red-800/50 hover:bg-red-700/70 border border-red-500/50 rounded-lg transition-all duration-200 shadow-md hover:shadow-red-500/50">
                    <ResetIcon /> {t('reset.button')}
                 </button>
            </footer>
        </div>
    );
};

const App: React.FC = () => ( <LanguageProvider> <Game /> </LanguageProvider> );
export default App;