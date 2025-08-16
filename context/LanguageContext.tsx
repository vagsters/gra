import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import type { Language } from '../types';

const allTranslations = {
    en: {
    "title": "Wizarding Clicker",

    "resources.stardust": "Galleons",
    "resources.nebulaGas": "Essence of Magic",
    "resources.antimatter": "Philosopher's Stone Shards",
    "resources.researchPoints": "House Points",
    "resources.mana": "Mana",
    "resources.singularityEssence": "Echoes of Magic",
    "resources.sps": "GP/s",
    "resources.rps": "HP/s",
    "resources.perSecond": "per second",

    "upgrades.title": "Spell Practice",
    "upgrades.effect": "+{power} Galleons/cast",
    "upgrades.star-gatherer.name": "Basic Wand Flourish",
    "upgrades.star-gatherer.description": "A simple flick of the wrist that magically produces a Galleon.",
    "upgrades.nebula-net.name": "Summoning Charm",
    "upgrades.nebula-net.description": "Accio Galleons! A more effective way to acquire currency.",
    "upgrades.gravity-gloves.name": "Gemino Curse",
    "upgrades.gravity-gloves.description": "A charm that causes Galleons to multiply upon being conjured.",

    "generators.title": "Enchanted Artifacts",
    "generators.payout": "Payout",
    "generators.charge_time": "Charge Time",
    "generators.collect": "Collect",
    "generators.auto_collect_toggle": "Auto-Collector",
    "generators.sps": "+{rate} GPS",
    "generators.ngs": "+{rate} EMS",
    "generators.asteroid-miner.name": "Self-Writing Quill",
    "generators.asteroid-miner.description": "Dips itself in ink and writes deposit slips for Gringotts.",
    "generators.comet-catcher.name": "Mokeskin Pouch",
    "generators.comet-catcher.description": "An enchanted pouch that constantly finds misplaced Galleons.",
    "generators.gas-harvester.name": "Cauldron of Plenty",
    "generators.gas-harvester.description": "A magical cauldron that slowly brews Essence of Magic.",
    "generators.dyson-sphere-fragment.name": "Gringotts Vault",
    "generators.dyson-sphere-fragment.description": "A personal vault that accrues interest from the Goblin bank.",
    "generators.nebula-refinery.name": "Alchemist's Alembic",
    "generators.nebula-refinery.description": "Distills ambient magic into a potent Essence of Magic.",
    "generators.black-hole-harvester.name": "Leprechaun's Hat",
    "generators.black-hole-harvester.description": "This hat seems to be an endless source of enchanted gold.",
    "generators.reality-warper.name": "The Room of Requirement",
    "generators.reality-warper.description": "A room that becomes whatever you need... in this case, a treasury.",
    "generators.universal-constructor.name": "Merlin's Lost Library",
    "generators.universal-constructor.description": "Contains forgotten lore that generates immense, unimaginable wealth.",

    "milestones.completed": "✓ COMPLETED",
    "milestones.reward": "Reward",
    "milestones.stardust-1k.description": "Accumulate 1,000 Galleons.",
    "milestones.stardust-1k.reward": "Gain 100 Galleons.",
    "milestones.sps-10.description": "Achieve an average of 10 Galleons per second.",
    "milestones.sps-10.reward": "Your name appears in the Daily Prophet.",
    "milestones.first-prestige.description": "Create a Philosopher's Stone for the first time.",
    "milestones.first-prestige.reward": "Unlock the secrets of alchemy.",
    "milestones.first-ascension.description": "Become a Legend for the first time.",
    "milestones.first-ascension.reward": "Your magical signature echoes through eternity.",

    "research.title": "Hogwarts Studies",
    "research.cost": "Cost: {cost} HP",
    "research.requires": "Requires: {deps}",
    "research.basic-optics.name": "First Year Charms",
    "research.basic-optics.description": "Increases spell casting power by 10%.",
    "research.improved-miners.name": "Advanced Quill Enchanting",
    "research.improved-miners.description": "Increases Self-Writing Quill production by 25%.",
    "research.advanced-lensing.name": "Advanced Transfiguration",
    "research.advanced-lensing.description": "Increases spell casting power by an additional 20%.",
    "research.stellar-dynamics.name": "Ancient Runes",
    "research.stellar-dynamics.description": "Increases all Galleon production by 5%.",
    "research.self-casting-charm.name": "Self-Casting Charm",
    "research.self-casting-charm.description": "Enchants your artifacts to collect their rewards automatically.",

    "charts.stardust": "Galleons",
    "charts.nebulaGas": "Essence of Magic",

    "prestige.title": "Alchemy",
    "prestige.description": "Reset your magical progress to create a Philosopher's Stone. Requires at least {requirement} total Galleons.",
    "prestige.confirm": "Are you sure you want to perform the Great Work for {antimatter} Philosopher's Stone Shards? This will reset your Galleons, Essence of Magic, House Points, Spells and Artifacts, but you will keep your achievements and gain a permanent boost to Galleon production.",
    "prestige.canPrestige": "You can now perform the Great Work!",
    "prestige.cannotPrestige": "You have not gathered enough wealth to begin.",
    "prestige.button": "Create for",

    "ascension.title": "Become a Legend",
    "ascension.description": "Sacrifice your alchemical progress to transcend. This will reset everything, including Philosopher's Stone Shards, in exchange for Echoes of Magic. Requires {requirement} Shards.",
    "ascension.confirm": "Are you sure you want to Ascend? Your legend will echo through time, granting {echoes} Echoes of Magic, but all current progress, including Shards, will be lost to history.",
    "ascension.button": "Ascend for",
    "ascension.unlock_tooltip": "Become a Legend. Requires {requirement} Philosopher's Stone Shards.",

    "ascension_tree.title": "Legendary Feats",
    "ascension.cosmic-start.name": "Head Start",
    "ascension.cosmic-start.description": "Begin each new run with 100 Galleons.",
    "ascension.alchemical-purity.name": "Alchemical Purity",
    "ascension.alchemical-purity.description": "Gain 10% more Philosopher's Stone Shards from Alchemy.",
    "ascension.scholarly-mind.name": "Scholarly Mind",
    "ascension.scholarly-mind.description": "Gain 20% more House Points.",
    "ascension.critical-thought.name": "Critical Thought",
    "ascension.critical-thought.description": "Increases Critical Cast chance by 1%.",

    "challenges.title": "Trials of Magic",
    "challenges.activate": "Activate",
    "challenges.active": "Active",
    "challenges.completed": "✓ Completed",
    "challenges.reward_prefix": "Reward",
    "challenges.trial-of-silence.name": "Trial of Silence",
    "challenges.trial-of-silence.description": "Handicap: Your manual spellcasting power is permanently capped at 1.",
    "challenges.trial-of-silence.reward": "Permanently gain +10 Galleons per second.",
    "challenges.trial-of-scarcity.name": "Trial of Scarcity",
    "challenges.trial-of-scarcity.description": "Handicap: All Galleon production from all sources is reduced by 75%.",
    "challenges.trial-of-scarcity.reward": "Permanently gain 5% more Philosopher's Stone Shards.",
    
    "settings.compactMode": "Compact Mode",
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.theme.cosmic": "Cosmic",
    "settings.theme.wizarding": "Wizarding",
    "settings.downloadAnalytics": "Download Owl Post",

    "tabs.generators": "Artifacts",
    "tabs.milestones": "Achievements",
    "tabs.research": "Studies",
    "tabs.charts": "Ledger",
    "tabs.settings": "Options",
    "tabs.spellbook": "Spellbook",
    "tabs.prestige": "Alchemy",
    "tabs.ascension": "Legends",

    "spellbook.title": "Spellbook",
    "spellbook.locked": "Your knowledge of the arcane is not yet sufficient to open this book.",
    "spellbook.unlock_tooltip": "Unlock by creating a Philosopher's Stone",
    "spellbook.cast": "Cast",
    "spellbook.cost": "Cost",

    "spells.wizards-might.name": "Wizard's Might",
    "spells.wizards-might.description": "Doubles your casting power for 30 seconds.",
    "spells.temporal-haste.name": "Temporal Haste",
    "spells.temporal-haste.description": "Instantly finishes charging all of your artifacts.",

    "offline.title": "Welcome Back!",
    "offline.description": "While you were away for {time}, your enchanted artifacts have been hard at work!",
    "offline.claim": "Claim Rewards",

    "reset.button": "Break the Elder Wand",
    "reset.confirm": "Are you sure you want to break the wand? This will reset ALL your progress, including Philosopher's Stone Shards and Achievements, and cannot be undone.",

    "stats.title": "Wizard's Almanac",
    "stats.gps": "Galleons/sec",
    "stats.ngs": "Essence/sec",
    "stats.rps": "House Points/sec",
    "stats.click_power": "Casting Power",
    "stats.crit_chance": "Critical Chance",
    "stats.click_frenzy": "Click Frenzy",
    "stats.combo_bonus": "Combo Bonus",

    "star.frenzy_active": "FRENZY! x{multiplier}",
    "star.combo_display": "x{combo} Combo!"
},
    pl: {
    "title": "Magiczny Kliker",

    "resources.stardust": "Galeony",
    "resources.nebulaGas": "Esencja Magii",
    "resources.antimatter": "Odłamki Kamienia Filozoficznego",
    "resources.researchPoints": "Punkty Domów",
    "resources.mana": "Mana",
    "resources.singularityEssence": "Echa Magii",
    "resources.sps": "GN/s",
    "resources.rps": "PD/s",
    "resources.perSecond": "na sekundę",

    "upgrades.title": "Ćwiczenie Zaklęć",
    "upgrades.effect": "+{power} Galeonów/rzut",
    "upgrades.star-gatherer.name": "Proste Machnięcie Różdżką",
    "upgrades.star-gatherer.description": "Prosty ruch nadgarstka, który magicznie tworzy Galeona.",
    "upgrades.nebula-net.name": "Zaklęcie Przywołujące",
    "upgrades.nebula-net.description": "Accio Galeony! Bardziej efektywny sposób na zdobywanie waluty.",
    "upgrades.gravity-gloves.name": "Klątwa Gemino",
    "upgrades.gravity-gloves.description": "Urok, który sprawia, że Galeony mnożą się po ich wyczarowaniu.",

    "generators.title": "Zaczarowane Artefakty",
    "generators.payout": "Przychód",
    "generators.charge_time": "Czas ładowania",
    "generators.collect": "Zbierz",
    "generators.auto_collect_toggle": "Automatyczny Zbieracz",
    "generators.sps": "+{rate} GN/s",
    "generators.ngs": "+{rate} EM/s",
    "generators.asteroid-miner.name": "Samopiszące Pióro",
    "generators.asteroid-miner.description": "Samo macza się w atramencie i wypisuje dowody wpłaty dla Gringotta.",
    "generators.comet-catcher.name": "Sakiewka ze Skóry Kreta",
    "generators.comet-catcher.description": "Zaczarowana sakiewka, która nieustannie odnajduje zgubione Galeony.",
    "generators.gas-harvester.name": "Kociołek Obfitości",
    "generators.gas-harvester.description": "Magiczny kociołek, który powoli warzy Esencję Magii.",
    "generators.dyson-sphere-fragment.name": "Skrytka w Banku Gringotta",
    "generators.dyson-sphere-fragment.description": "Osobista skrytka, która gromadzi odsetki z banku Goblinów.",
    "generators.nebula-refinery.name": "Alembik Alchemika",
    "generators.nebula-refinery.description": "Destyluje otaczającą magię w potężną Esencję Magii.",
    "generators.black-hole-harvester.name": "Kapelusz Leprokonusa",
    "generators.black-hole-harvester.description": "Ten kapelusz wydaje się być niewyczerpanym źródłem zaczarowanego złota.",
    "generators.reality-warper.name": "Pokój Życzeń",
    "generators.reality-warper.description": "Pokój, który staje się tym, czego potrzebujesz... w tym przypadku, skarbcem.",
    "generators.universal-constructor.name": "Zaginiona Biblioteka Merlina",
    "generators.universal-constructor.description": "Zawiera zapomnianą wiedzę, która generuje ogromne, niewyobrażalne bogactwo.",

    "milestones.completed": "✓ UKOŃCZONO",
    "milestones.reward": "Nagroda",
    "milestones.stardust-1k.description": "Zgromadź 1 000 Galeonów.",
    "milestones.stardust-1k.reward": "Zyskaj 100 Galeonów.",
    "milestones.sps-10.description": "Osiągnij średnio 10 Galeonów na sekundę.",
    "milestones.sps-10.reward": "Twoje imię pojawia się w Proroku Codziennym.",
    "milestones.first-prestige.description": "Stwórz Kamień Filozoficzny po raz pierwszy.",
    "milestones.first-prestige.reward": "Odkryj sekrety alchemii.",
    "milestones.first-ascension.description": "Zostań Legendą po raz pierwszy.",
    "milestones.first-ascension.reward": "Twoja magiczna sygnatura rozbrzmiewa przez wieczność.",

    "research.title": "Nauka w Hogwarcie",
    "research.cost": "Koszt: {cost} PD",
    "research.requires": "Wymaga: {deps}",
    "research.basic-optics.name": "Zaklęcia Pierwszego Roku",
    "research.basic-optics.description": "Zwiększa moc rzucania zaklęć o 10%.",
    "research.improved-miners.name": "Zaawansowane Zaklinanie Piór",
    "research.improved-miners.description": "Zwiększa produkcję Samopiszącego Pióra o 25%.",
    "research.advanced-lensing.name": "Zaawansowana Transmutacja",
    "research.advanced-lensing.description": "Zwiększa moc rzucania zaklęć o dodatkowe 20%.",
    "research.stellar-dynamics.name": "Starożytne Runy",
    "research.stellar-dynamics.description": "Zwiększa całą produkcję Galeonów o 5%.",
    "research.self-casting-charm.name": "Urok Samoczynnego Rzucania",
    "research.self-casting-charm.description": "Zaklina twoje artefakty, aby automatycznie zbierały swoje nagrody.",

    "charts.stardust": "Galeony",
    "charts.nebulaGas": "Esencja Magii",

    "prestige.title": "Alchemia",
    "prestige.description": "Zresetuj swój magiczny postęp, aby stworzyć Kamień Filozoficzny. Wymaga co najmniej {requirement} całkowitej liczby Galeonów.",
    "prestige.confirm": "Czy na pewno chcesz przeprowadzić Wielkie Dzieło za {antimatter} Odłamków Kamienia Filozoficznego? Spowoduje to zresetowanie Galeonów, Esencji Magii, Punktów Domów, Zaklęć i Artefaktów, ale zachowasz swoje osiągnięcia i zyskasz trwałe wzmocnienie produkcji Galeonów.",
    "prestige.canPrestige": "Możesz teraz przeprowadzić Wielkie Dzieło!",
    "prestige.cannotPrestige": "Nie zebrałeś wystarczająco dużo bogactwa, aby rozpocząć.",
    "prestige.button": "Stwórz za",
    
    "ascension.title": "Zostań Legendą",
    "ascension.description": "Poświęć swój alchemiczny postęp, by dokonać transcendencji. Zresetuje to wszystko, łącznie z Odłamkami Kamienia Filozoficznego, w zamian za Echa Magii. Wymaga {requirement} Odłamków.",
    "ascension.confirm": "Czy na pewno chcesz dokonać Ascendencji? Twoja legenda będzie rozbrzmiewać w czasie, dając {echoes} Ech Magii, ale cały obecny postęp, włączając Odłamki, zostanie utracony w historii.",
    "ascension.button": "Awansuj za",
    "ascension.unlock_tooltip": "Zostań Legendą. Wymaga {requirement} Odłamków Kamienia Filozoficznego.",

    "ascension_tree.title": "Legendarne Czyny",
    "ascension.cosmic-start.name": "Lepszy Start",
    "ascension.cosmic-start.description": "Rozpocznij każdą nową grę ze 100 Galeonami.",
    "ascension.alchemical-purity.name": "Alchemiczna Czystość",
    "ascension.alchemical-purity.description": "Zyskaj 10% więcej Odłamków Kamienia Filozoficznego z Alchemii.",
    "ascension.scholarly-mind.name": "Umysł Uczonego",
    "ascension.scholarly-mind.description": "Zyskaj 20% więcej Punktów Domów.",
    "ascension.critical-thought.name": "Krytyczne Myślenie",
    "ascension.critical-thought.description": "Zwiększa szansę na Krytyczne Rzucenie zaklęcia o 1%.",
    
    "challenges.title": "Próby Magii",
    "challenges.activate": "Aktywuj",
    "challenges.active": "Aktywna",
    "challenges.completed": "✓ Ukończono",
    "challenges.reward_prefix": "Nagroda",
    "challenges.trial-of-silence.name": "Próba Ciszy",
    "challenges.trial-of-silence.description": "Utrudnienie: Twoja ręczna moc rzucania zaklęć jest na stałe ograniczona do 1.",
    "challenges.trial-of-silence.reward": "Na stałe zyskaj +10 Galeonów na sekundę.",
    "challenges.trial-of-scarcity.name": "Próba Niedostatku",
    "challenges.trial-of-scarcity.description": "Utrudnienie: Cała produkcja Galeonów ze wszystkich źródeł jest zmniejszona o 75%.",
    "challenges.trial-of-scarcity.reward": "Na stałe zyskaj 5% więcej Odłamków Kamienia Filozoficznego.",

    "settings.compactMode": "Tryb Kompaktowy",
    "settings.language": "Język",
    "settings.theme": "Motyw",
    "settings.theme.cosmic": "Kosmiczny",
    "settings.theme.wizarding": "Magiczny",
    "settings.downloadAnalytics": "Pobierz Pocztę Sową",

    "tabs.generators": "Artefakty",
    "tabs.milestones": "Osiągnięcia",
    "tabs.research": "Nauka",
    "tabs.charts": "Rejestr",
    "tabs.settings": "Opcje",
    "tabs.spellbook": "Księga Zaklęć",
    "tabs.prestige": "Alchemia",
    "tabs.ascension": "Legendy",

    "spellbook.title": "Księga Zaklęć",
    "spellbook.locked": "Twoja wiedza o magii jest niewystarczająca, by otworzyć tę księgę.",
    "spellbook.unlock_tooltip": "Odblokuj, tworząc Kamień Filozoficzny",
    "spellbook.cast": "Rzuć",
    "spellbook.cost": "Koszt",

    "spells.wizards-might.name": "Potęga Maga",
    "spells.wizards-might.description": "Podwaja twoją moc rzucania zaklęć na 30 sekund.",
    "spells.temporal-haste.name": "Przyspieszenie Czasu",
    "spells.temporal-haste.description": "Natychmiast kończy ładowanie wszystkich twoich artefaktów.",

    "offline.title": "Witaj z powrotem!",
    "offline.description": "Podczas twojej nieobecności przez {time}, twoje zaczarowane artefakty ciężko pracowały!",
    "offline.claim": "Odbierz Nagrody",

    "reset.button": "Złam Czarną Różdżkę",
    "reset.confirm": "Czy na pewno chcesz złamać różdżkę? Spowoduje to zresetowanie CAŁEGO postępu, w tym Odłamków Kamienia Filozoficznego i Osiągnięć, i nie będzie można tego cofnąć.",

    "stats.title": "Almanach Czarodzieja",
    "stats.gps": "Galeony/s",
    "stats.ngs": "Esencja/s",
    "stats.rps": "Punkty Domów/s",
    "stats.click_power": "Moc Rzucania",
    "stats.crit_chance": "Szansa Krytyczna",
    "stats.click_frenzy": "Szał Klikania",
    "stats.combo_bonus": "Premia za Combo",

    "star.frenzy_active": "SZAŁ! x{multiplier}",
    "star.combo_display": "x{combo} Combo!"
    }
};


interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    const t = useCallback((key: string, replacements: Record<string, string | number> = {}) => {
        const translationsForCurrentLang = allTranslations[language];
        let translation = (translationsForCurrentLang as Record<string, string>)[key] || key;
        
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
        });

        return translation;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};