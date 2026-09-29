# 🐍 Ular Tangga

Game **Ular Tangga** berbasis React yang menghadirkan permainan papan klasik dengan bot lawan dan dialog bergaya RPG. Pemain dapat bermain melawan tiga karakter bot dengan gaya bicara yang berbeda, sementara setiap kejadian penting di dalam permainan (naik tangga, terperosok ular, menyalip lawan, mendekati garis akhir) memicu komentar otomatis dari bot.

## ✨ Fitur

- 🎲 Lempar dadu dengan sistem **bonus lemparan setelah mendapatkan angka 6**
- 🐍 **Ular & tangga** dengan perpindahan posisi otomatis
- 🤖 3 bot dengan persona berbeda:
  - **Rizky** — toksik dan emosian
  - **Bagas** — meme dan santuy
  - **Davin** — kalkulatif dan dingin
- 💬 **Dialog bot bergaya RPG**: kotak dialog minimalis dengan potret bot yang sedang bicara dan teks yang diketik huruf demi huruf. Kamu tidak perlu mengetik apa pun; ketiga bot bicara sendiri sesuai kejadian permainan
- 🎯 Animasi perpindahan pion per kotak dan pion yang meluncur di tangga/ular
- 🎲 **Dadu 3D**: dikocok, dilempar, berputar, dan memantul dengan squash & stretch, riak benturan, serta angka acak yang melambat dan terbaca begitu dadu mendarat; bunyinya disinkronkan dengan frame animasi
- 🖥️ **Muat satu layar**: papan tetap persegi dan seluruh panel muat tanpa scroll, baik di jendela biasa maupun fullscreen (F11)
- 📐 **Mode tampilan**: pilih **Mode Desktop** (papan dan sidebar berdampingan) atau **Mode HP / Mobile** (satu kolom ringkas) di Settings; pilihanmu tersimpan di perangkat
- 🏷️ **Nama kustom**: ubah nama kamu dan ketiga bot (Rizky, Bagas, Davin) di layar persiapan atau Settings; kolom kosong memakai nama bawaan, dan pilihanmu tersimpan
- 🧸 **Bidak kustom**: pilih karakter 2D (kucing, kelinci, alien, hantu, astronot, katak), warna, dan bentuk sebelum bermain
- 🎨 **3 tema papan**: Classic, Cyberpunk, dan Jungle
- 🔊 **Suara & musik**: kocokan dadu, langkah pion, naik tangga, terperosok ular, blip dialog bot, dan musik latar santai (disintesis lewat kode, tanpa file audio)
- 🏆 Kondisi kemenangan saat pemain mencapai kotak **100**
- 🔄 Tombol **Mulai ulang** untuk mengatur permainan dari awal
- 📱 Tampilan yang bisa dipilih untuk layar lebar maupun HP

## 🛠️ Teknologi

- **React 19**
- **Vite**
- **Tailwind CSS**
- **JavaScript (ES Modules)**
- **ESLint**

## 📁 Struktur Project

```text
src/
├── assets/          # Asset gambar dan icon
├── components/
│   ├── board/       # Papan bertema, ular/tangga, dan bidak di papan
│   ├── chat/        # Dialog bot bergaya RPG dan teks yang diketik
│   ├── controls/    # Dadu, kontrol game, dan daftar pemain
│   ├── customize/   # Pemilih nama, bidak, dan tema papan
│   ├── settings/    # Komponen Settings (slider, toggle, pemilih mode tampilan)
│   └── pawn/        # Bidak dan gambar karakter SVG
├── audio/
│   ├── audioEngine.js   # SFX dan musik latar (Web Audio)
│   └── useAudioSync.js  # Menghubungkan Settings dengan audio
├── data/
│   ├── boardData.js     # Data ular & tangga
│   ├── boardThemes.js   # Daftar tema papan
│   ├── pawnOptions.js   # Karakter, warna, dan bentuk bidak
│   ├── botPersonas.js   # Persona bot
│   ├── playerNames.js   # Slot dan nama bawaan pemain & bot
│   ├── layoutModes.js   # Daftar mode tampilan (Desktop / HP)
│   ├── dialogTiming.js  # Kecepatan ketik dan lama tampil dialog
│   └── chatTriggers.js  # Dialog bot berdasarkan event
├── engine/
│   ├── gameEngine.js    # Aturan dan logika dasar permainan
│   └── boardGeometry.js # Posisi kotak, bentuk ular & tangga
├── hooks/
│   ├── useGame.js       # State dan alur permainan
│   └── useAutoChat.js   # Antrean dialog bot otomatis
├── styles/
│   ├── theme.css
│   ├── board.css        # Papan, tema papan, dan dadu 3D
│   ├── dialog.css       # Kotak dialog RPG
│   └── layout.css       # Aturan global mode tampilan
├── App.jsx
├── index.css
└── main.jsx
```

## 🚀 Menjalankan Project

Pastikan **Node.js** dan **npm** sudah terpasang.

### 1. Install dependency

```bash
npm install
```

### 2. Jalankan development server

```bash
npm run dev
```

Setelah itu, buka URL yang ditampilkan oleh Vite di terminal.

### 3. Build untuk production

```bash
npm run build
```

Untuk melihat hasil build secara lokal:

```bash
npm run preview
```

### 4. Menjalankan lint

```bash
npm run lint
```

## 🎮 Cara Bermain

1. Permainan dimulai dari kotak **1**.
2. Saat giliran kamu, tekan tombol **lempar dadu**.
3. Pion bergerak sesuai angka yang diperoleh.
4. Jika berhenti di **tangga**, pion akan naik.
5. Jika terkena **ular**, pion akan turun.
6. Mendapatkan angka **6** memberikan satu lemparan tambahan.
7. Giliran berpindah ke bot jika tidak mendapatkan bonus.
8. Pemain yang mencapai kotak **100** menjadi pemenang.

## 🧩 Kustomisasi

Data permainan dapat diubah dengan mudah melalui file di `src/data/`.

Contohnya, posisi ular dan tangga dapat diatur di:

```text
src/data/boardData.js
```

Nama bawaan pemain dan bot (yang dipakai bila kolom nama dikosongkan) dapat diubah di:

```text
src/data/playerNames.js
```

Persona serta dialog bot (termasuk peluang tiap kejadian memicu dialog) dapat disesuaikan melalui:

```text
src/data/botPersonas.js
src/data/chatTriggers.js
```

Dengan struktur ini. aturan permainan dan karakter bot dapat dikembangkan tanpa harus mengubah keseluruhan komponen UI.

---

**Made with React + Vite 🎲**
