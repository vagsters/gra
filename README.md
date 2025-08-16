# Wizarding / Cosmic Clicker

A versatile incremental clicker game built with React and TypeScript, designed to be run completely offline from a single `index.html` file. The game is architected to be easily modifiable and features a theming system that can switch the entire experience from a space exploration adventure ("Cosmic") to a magical journey ("Wizarding").

## Project Overview

This is a classic incremental game where the player clicks to generate a primary currency. This currency can be spent on upgrades to increase click power and on generators that produce currency automatically. The game includes several layers of complexity, such as multiple currencies, a research system, milestones, and a prestige mechanic.

**Core Features:**

*   **Zero Dependencies:** Runs entirely in the browser from a single HTML file with no build step required.
*   **Offline First:** No backend is needed. Game state is saved automatically to the browser's Local Storage.
*   **Theming System:** Easily switch between a "Cosmic" and "Wizarding" theme, which changes visuals, text, and icons.
*   **Deep Gameplay Mechanics:** Features an interactive artifact system, a spellbook with active abilities, research, and a prestige system.
*   **Localization:** Support for multiple languages (English and Polish included) via a simple JSON-based system.
*   **Extensible by Design:** The core game data (upgrades, generators, research) is stored in a central `constants.ts` file, making it simple to add new content and balance the game.
*   **Offline Progress:** Calculates resources earned while the game was closed and rewards the player upon their return.

## Project Structure

*   **`index.html`**: The main entry point. It loads React, sets up the basic HTML structure, and contains all the CSS, including the logic for the theming system.
*   **`index.tsx`**: Mounts the main React application to the DOM.
*   **`App.tsx`**: The root component. It holds the main game state, contains the core game loop logic, and passes data and handlers down to child components.
*   **`types.ts`**: Contains all TypeScript type definitions for the game state and its various components (e.g., `Upgrade`, `Generator`, `GameState`).
*   **`constants.ts`**: The "source of truth" for game balance and content. All initial upgrades, generators, spells, and research items are defined here.
*   **`/components/`**: This directory contains all the reusable React components, including new ones like `ArtifactPanel.tsx` and `SpellbookPanel.tsx`.
*   **`/context/`**: Holds React Context providers.
*   **`/locales/`**: Contains the JSON files for localization.
*   **`/utils/`**: Contains utility functions.

## Core Concepts & Game Logic

### Game State (`types.ts` & `App.tsx`)

The entire state of the game is managed within a single `gameState` object in `App.tsx`. Its structure is defined by the `GameState` interface in `types.ts`. This object includes everything from currency amounts to purchased upgrades and settings. The state is automatically saved to Local Storage on every change and loaded when the app starts.

### Game Loop (`App.tsx`)

The core of the game's progression is a `setInterval` function inside a `useEffect` hook in `App.tsx`. Every 100 milliseconds, it performs the following actions:
*   Regenerates the player's Mana.
*   Increments the charge timer for each owned artifact.
*   Updates the duration of any active spell effects.
*   Calculates and adds passive Research Points.
*   Checks if any milestones have been met.

### Artifact Charge-Up System

Instead of providing a constant stream of income ("per second"), artifacts now operate on a charge-and-collect cycle, making the game more interactive.
*   **Logic:** Each artifact has a `chargeTime` and a `payout`. The game loop fills a `chargeTimer`. Once the timer is full, the artifact holds its payout value.
*   **Interaction:** The player must manually click a "Collect" button on the artifact to receive the resources. This resets the timer.
*   **Balance:** More expensive and powerful artifacts have a larger payout but also a longer charge time, creating strategic choices for the player.

### Spellbook & Mana System

Unlocked after the first prestige, the Spellbook adds a new layer of active gameplay.
*   **Mana:** A new resource that regenerates automatically over time.
*   **Spells:** Players can spend Mana to cast powerful, temporary spells. Examples include boosting click power or instantly charging all artifacts.
*   **UI:** A dedicated "Spellbook" tab shows current Mana, a list of learned spells, their costs, and effects.

### Offline Progress (Time-Turner)

The game calculates offline progress based on the new charge-up mechanic.
*   **Logic:** When the game loads, it calculates how many full charge cycles each artifact would have completed during the time away.
*   **Simulation:** It sums the payouts from all these simulated collections and presents them to the player in a "Welcome Back" modal. Offline progress is capped to encourage regular play.

---

## How to Develop and Modify the Game

### Getting Started

Since this project has no build step, you can run it by simply opening the `index.html` file in a modern web browser.

### How to Add a New Artifact (Generator)

1.  **Define the Artifact in `constants.ts`**:
    Open `constants.ts` and add a new object to the `INITIAL_GENERATORS` array.

    ```typescript
    {
        id: 'philosophers-egg',
        nameKey: 'generators.philosophers-egg.name',
        descriptionKey: 'generators.philosophers-egg.description',
        count: 0,
        produces: 'stardust',
        basePayout: 50000, // Generates a large sum
        baseChargeTime: 600, // Takes 10 minutes to charge
        chargeTimer: 0,
        baseCost: 1e6,
        costGrowth: 1.3,
        currency: 'stardust',
    },
    ```

2.  **Add Translations in `/locales/`**:
    Open `en.json` and `pl.json` to add the corresponding text.

    *   In `en.json`:
        ```json
        "generators.philosophers-egg.name": "Philosopher's Egg",
        "generators.philosophers-egg.description": "A miniature alchemical reactor that transmutes air into gold.",
        ```
    *   In `pl.json`:
        ```json
        "generators.philosophers-egg.name": "Jajo Filozoficzne",
        "generators.philosophers-egg.description": "Miniaturowy reaktor alchemiczny, który przemienia powietrze w złoto.",
        ```

That's it! The new artifact will appear in the game with its charge bar and collect button, fully functional.

### How to Add a New Spell

1.  **Define the Spell in `constants.ts`**:
    Open `constants.ts` and add a new object to the `INITIAL_SPELLS` array.

    ```typescript
    {
        id: 'mana-infusion',
        nameKey: 'spells.mana-infusion.name',
        descriptionKey: 'spells.mana-infusion.description',
        manaCost: 75,
        effect: {
            type: '...YOUR_NEW_EFFECT_TYPE...',
            // ... effect parameters
        }
    }
    ```

2.  **Add Translations in `/locales/`**:
    Add the name and description keys to the language files.

3.  **Implement the Effect Logic in `App.tsx`**:
    In the `handleCastSpell` function, add a `case` for your new effect type (`YOUR_NEW_EFFECT_TYPE`). This is where you will modify the `gameState` to apply the spell's effect. If the effect is temporary, you will also need to handle its logic in the main game loop's `activeSpellEffects` section.
