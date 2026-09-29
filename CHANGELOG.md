# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions use semantic versioning.

## [Unreleased]

### Added
- Nama kustom: nama pemain utama dan ketiga bot (Rizky, Bagas, Davin) bisa diubah di layar "Siapkan Permainan" maupun Settings lewat `NameCustomizer` (dengan bidak di samping tiap kolom). Kolom yang dikosongkan memakai nama bawaan ("Kamu", "Rizky", "Bagas", "Davin"), maksimal 16 karakter, dan ada peringatan lunak bila ada nama kembar. Nama dipakai di daftar pemain, status giliran, header dan pesan chat, indikator "is typing...", serta reaksi bot yang menyebut nama pemain.
- `settings.names` (disimpan ke `localStorage`) beserta `setName` dan `playerNames` (nama final) di `useSettings`; data slot nama ada di `src/data/playerNames.js`.
- Dadu 3D: kubus CSS dengan enam sisi bertitik yang dikocok, dilempar ke udara (skala membesar, bayangan mengecil), berputar, lalu memantul dua kali sebelum berhenti. Angka pada sisi berganti acak dan melambat sesaat sebelum berhenti di hasil sebenarnya. Efek gerak dimatikan bila pengguna memilih *reduced motion*.
- Varian Tailwind `fit:` (layar minimal 64rem x 38rem) sebagai satu-satunya definisi breakpoint mode "muat satu layar".
- Main Lobby screen with Start Game, Settings, How to Play, and Exit buttons, shown when the app opens.
- `useNavigation` hook for screen navigation, separate from game logic.
- How to Play rules screen, Settings placeholder, and Exit farewell screen.
- Functional Settings screen with an Audio section (Master, BGM, and SFX volume sliders plus a Mute/Unmute switch) and a reserved Gameplay / Visual section for upcoming theme options.
- Global settings state in `src/settings/` (`SettingsProvider`, `useSettings`, `getEffectiveVolume`); values are validated and persisted to `localStorage`, falling back to defaults if storage is unavailable or corrupt.
- Reusable settings UI: `SettingsSection`, `VolumeSlider`, and `ToggleSwitch`.
- "Menu utama" button in the game screen to return to the lobby.

- Custom pawns: nine 2D SVG characters with a glossy 3D-style finish replace the letter circles (K, R, B, D). Players choose one of six characters, one of eight colors, and one of four shapes (circle, square, hexagon, shield) with a live preview. Bots keep fixed characters (fox, panda, robot).
- Pre-game "Siapkan Permainan" screen between the lobby and the game for choosing the pawn and board theme. The same pickers also appear in Settings.
- Three board themes: Classic, Cyberpunk (neon glow), and Jungle. Snakes are now drawn as wavy snakes with heads and tongues, and ladders as real ladders with rungs. Theme previews use the real board.
- Sound: a Web Audio engine (`src/audio`) that synthesizes every sound, so no audio files are needed. Includes dice-rattle, per-square step, ladder-climb, snake-slide, chat "ting", and win sounds, plus a relaxed looping background track. Volume, BGM/SFX levels, and mute from Settings now take effect; a quick mute button was added to the game screen.
- Dice now show pips, shake while rolling, and reveal the result after a short roll animation.
- Player list under the board showing each pawn, name, square, and whose turn it is.

### Changed
- Layar permainan kini muat dalam satu layar (jendela biasa maupun F11) tanpa scrollbar: `BoardView` punya mode `fit` yang menghitung sisi papan dari lebar dan tinggi yang tersedia (container query, `min(100cqw, 100cqh)`) sehingga papan 10x10 selalu persegi. Pada layar lebar, papan berada di kolom kiri, sedangkan daftar pemain, kontrol, dan chat menumpuk di sidebar kanan; pada layar sempit atau pendek, susunan kembali vertikal dan halaman boleh di-scroll.
- Angka, lencana, dan bendera pada kotak papan ikut membesar/mengecil mengikuti lebar papan (`cqw`).
- SFX `diceRoll` disusun ulang mengikuti timeline animasi: klik kocokan yang makin rapat, aksen "lempar" tepat di puncak guncangan (`DICE_PEAK_MS`), lalu dua bunyi pantulan saat dadu menyentuh meja. Jadwalnya dihitung dari satu waktu mulai sehingga tetap sinkron dengan layar.
- `DICE_ROLL_MS` naik dari 700 ke 900 ms agar animasi dadu punya ruang untuk fase kocok, lempar, dan pantul; ditambah `DICE_PEAK_RATIO` dan `DICE_PEAK_MS`.
- `createPlayers(pawn, names)` dan `useAutoChat({ names })` menerima nama final; `ChatPanel` menerima `memberNames` dan `className`, `PlayerList` menerima `className`.
- Tombol lempar dadu diaktifkan lewat prop `canRoll` dari `GameScreen`, tidak lagi lewat pencocokan teks status "Giliran Kamu". Status giliran kini memakai nama pemain (mis. "Giliran Andi.").
- Game UI moved from `App` into `GameScreen`; gameplay behavior is unchanged.
- "Start Game" now opens the setup screen; the game starts from its "Mulai Bermain" button.
- `useGame` takes `players` and an optional `onSfx` callback; pawns that take a ladder or snake glide slowly and the turn waits until the slide and sound finish.
- Settings `visual` now stores `theme` and `pawn`. Values outside the official lists fall back to defaults.
- Board rendering split into `BoardView`, `Connections`, and `engine/boardGeometry.js`; board colors are CSS variables in `styles/board.css`.
- Audio pauses while the browser tab is hidden and starts only after the first click or tap, as browsers require.

### Fixed
- Posisi scroll layar sebelumnya tidak lagi terbawa ke layar berikutnya; setiap pergantian layar kembali ke atas (sebelumnya layar permainan bisa terbuka dalam keadaan ter-scroll setelah menekan "Mulai Bermain" di bagian bawah layar persiapan).

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