# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions use semantic versioning.

## [Unreleased]

### Added
- Main Lobby screen with Start Game, Settings, How to Play, and Exit buttons, shown when the app opens.
- `useNavigation` hook for screen navigation, separate from game logic.
- How to Play rules screen, Settings placeholder, and Exit farewell screen.
- Functional Settings screen with an Audio section (Master, BGM, and SFX volume sliders plus a Mute/Unmute switch) and a reserved Gameplay / Visual section for upcoming theme options.
- Global settings state in `src/settings/` (`SettingsProvider`, `useSettings`, `getEffectiveVolume`); values are validated and persisted to `localStorage`, falling back to defaults if storage is unavailable or corrupt.
- Reusable settings UI: `SettingsSection`, `VolumeSlider`, and `ToggleSwitch`.
- "Menu utama" button in the game screen to return to the lobby.

### Changed
- Game UI moved from `App` into `GameScreen`; gameplay behavior is unchanged.

## [0.4.0] - 2026-09-29 - Phase 4

### Added
- Bot personas for Rizky, Bagas, and Davin, each with a distinct chat style.
- Contextual reactions for ladder climbs, snake bites, rolling a six, entering the final stretch, and winning.
- A WhatsApp-style group chat with author names, timestamps, typing indicators, message input, and automatic scrolling.

### Changed
- Game events now flow from `useGame` to `useAutoChat`, which queues bot reactions and displays each after a typing delay.

### Fixed
- Queued bot reactions are displayed sequentially so typing indicators and messages do not overwrite one another.

## [0.3.0] - 2026-09-29 - Phase 3

### Added
- A four-player roster: the human player and three automated opponents.
- Automatic bot turns with a 1.5-2 second thinking delay and a visible turn indicator.
- A one-time extra roll after a six for both human and bot turns.

### Changed
- Game state now tracks each player's position, active turn, and winner.

### Fixed
- Dice input is blocked while a player is moving, preventing overlapping rolls.

## [0.2.0] - 2026-09-29 - Phase 2

### Added
- Visual markers and connections for the snakes and ladders defined in `boardData.js`.
- Step-by-step pawn movement and automatic snake or ladder resolution.
- A bonus roll when a player rolls a six.

### Changed
- The board now displays the player's pawn on its current square instead of only showing a position counter.

### Fixed
- Player movement is capped at square 100 so a roll cannot move a pawn beyond the board.

## [0.1.0] - 2026-09-29 - Phase 1

### Added
- A React and Vite project with Tailwind CSS and WhatsApp-inspired color tokens.
- The initial 100-square board, dice and reset controls, chat placeholders, and starter game engine and hook.
- A feature-oriented source layout for components, data, engine logic, hooks, and styles.

### Changed
- The default Vite starter screen was replaced with the initial Snake and Ladder game screen.

### Fixed
- Removed starter-template imports and content that did not belong to the game.