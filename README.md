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
- 🎯 Animasi perpindahan pion per kotak
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
│   ├── board/       # Papan dan kotak permainan
│   ├── chat/        # Panel dan pesan chat
│   └── controls/    # Tombol dadu dan kontrol game
├── data/
│   ├── boardData.js     # Data ular & tangga
│   ├── botPersonas.js   # Persona bot
│   └── chatTriggers.js  # Respons chat berdasarkan event
├── engine/
│   └── gameEngine.js    # Aturan dan logika dasar permainan
├── hooks/
│   ├── useGame.js       # State dan alur permainan
│   └── useAutoChat.js   # Sistem chat otomatis
├── styles/
│   └── theme.css
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

Persona serta dialog bot dapat disesuaikan melalui:

```text
src/data/botPersonas.js
src/data/chatTriggers.js
```

Dengan struktur ini, aturan permainan dan karakter bot dapat dikembangkan tanpa harus mengubah keseluruhan komponen UI.

---

**Made with React + Vite 🎲**
