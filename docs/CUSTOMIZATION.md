# Kustomisasi Visual

## Pendahuluan

Pemain dapat menyesuaikan tampilan permainan melalui Settings dan layar persiapan: memilih tema papan, karakter dan warna bidak, nama pemain, serta tata letak Desktop atau HP/Mobile. Pilihan tema, bidak, nama, dan layout disimpan bersama pengaturan agar tetap tersedia saat aplikasi dibuka kembali.

## Tema Papan

Tema papan ditentukan oleh ID dan label di `src/data/boardThemes.js`. Tema yang tersedia:

| Tema | ID | Gaya visual |
| --- | --- | --- |
| Classic | `classic` | Tema default dengan bingkai hijau, kotak putih/hijau muda, dan penanda ular/tangga yang kontras. |
| Cyberpunk | `cyberpunk` | Latar gelap dengan aksen neon cyan dan magenta, teks bercahaya, serta efek glow pada ular dan tangga. |
| Jungle | `jungle` | Nuansa dedaunan hijau dan warna tanah pada papan, tangga, serta ular. |

### Struktur styling

- `src/styles/board.css` mendefinisikan warna papan melalui CSS custom properties seperti `--board-frame`, `--cell-a`, `--cell-b`, `--ladder-rail`, dan `--snake-body`. Selector `.board` adalah nilai dasar Classic; tema lain menimpa variabel menggunakan selector `[data-board-theme='id']`.
- `src/components/board/BoardView.jsx` meneruskan tema sebagai atribut `data-board-theme` pada papan. Karena elemen papan dan koneksi ular/tangga memakai variabel yang sama, warna tema ikut diterapkan ke kotak, badge, dan gambar SVG koneksi.
- `src/styles/theme.css` mengatur palet global antarmuka aplikasi melalui variabel `--wa-*` (tombol, panel, teks, dan latar). File ini bukan tempat utama untuk warna tiap tema papan.
- `src/data/boardThemes.js` memasok identitas, label, emoji, deskripsi, dan tema default untuk pemilih tema.

## Kustomisasi Bidak

Karakter pemain manusia digambar sebagai SVG 2D inline, tanpa file gambar terpisah. Pilihan avatar bawaan:

| ID | Karakter |
| --- | --- |
| `cat` | Kucing |
| `bunny` | Kelinci |
| `alien` | Alien |
| `ghost` | Hantu |
| `astronaut` | Astronot |
| `frog` | Katak |

Palet warna yang tersedia:

| Label | ID | Nilai |
| --- | --- | --- |
| Hijau WA | `wa` | `#075e54` |
| Hijau daun | `leaf` | `#2f9e44` |
| Toska | `cyan` | `#0c8599` |
| Ungu | `violet` | `#7048e8` |
| Pink | `pink` | `#d6336c` |
| Kuning | `yellow` | `#f2c200` |
| Cokelat | `brown` | `#8b5a2b` |
| Abu gelap | `slate` | `#343a40` |

Bentuk dasar bidak terdiri dari bulat (`circle`), kotak (`square`), segi enam (`hexagon`), dan perisai (`shield`).

### Arsitektur bidak

- `src/data/pawnOptions.js` adalah daftar resmi ID dan label avatar, warna, serta bentuk. Validasi Settings hanya menerima nilai dari daftar ini.
- `src/components/pawn/avatarArt.jsx` berisi komponen SVG untuk gambar karakter. Gambar memakai kanvas `64x64` dan berpusat di sekitar `(32, 32)`.
- `src/components/pawn/Pawn.jsx` menggabungkan gambar karakter dengan siluet bentuk, warna pilihan, dan lapisan highlight. `AVATAR_ART` memetakan ID avatar ke komponen gambar; `SHAPE_PATHS` memetakan ID bentuk ke path SVG.
- `src/components/customize/PawnCustomizer.jsx` menyediakan pratinjau dan pemilih avatar, warna, serta bentuk. Di layar setup, kontrol per-slot saat ini memilih avatar dan warna untuk pemain manusia; bidak bot memakai aset tetap.

### Menambahkan karakter SVG

1. Buat komponen gambar baru yang menggambar bagian-bagian karakter SVG pada kanvas `64x64` di `src/components/pawn/avatarArt.jsx`.
2. Impor komponen tersebut dan tambahkan ID-nya ke `AVATAR_ART` di `src/components/pawn/Pawn.jsx`.
3. Jika karakter dapat dipilih pemain, tambahkan `{ id, label }` ke `HUMAN_AVATARS` di `src/data/pawnOptions.js`. Pemilih dan sanitizer Settings membaca daftar ini.

Contoh bentuk komponen:

```jsx
export function TurtleArt() {
  return (
    <>
      <ellipse cx="32" cy="36" rx="17" ry="12" fill="#69db7c" />
      <circle cx="48" cy="32" r="7" fill="#69db7c" />
    </>
  )
}
```

Tambahkan juga style SVG yang sesuai dengan kontur gelap karakter lain agar ilustrasi tetap jelas pada semua warna alas bidak.

## Mode Tampilan

| Mode | Susunan |
| --- | --- |
| **Mode Desktop** (`desktop`) | Papan di kiri dan panel pemain, dadu, serta dialog di kanan (side-by-side). Layout permainan menggunakan area layar lebar. |
| **Mode HP / Mobile** (`mobile`) | Satu kolom ringkas: papan di atas, dialog di bawah papan, lalu pemain dan kontrol. Konten dapat digulir vertikal dan dibatasi selebar ponsel. |

`src/data/layoutModes.js` mendefinisikan ID, label, deskripsi, dan default mode (Desktop). Jika belum ada pilihan layout tersimpan, `detectLayoutMode()` memilih Mobile untuk viewport di bawah 48rem; pilihan eksplisit yang sudah disimpan tetap berlaku pada layar berapa pun.

`SettingsProvider` menyimpan seluruh pengaturan ke LocalStorage dengan kunci `ular-tangga:settings:v1` melalui `src/settings/settingsDefaults.js`. Mode layout berada di `settings.layout.mode`; `App.jsx` menuliskan nilainya ke atribut `data-layout` pada elemen `<html>`. `src/styles/layout.css` memberi batas lebar dan latar halaman untuk mode Mobile, sedangkan susunan dua mode permainan dirender oleh `src/screens/GameScreen.jsx`. Nilai yang dibaca dari penyimpanan divalidasi; ID tema atau mode yang tidak dikenal kembali ke nilai default.

## Panduan Menambah Tema

1. Tambahkan entri ber-ID unik ke `BOARD_THEMES` di `src/data/boardThemes.js`.
2. Tambahkan blok `[data-board-theme='id-baru']` di `src/styles/board.css` dan tentukan variabel yang ingin dioverride. Gunakan nama variabel papan yang sudah ada agar kotak, badge, tangga, dan ular tetap konsisten.
3. Pilih warna dengan kontras yang memadai untuk angka kotak dan penanda fitur. `ThemePicker` membuat pratinjau dari daftar `BOARD_THEMES`, sehingga entri baru otomatis tersedia di Settings.

Contoh kerangka tema:

```css
.board[data-board-theme='ocean'] {
  --board-frame: #075985;
  --board-bg: #e0f2fe;
  --cell-a: #f0f9ff;
  --cell-b: #bae6fd;
  --cell-ink: #082f49;
  --ladder-rail: #0f766e;
  --snake-body: #be123c;
}
```