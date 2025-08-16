export type Currency = 'stardust' | 'nebulaGas' | 'researchPoints';
export type Language = 'en' | 'pl';
export type Theme = 'cosmic' | 'wizarding';

export interface PurchaseableItem {
  id: string;
  nameKey: string;
  descriptionKey: string;
  baseCost: number;
  costGrowth: number;
  currency: 'stardust' | 'nebulaGas';
  icon?: React.ComponentType;
}

export interface Upgrade extends PurchaseableItem {
  level: number;
  power: number; // Stardust per click
}

export interface Generator extends PurchaseableItem {
  count: number;
  produces: 'stardust' | 'nebulaGas';
  basePayout: number;
  baseChargeTime: number; // in seconds
  chargeTimer: number;
}

export interface Milestone {
    id: string;
    descriptionKey: string;
    requirement: (state: GameState) => boolean;
    rewardDescriptionKey: string;
    onComplete: (state: GameState) => GameState;
}

export type ResearchEffect = 
  | { type: 'CLICK_POWER_MULTIPLIER'; value: number }
  | { type: 'SPS_MULTIPLIER'; value: number }
  | { type: 'GENERATOR_MULTIPLIER'; generatorId: string; value: number }
  | { type: 'UNLOCK_AUTOCLICKER' };

export interface ResearchItem {
    id: string;
    nameKey: string;
    descriptionKey: string;
    cost: number; // in Research Points
    dependencies: string[];
    effect: ResearchEffect;
}

export interface Spell {
    id:string;
    nameKey: string;
    descriptionKey: string;
    manaCost: number;
    effect: {
        type: 'CLICK_POWER_BOOST' | 'INSTANT_CHARGE';
        duration?: number; // in seconds
        multiplier?: number;
    };
}

export interface ActiveSpellEffect {
    spellId: string;
    remainingDuration: number; // in seconds
}

export interface AnalyticsEvent {
    timestamp: number;
    eventType: string;
    payload: object;
}

export interface OfflineGains {
    stardust: number;
    nebulaGas: number;
    researchPoints: number;
    timeAwaySeconds: number;
}

export interface DynamicEvent {
  id: number;
  createdAt: number;
  x: number; // %
  y: number; // %
  vx: number; // velocity % per second
  vy: number; // velocity % per second
}

export type AscensionUpgradeEffect =
    | { type: 'FLAT_SPS_BOOST'; value: number }
    | { type: 'ANTIMATTER_GAIN_MULTIPLIER'; value: number }
    | { type: 'STARTING_UPGRADE_LEVEL'; upgradeId: string; value: number }
    | { type: 'STARTING_STARDUST'; value: number }
    | { type: 'CRITICAL_CLICK_CHANCE_BOOST'; value: number }
    | { type: 'RESEARCH_POINTS_GAIN_MULTIPLIER'; value: number };

export interface AscensionUpgrade {
    id: string;
    nameKey: string;
    descriptionKey: string;
    cost: number; // In Singularity Essence
    dependencies: string[];
    effect: AscensionUpgradeEffect;
    position: { x: number; y: number }; // For rendering the tree
}

export type ChallengeHandicap =
    | { type: 'CLICK_POWER_CAP'; value: number }
    | { type: 'SPS_REDUCTION'; value: number }
    | { type: 'COST_GROWTH_INCREASE'; value: number };

export interface Challenge {
    id: string;
    nameKey: string;
    descriptionKey: string;
    rewardKey: string;
    handicap: ChallengeHandicap;
    reward: AscensionUpgradeEffect; // Re-use the effect type for simplicity
}

export interface FlyingResource {
    id: number;
    type: 'stardust' | 'nebulaGas' | 'researchPoints';
    startX: number;
    startY: number;
}

export interface GameState {
  stardust: number;
  nebulaGas: number;
  antimatter: number;
  researchPoints: number;
  totalStardustEver: number;
  prestiges: number;

  singularityEssence: number;
  ascensions: number;
  
  mana: number;
  maxMana: number;
  
  upgrades: Upgrade[];
  generators: Generator[];
  spells: Spell[];
  activeSpellEffects: ActiveSpellEffect[];

  milestones: Record<string, boolean>;
  
  completedResearch: string[];
  purchasedAscensionUpgrades: string[];
  
  activeChallenge: string | null;
  completedChallenges: string[];

  dynamicEvent: DynamicEvent | null;
  flyingResources: FlyingResource[];
  clickTimestamps: number[];
  
  clickCombo: number;
  lastClickTimestamp: number;

  settings: {
    compactMode: boolean;
    language: Language;
    theme: Theme;
    autoCollectorActive: boolean;
  };
  
  history: { time: number; stardust: number; nebulaGas: number }[];
  statsHistory: { time: number; sps: number }[];
  analytics: AnalyticsEvent[];
  lastSaveTimestamp: number;
}