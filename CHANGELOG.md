# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions use semantic versioning.

## [Unreleased]

### Added
- Preset layout papan di "Siapkan Permainan" (`BoardPresetPicker`, `data/boardPresets.js`): 11 preset dengan pratinjau langsung, deskripsi karakter, jumlah tangga/ular, dan perkiraan panjang permainan: Classic Standard, Snake Pit (Hell Mode), Heavenly Ladders, Chaos / Teleport Madness, The Final Wall, Monotone / Long Range, Zig-Zag Trap, Short & Sweet, The Rollercoaster, Original Mini (papan lama), dan Random Generator. Pilihan disimpan di `settings.game.boardPreset`; data lama tanpa nilai ini memakai Classic.
- Random Generator Mode (`engine/boardGenerator.js`, `engine/boardResolver.js`): papan acak berbenih (seed) yang dibuat baru setiap permainan dimulai dan setiap "Mulai ulang". Seed ditampilkan di header agar papan bisa diulang. Generator hanya menerima papan yang valid dan seimbang.
- Validasi anti-loop (`validateBoard`): ekor ular/ujung tangga tidak boleh jatuh di pangkal ular/tangga lain (kepala ular tidak pernah langsung terhubung ke pangkal tangga), dan selalu ada jalur dadu dari kotak 1 ke kotak 100 tanpa kotak jebakan permanen. `analyzeBoard` menghitung jalur terpendek dan rata-rata lemparan.
- `npm run verify:boards` (`scripts/verify-boards.mjs`): memeriksa semua preset dan menguji generator pada 3.000 seed.
- Nama papan (dan seed papan acak) tampil di layar permainan.
- Pengaturan permainan di "Siapkan Permainan": mode Solo + COM, Lokal (Pass & Play), Spektator (semua COM), dan Campuran; jumlah pemain 2–4; serta pemilihan Human/COM per slot. Setiap Human dapat mengatur nama, avatar, dan warna sendiri. Pilihan disimpan dalam settings.
- Tingkat kesulitan bot Easy, Medium, dan Hard. Tingkat ini mengubah tempo berpikir COM dan frekuensi dialog kontekstualnya; hasil dadu tetap acak dan tidak dimanipulasi.
- Dialog bot RPG kini memiliki banyak variasi per event dengan emosi kontekstual (senang, kesal, curiga, sarkastis, tegang, hingga pasrah), gaya persona yang lebih tegas, reaksi angka dadu berulang, dan perlindungan dari kutipan yang baru saja dipakai.
- Dialog bot bergaya RPG (`RpgDialog`, `TypewriterText`, `styles/dialog.css`): kotak dialog gelap bersudut bertakik dengan potret bot yang sedang bicara (bidak karakternya) plus ekspresi emoji persona, papan nama berwarna persona, huruf monospasi, teks yang diketik huruf demi huruf, dan kursor ▼ berkedip saat selesai. Bot yang bicara diberi animasi mengangguk kecil selama mengetik. Blip pendek (`dialog`) berbunyi tiap baris baru. Pembaca layar membaca teks lengkap lewat wilayah `role="status"`; pengguna *reduced motion* langsung melihat teks penuh tanpa animasi.
- Kejadian dialog baru: `OVERTAKE` (pemain menyalip lawan; teks memakai `{target}`) dan `GAME_START` (sapaan pembuka). Aturan menyalip ada di `findPassedPlayers` (`gameEngine.js`). `EVENT_CHANCE` membuat `DICE_SIX` dan `OVERTAKE` tidak selalu memicu dialog agar bot tidak cerewet.
- Toggle mode tampilan di Settings > "Tampilan layar" (`LayoutModePicker`): **Mode Desktop** (papan di kiri, sidebar di kanan, satu layar tanpa scroll) atau **Mode HP / Mobile** (satu kolom ringkas: papan, dialog bot, pemain, lalu dadu di dasar agar terjangkau jempol). Pilihan disimpan di `settings.layout.mode` (`localStorage`) dan dipakai otomatis saat berikutnya; pemain baru diberi tebakan awal dari lebar layar (di bawah 48rem = HP). `setLayoutMode` tersedia di `useSettings`, dan App menaruh `data-layout` di `<html>` (mode HP membatasi seluruh aplikasi ke satu kolom selebar ponsel, `styles/layout.css`).
- Dadu: riak benturan (`.dice-ring`) dan kilau hasil (`.dice-glow`, emas untuk angka 6) saat mendarat; tunduk sebelum dilempar; squash & stretch di tiap pantulan; dadu mengambang pelan sebagai ajakan melempar saat tombolnya aktif; dadu menyusut saat ditekan. Petunjuk "Ketuk dadu untuk melempar." muncul di giliran pemain.
- `PlayerList` punya mode `compact` (bidak, nama, dan kotak menumpuk vertikal) untuk layout HP.
- Timeline dadu bersama di `gameEngine.js`: `DICE_LAND_RATIO`/`DICE_LAND_MS`, `DICE_BOUNCE_RATIOS`, dan `DICE_SHAKE_HITS`, dipakai oleh keyframes, SFX, dan pergantian angka.
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
- `resolveSpecialSquare`, `useGame`, `GameBoard`, `BoardView`, dan `Connections` menerima papan (`board`) sebagai parameter, bukan lagi membaca `boardData.js` secara global. Papan bawaan sekarang preset Classic Standard (9 tangga, 9 ular); papan lama tersedia sebagai "Original Mini".
- Chat ala WhatsApp diganti dialog RPG: pemain utama tidak lagi mengirim pesan, dan obrolan hanya datang dari Rizky, Bagas, dan Davin berdasarkan kejadian permainan (naik tangga, terperosok ular, menyalip, mendekati garis akhir, angka 6, kemenangan). Hanya satu baris tampil sekaligus; baris berikutnya mengantre (maksimal 2, yang tertua dibuang) dan `GAME_OVER` langsung memotong dialog yang sedang tampil. Bot tidak lagi mengomentari dirinya sendiri atau lawan yang terlibat.
- `useAutoChat({ onLine, names })` kini mengembalikan `{ line, triggerEvent }` (sebelumnya `messages`, `sendMessage`, `typingPersona`) dan `onIncomingMessage` menjadi `onLine`. `onGameEvent` menerima argumen ketiga `extra` (mis. `{ target }`).
- Layar permainan mengikuti mode tampilan pilihan pemain, bukan lagi ditebak dari ukuran viewport lewat varian `fit:`. Mode Desktop tetap satu layar penuh dan pada layar sempit halaman bergeser ke samping (seperti "situs desktop"); mode HP menggulir vertikal bila layar sangat pendek. `BoardView` menerima `fit="fill" | "width"` (sebelumnya boolean) dan `GameBoard` menerima `layout`.
- Animasi dadu dipoles: gerak hanya memakai `transform`/`opacity` dengan lapisan GPU selama mengocok (`translate3d`, `will-change`), kurva easing per segmen, rattle dengan amplitudo naik, dan keyframes disusun ulang di sekitar timeline yang sama (puncak 35%, mendarat 68%, pantulan 90% dan 98,5%). Angka hasil kini terbaca begitu dadu menyentuh meja (68%) selagi memantul, bukan baru setelah animasi selesai.
- SFX `diceRoll` menaruh klik rattle tepat di balikan arah guncangan (`DICE_SHAKE_HITS`) dan benturan di `DICE_LAND_RATIO`/`DICE_BOUNCE_RATIOS`, semuanya dari konstanta yang sama dengan keyframes.
- `useGame` mengembalikan `rollingValue` (angka yang sedang dilempar) dan melaporkan `OVERTAKE`.
- Deskripsi audio di Settings menyebut "dialog bot" menggantikan "notifikasi chat".
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

### Removed
- `ChatPanel`, `ChatMessage`, dan `ChatInput` (UI chat gaya WhatsApp beserta kolom "Tulis pesan"), `sendMessage`, indikator "is typing...", dan varian Tailwind `fit:`.

### Fixed
- Sinkronisasi dadu: bunyi kocokan kini dimulai setelah frame pertama animasi tampil (sebelumnya ~50 ms lebih awal dari gerakan), dan pergantian angka menunggu animasi benar-benar selesai. Sebelumnya class animasi dilepas ~40 ms sebelum animasi berakhir sehingga dadu terpotong dan melompat ke pose akhir.
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