# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions use semantic versioning.

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