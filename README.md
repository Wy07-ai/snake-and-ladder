# 🐍 Ular Tangga

Game **Ular Tangga** berbasis React yang menghadirkan permainan papan klasik dengan bot lawan dan chat interaktif. Pemain dapat bermain melawan tiga karakter bot dengan gaya komunikasi yang berbeda, sementara setiap kejadian penting di dalam permainan dapat memicu komentar otomatis.

## ✨ Fitur

- 🎲 Lempar dadu dengan sistem **bonus lemparan setelah mendapatkan angka 6**
- 🐍 **Ular & tangga** dengan perpindahan posisi otomatis
- 🤖 3 bot dengan persona berbeda:
  - **Rizky** — toksik dan emosian
  - **Bagas** — meme dan santuy
  - **Davin** — kalkulatif dan dingin
- 💬 **Chat interaktif** yang merespons kejadian dalam permainan
- 🎯 Animasi perpindahan pion per kotak dan pion yang meluncur di tangga/ular
- 🎲 **Dadu 3D**: dikocok, dilempar, berputar, dan memantul dengan angka acak yang melambat sebelum berhenti; bunyinya disusun mengikuti animasi
- 🖥️ **Muat satu layar**: papan tetap persegi dan seluruh panel muat tanpa scroll, baik di jendela biasa maupun fullscreen (F11)
- 🏷️ **Nama kustom**: ubah nama kamu dan ketiga bot (Rizky, Bagas, Davin) di layar persiapan atau Settings; kolom kosong memakai nama bawaan, dan pilihanmu tersimpan
- 🧸 **Bidak kustom**: pilih karakter 2D (kucing, kelinci, alien, hantu, astronot, katak), warna, dan bentuk sebelum bermain
- 🎨 **3 tema papan**: Classic, Cyberpunk, dan Jungle
- 🔊 **Suara & musik**: kocokan dadu, langkah pion, naik tangga, terperosok ular, notifikasi chat "Ting!", dan musik latar santai (disintesis lewat kode, tanpa file audio)
- 🏆 Kondisi kemenangan saat pemain mencapai kotak **100**
- 🔄 Tombol **Mulai ulang** untuk mengatur permainan dari awal
- 📱 Tampilan responsif untuk berbagai ukuran layar

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
│   ├── chat/        # Panel dan pesan chat
│   ├── controls/    # Dadu, kontrol game, dan daftar pemain
│   ├── customize/   # Pemilih nama, bidak, dan tema papan
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
│   └── chatTriggers.js  # Respons chat berdasarkan event
├── engine/
│   ├── gameEngine.js    # Aturan dan logika dasar permainan
│   └── boardGeometry.js # Posisi kotak, bentuk ular & tangga
├── hooks/
│   ├── useGame.js       # State dan alur permainan
│   └── useAutoChat.js   # Sistem chat otomatis
├── styles/
│   ├── theme.css
│   └── board.css        # Papan, tema papan, dan dadu 3D
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

Persona serta dialog bot dapat disesuaikan melalui:

```text
src/data/botPersonas.js
src/data/chatTriggers.js
```

Dengan struktur ini, aturan permainan dan karakter bot dapat dikembangkan tanpa harus mengubah keseluruhan komponen UI.

---

**Made with React + Vite 🎲**
