import type { Upgrade, Generator, Milestone, GameState, ResearchItem, Spell, AscensionUpgrade, Challenge } from './types';
import { WandFlourishIcon, SummoningCharmIcon, GeminoCurseIcon, QuillIcon, PouchIcon, CauldronIcon, VaultIcon, AlembicIcon, LeprechaunHatIcon, RoomOfRequirementIcon, MerlinsLibraryIcon } from './components/icons';


export const LOCAL_STORAGE_KEY = 'cosmicClickerSave';
export const GAME_LOOP_INTERVAL = 100; // ms, for smoother UI updates
export const CHART_UPDATE_INTERVAL = 5000; // ms
export const MAX_CHART_POINTS = 100;
export const OFFLINE_PROGRESS_CAP_HOURS = 8;

export const STATS_CHART_INTERVAL = 2000; // ms
export const MAX_STATS_CHART_POINTS = 30; // 1 minute of data

// --- PRESTIGE & ASCENSION ---
export const PRESTIGE_REQUIREMENT = 1e15; // 1 Quadrillion stardust
export const ASCENSION_REQUIREMENT = 1e6; // 1 Million antimatter

export const INITIAL_MAX_MANA = 100;
export const MANA_REGEN_PER_SECOND = 1;

// --- DYNAMIC GAMEPLAY ---
export const CRITICAL_CLICK_CHANCE = 0.02; // 2%
export const CRITICAL_CLICK_MULTIPLIER = 10;
export const DYNAMIC_EVENT_CHANCE_PER_TICK = 0.005; // 0.5% chance every game loop tick (100ms)
export const DYNAMIC_EVENT_DURATION_MS = 15000; // 15 seconds
export const DYNAMIC_EVENT_REWARD_SPS_MULTIPLE = 60; // 60 seconds worth of stardust per second

export const FRENZY_CPM_THRESHOLD = 300; // Clicks Per Minute to activate frenzy
export const FRENZY_CPM_TIER_SIZE = 50; // Each 50 CPM above threshold increases multiplier
export const FRENZY_TIME_WINDOW_MS = 60000; // 1 minute window for CPM calculation

export const CLICK_COMBO_TIMEOUT_MS = 1000; // Max 1s between clicks to maintain combo
export const CLICK_COMBO_MULTIPLIER_PER_CLICK = 0.01; // +1% click power per combo point
export const CLICK_COMBO_MAX_COUNT = 100; // Max 100 combo points (+100% bonus)


export const INITIAL_UPGRADES: Upgrade[] = [
    {
        id: 'star-gatherer',
        nameKey: 'upgrades.star-gatherer.name',
        descriptionKey: 'upgrades.star-gatherer.description',
        level: 0,
        power: 1,
        baseCost: 10,
        costGrowth: 1.15,
        currency: 'stardust',
        icon: WandFlourishIcon,
    },
    {
        id: 'nebula-net',
        nameKey: 'upgrades.nebula-net.name',
        descriptionKey: 'upgrades.nebula-net.description',
        level: 0,
        power: 5,
        baseCost: 100,
        costGrowth: 1.2,
        currency: 'stardust',
        icon: SummoningCharmIcon,
    },
    {
        id: 'gravity-gloves',
        nameKey: 'upgrades.gravity-gloves.name',
        descriptionKey: 'upgrades.gravity-gloves.description',
        level: 0,
        power: 25,
        baseCost: 1000,
        costGrowth: 1.25,
        currency: 'stardust',
        icon: GeminoCurseIcon,
    },
];

export const INITIAL_GENERATORS: Generator[] = [
    // Early Game
    {
        id: 'asteroid-miner',
        nameKey: 'generators.asteroid-miner.name',
        descriptionKey: 'generators.asteroid-miner.description',
        count: 0,
        produces: 'stardust',
        basePayout: 5,
        baseChargeTime: 3,
        chargeTimer: 0,
        baseCost: 25,
        costGrowth: 1.1,
        currency: 'stardust',
        icon: QuillIcon,
    },
    {
        id: 'comet-catcher',
        nameKey: 'generators.comet-catcher.name',
        descriptionKey: 'generators.comet-catcher.description',
        count: 0,
        produces: 'stardust',
        basePayout: 60,
        baseChargeTime: 10,
        chargeTimer: 0,
        baseCost: 500,
        costGrowth: 1.15,
        currency: 'stardust',
        icon: PouchIcon,
    },
    {
        id: 'gas-harvester',
        nameKey: 'generators.gas-harvester.name',
        descriptionKey: 'generators.gas-harvester.description',
        count: 0,
        produces: 'nebulaGas',
        basePayout: 5,
        baseChargeTime: 15,
        chargeTimer: 0,
        baseCost: 1000,
        costGrowth: 1.2,
        currency: 'stardust',
        icon: CauldronIcon,
    },
    // Mid Game
    {
        id: 'dyson-sphere-fragment',
        nameKey: 'generators.dyson-sphere-fragment.name',
        descriptionKey: 'generators.dyson-sphere-fragment.description',
        count: 0,
        produces: 'stardust',
        basePayout: 500,
        baseChargeTime: 60,
        chargeTimer: 0,
        baseCost: 10000,
        costGrowth: 1.2,
        currency: 'stardust',
        icon: VaultIcon,
    },
    {
        id: 'nebula-refinery',
        nameKey: 'generators.nebula-refinery.name',
        descriptionKey: 'generators.nebula-refinery.description',
        count: 0,
        produces: 'nebulaGas',
        basePayout: 250,
        baseChargeTime: 120,
        chargeTimer: 0,
        baseCost: 5000,
        costGrowth: 1.25,
        currency: 'nebulaGas',
        icon: AlembicIcon,
    },
    {
        id: 'black-hole-harvester',
        nameKey: 'generators.black-hole-harvester.name',
        descriptionKey: 'generators.black-hole-harvester.description',
        count: 0,
        produces: 'stardust',
        basePayout: 10000,
        baseChargeTime: 300,
        chargeTimer: 0,
        baseCost: 250000,
        costGrowth: 1.25,
        currency: 'stardust',
        icon: LeprechaunHatIcon,
    },
    // Late Game (Post-Ascension)
    {
        id: 'reality-warper',
        nameKey: 'generators.reality-warper.name',
        descriptionKey: 'generators.reality-warper.description',
        count: 0,
        produces: 'stardust',
        basePayout: 1e12,
        baseChargeTime: 1800, // 30 mins
        chargeTimer: 0,
        baseCost: 1e21,
        costGrowth: 1.5,
        currency: 'stardust',
        icon: RoomOfRequirementIcon,
    },
    {
        id: 'universal-constructor',
        nameKey: 'generators.universal-constructor.name',
        descriptionKey: 'generators.universal-constructor.description',
        count: 0,
        produces: 'stardust',
        basePayout: 5e15,
        baseChargeTime: 7200, // 2 hours
        chargeTimer: 0,
        baseCost: 1e28,
        costGrowth: 1.6,
        currency: 'stardust',
        icon: MerlinsLibraryIcon,
    },
];

export const INITIAL_SPELLS: Spell[] = [
    {
        id: 'wizards-might',
        nameKey: 'spells.wizards-might.name',
        descriptionKey: 'spells.wizards-might.description',
        manaCost: 50,
        effect: {
            type: 'CLICK_POWER_BOOST',
            duration: 30, // seconds
            multiplier: 2,
        }
    },
    {
        id: 'temporal-haste',
        nameKey: 'spells.temporal-haste.name',
        descriptionKey: 'spells.temporal-haste.description',
        manaCost: 100,
        effect: {
            type: 'INSTANT_CHARGE',
        }
    }
];

export const INITIAL_MILESTONES: Milestone[] = [
    {
        id: 'stardust-1k',
        descriptionKey: 'milestones.stardust-1k.description',
        requirement: (state) => state.stardust >= 1000,
        rewardDescriptionKey: 'milestones.stardust-1k.reward',
        onComplete: (state) => ({ ...state, stardust: state.stardust + 100, milestones: { ...state.milestones, 'stardust-1k': true } }),
    },
    {
        id: 'sps-10',
        descriptionKey: 'milestones.sps-10.description',
        requirement: (state) => {
            const avgSps = state.generators.reduce((sps, gen) => sps + (gen.produces === 'stardust' ? (gen.count * gen.basePayout) / gen.baseChargeTime : 0), 0)
            return avgSps >= 10;
        },
        rewardDescriptionKey: 'milestones.sps-10.reward',
        onComplete: (state) => ({ ...state, milestones: { ...state.milestones, 'sps-10': true } }),
    },
    {
        id: 'first-prestige',
        descriptionKey: 'milestones.first-prestige.description',
        requirement: (state) => state.prestiges >= 1,
        rewardDescriptionKey: 'milestones.first-prestige.reward',
        onComplete: (state) => ({ ...state, milestones: { ...state.milestones, 'first-prestige': true } }),
    },
     {
        id: 'first-ascension',
        descriptionKey: 'milestones.first-ascension.description',
        requirement: (state) => state.ascensions >= 1,
        rewardDescriptionKey: 'milestones.first-ascension.reward',
        onComplete: (state) => ({ ...state, milestones: { ...state.milestones, 'first-ascension': true } }),
    },
];

export const INITIAL_RESEARCH_TREE: ResearchItem[] = [
    {
        id: 'basic-optics',
        nameKey: 'research.basic-optics.name',
        descriptionKey: 'research.basic-optics.description',
        cost: 100,
        dependencies: [],
        effect: { type: 'CLICK_POWER_MULTIPLIER', value: 0.1 },
    },
    {
        id: 'improved-miners',
        nameKey: 'research.improved-miners.name',
        descriptionKey: 'research.improved-miners.description',
        cost: 250,
        dependencies: [],
        effect: { type: 'GENERATOR_MULTIPLIER', generatorId: 'asteroid-miner', value: 0.25 },
    },
    {
        id: 'advanced-lensing',
        nameKey: 'research.advanced-lensing.name',
        descriptionKey: 'research.advanced-lensing.description',
        cost: 500,
        dependencies: ['basic-optics'],
        effect: { type: 'CLICK_POWER_MULTIPLIER', value: 0.2 },
    },
    {
        id: 'stellar-dynamics',
        nameKey: 'research.stellar-dynamics.name',
        descriptionKey: 'research.stellar-dynamics.description',
        cost: 1000,
        dependencies: ['improved-miners'],
        effect: { type: 'SPS_MULTIPLIER', value: 0.05 },
    },
    {
        id: 'self-casting-charm',
        nameKey: 'research.self-casting-charm.name',
        descriptionKey: 'research.self-casting-charm.description',
        cost: 5000,
        dependencies: ['advanced-lensing', 'stellar-dynamics'],
        effect: { type: 'UNLOCK_AUTOCLICKER' },
    }
];

export const INITIAL_ASCENSION_TREE: AscensionUpgrade[] = [
    {
        id: 'cosmic-start',
        nameKey: 'ascension.cosmic-start.name',
        descriptionKey: 'ascension.cosmic-start.description',
        cost: 1,
        dependencies: [],
        effect: { type: 'STARTING_STARDUST', value: 100 },
        position: { x: 50, y: 10 },
    },
    {
        id: 'alchemical-purity',
        nameKey: 'ascension.alchemical-purity.name',
        descriptionKey: 'ascension.alchemical-purity.description',
        cost: 2,
        dependencies: ['cosmic-start'],
        effect: { type: 'ANTIMATTER_GAIN_MULTIPLIER', value: 0.1 },
        position: { x: 30, y: 30 },
    },
    {
        id: 'scholarly-mind',
        nameKey: 'ascension.scholarly-mind.name',
        descriptionKey: 'ascension.scholarly-mind.description',
        cost: 2,
        dependencies: ['cosmic-start'],
        effect: { type: 'RESEARCH_POINTS_GAIN_MULTIPLIER', value: 0.2 },
        position: { x: 70, y: 30 },
    },
     {
        id: 'critical-thought',
        nameKey: 'ascension.critical-thought.name',
        descriptionKey: 'ascension.critical-thought.description',
        cost: 5,
        dependencies: ['alchemical-purity'],
        effect: { type: 'CRITICAL_CLICK_CHANCE_BOOST', value: 0.01 },
        position: { x: 30, y: 50 },
    },
];

export const INITIAL_CHALLENGES: Challenge[] = [
    {
        id: 'trial-of-silence',
        nameKey: 'challenges.trial-of-silence.name',
        descriptionKey: 'challenges.trial-of-silence.description',
        rewardKey: 'challenges.trial-of-silence.reward',
        handicap: { type: 'CLICK_POWER_CAP', value: 1 },
        reward: { type: 'FLAT_SPS_BOOST', value: 10 }, // A small but permanent flat boost
    },
    {
        id: 'trial-of-scarcity',
        nameKey: 'challenges.trial-of-scarcity.name',
        descriptionKey: 'challenges.trial-of-scarcity.description',
        rewardKey: 'challenges.trial-of-scarcity.reward',
        handicap: { type: 'SPS_REDUCTION', value: 0.75 }, // 75% reduction
        reward: { type: 'ANTIMATTER_GAIN_MULTIPLIER', value: 0.05 },
    }
];