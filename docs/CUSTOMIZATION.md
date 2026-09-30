# Kustomisasi Visual

## Pendahuluan

Pemain dapat menyesuaikan tampilan permainan melalui Settings dan layar persiapan: memilih tema papan, karakter dan warna bidak, nama pemain, serta tata letak Desktop atau HP/Mobile. Pilihan tema, bidak, nama, dan layout disimpan bersama pengaturan agar tetap tersedia saat aplikasi dibuka kembali.

## Tema Papan

Tema papan ditentukan oleh ID dan label di `src/data/boardThemes.js`. Ada sembilan tema; pemilihnya (`ThemePicker`) tampil di Settings dan layar persiapan, dan pilihan disimpan bersama pengaturan. Mengganti tema tidak mengubah geometri papan, jadi posisi kotak, ular, tangga, dan bidak tetap sama.

| Tema | ID | Gaya visual |
| --- | --- | --- |
| Classic | `classic` | Tema default dengan bingkai hijau, kotak putih/hijau muda, dan penanda ular/tangga yang kontras. |
| Cyberpunk | `cyberpunk` | Latar gelap dengan aksen neon cyan dan magenta, teks bercahaya, serta efek glow pada ular dan tangga. |
| Jungle | `jungle` | Nuansa dedaunan hijau dan warna tanah pada papan, tangga, serta ular. |
| China / Orient Express | `china` | Merah & emas, kotak dengan pola kisi jendela, bintik cahaya lentera. |
| Christmas | `christmas` | Hijau-merah meriah, kotak putih bersalju, salju yang turun perlahan. |
| Halloween | `halloween` | Ungu malam dan oranye labu, sarang laba-laba di sudut kotak, debu roh melayang. |
| Desert Oasis | `desert` | Emas pasir dan toska, pola mozaik berlian, bayangan bukit pasir diagonal. |
| Royal Victorian | `royal` | Biru beludru, lis emas tebal, kotak marmer berurat, sudut berhias daun emas. |
| Infernal Abyss | `hell` | Hitam obsidian dengan retakan lava merah dan percikan api yang naik. |

### Visual ular & tangga per tema

Bentuk jalur ular dan tangga sama di semua tema; yang berbeda adalah tekstur (warna, tebal, pola garis) dan hiasan SVG di kepala ular serta ujung atas tangga.

| Tema | Ular | Tangga |
| --- | --- | --- |
| Classic / Cyberpunk / Jungle | Ular bergelombang bergaris perut putus-putus (glow neon pada Cyberpunk). | Dua rel dengan anak tangga (glow neon pada Cyberpunk). |
| China | Naga sutra merah berbingkai emas, tanduk emas dan kumis panjang. | Perancah bambu: rel hijau berbuku, ikatan tali merah, lentera di ujung atas. |
| Christmas | Es runcing biru beku berbingkai putih, bertopi Santa. | Rel permen tongkat (strip merah-putih), anak tangga tali garland hijau, bola hias di ujung. |
| Halloween | Sulur hantu hijau berpendar dengan kepala tengkorak, mata oranye, deretan gigi. | Tali jaring laba-laba tipis dengan paku besi runcing di ujung. |
| Desert | Ular gurun berpola berlian gelap, kepala segitiga bertanduk kecil. | Tangga palem cokelat dengan anak tangga tebal bermotif seperti tumpukan karpet ajaib, ujung berbentuk berlian toska. |
| Royal | Pita merah kerajaan berbingkai emas dengan simpul pita di kepala. | Rel emas dengan butir mutiara (balustrade), ujung bola emas. |
| Hell | Sungai lava berantai (badan bersegmen hitam-oranye), bertanduk dan berjambul api. | Tulang belakang tulang di atas pilar obsidian, ujung berupa lidah api. |

### Struktur styling

- `src/styles/board.css` mendefinisikan warna papan melalui CSS custom properties. Selector `.board` adalah nilai dasar Classic; tema lain menimpa variabel menggunakan selector `[data-board-theme='id']`. Variabel utama:
  - Papan & kotak: `--board-frame`, `--board-frame-width`, `--board-bg`, `--board-shadow`, `--board-font`, `--cell-a`, `--cell-b`, `--cell-ladder`, `--cell-snake`, `--cell-ink`, `--cell-line`, `--cell-pattern` (+ `--cell-pattern-size`).
  - Lapisan tekstur/partikel di atas kotak: `--overlay-image`, `--overlay-size`, `--overlay-opacity`, `--overlay-blend`, `--overlay-anim` (dirender oleh `.board::after`, di bawah ular/tangga dan angka kotak, tidak menerima klik).
  - Aksen & badge: `--accent-1`, `--accent-2`, `--badge-ladder`, `--badge-snake`, `--badge-ink`.
  - Tangga: `--ladder-rail`, `--ladder-rung`, `--ladder-rail-width`, `--ladder-rung-width`, `--ladder-glow`, serta lapisan detail `--ladder-detail`, `--ladder-detail-width`, `--ladder-detail-dash`, `--rung-detail`, `--rung-detail-dash` (ruas bambu, strip permen, ruas tulang, mutiara).
  - Ular: `--snake-body`, `--snake-width`, `--snake-edge` + `--snake-edge-width` (bingkai), `--snake-belly` + `--snake-belly-width` + `--snake-belly-dash`, `--snake-head`, `--snake-eye`, `--snake-tongue`, `--snake-cap` (`round` atau `butt`; `butt` memberi kesan pita/ruas), `--snake-glow`.
- `src/components/board/BoardView.jsx` meneruskan tema sebagai atribut `data-board-theme` pada papan dan sebagai prop `theme` ke `Connections`.
- `src/components/board/Connections.jsx` menggambar ular dan tangga. Geometri dari `boardGeometry.js` tidak bergantung tema. Tiap rel/anak tangga digambar dua lapis (dasar + lapisan detail bergaris putus) dan tiap ular tiga lapis (bingkai, badan, perut). Hiasan yang bentuknya memang berbeda per tema ada di peta `SNAKE_HEADS` (kepala ular) dan `LADDER_FINIALS` (ujung atas rel), digambar dalam koordinat lokal (titik 0,0 = kepala/ujung rel, sumbu +x = arah hadap). Tema tanpa entri di peta tersebut (Classic, Cyberpunk, Jungle) tidak mendapat hiasan.
- `src/styles/backdrop.css` dan `src/components/layout/ThemeBackdrop.jsx` mengatur latar halaman penuh per tema (lihat bagian di bawah).
- `src/styles/theme.css` mengatur palet global antarmuka aplikasi melalui variabel `--wa-*` (tombol, panel, teks, dan latar). File ini bukan tempat utama untuk warna tiap tema papan.
- `src/data/boardThemes.js` memasok identitas, label, emoji, deskripsi, dan tema default untuk pemilih tema. Sanitizer Settings membaca daftar ini, jadi ID tema yang tidak dikenal kembali ke Classic.

### Transisi saat ganti tema

Warna kotak, bingkai, bayangan, serta stroke/fill ular dan tangga memakai CSS `transition` 0,5 detik, sehingga perpindahan warna berjalan halus. Hiasan kepala ular dan ujung tangga diberi `key` tema sehingga dirender ulang dan memudar masuk (0,45 detik). Semua animasi (partikel salju/api, fade hiasan, transisi warna) dimatikan pada pengguna dengan `prefers-reduced-motion`, dan pratinjau kecil (`.board--compact`) tidak beranimasi.

### Latar halaman penuh per tema

Selain papan, seluruh halaman (di luar papan) ikut berganti suasana. Latar dipasang sekali di `App.jsx` lewat `components/layout/ThemeBackdrop.jsx` dan diberi gaya di `src/styles/backdrop.css`.

| Tema | Latar |
| --- | --- |
| Classic | Gradien hijau-teal modern, bukit lembut, dan siluet tangga. |
| Cyberpunk | Langit ungu malam dengan cakrawala magenta/cyan dan siluet gedung berjendela neon. |
| Jungle | Hijau rimba dengan berkas cahaya diagonal, kunang-kunang, dan siluet palem. |
| China / Orient Express | Merah tua berkilau emas, lentera gantung, dan siluet pagoda. |
| Christmas | Langit malam biru dengan salju turun, pinus, dan bukit bersalju. |
| Halloween | Ungu gelap dengan bulan, kabut oranye, bintik melayang, dan siluet labu bermuka menyala, pohon gundul, serta kelelawar. |
| Desert Oasis | Langit senja gurun dengan bintang, bukit pasir, dan siluet palem/menara. |
| Royal Victorian | Biru beludru dengan debu emas dan tirai merah berhias emas di tepi atas. |
| Infernal Abyss | Gelap-merah dengan cahaya lava dari bawah, bara api naik, dan siluet obsidian bercelah lava. |

**Cara kerja.** `ThemeBackdrop` merender satu lapisan per tema (`.page-backdrop__layer--{id}`) di dalam `.page-backdrop` (`position: fixed`, `z-index: -1`, `pointer-events: none`). Hanya lapisan tema aktif yang mendapat kelas `is-active`; mengganti tema berarti crossfade `opacity` 0,9 detik (`--backdrop-fade`) tanpa memasang/membongkar elemen. Lapisan tidak aktif memakai `visibility: hidden` sehingga tidak dirender dan animasinya berhenti. Tiap lapisan tersusun dari:

- elemen itu sendiri: gradien latar (CSS murni),
- `::before`: ubin partikel SVG kecil yang digeser hanya dengan `transform: translate3d` (hemat, berjalan di compositor, 60 FPS),
- `::after`: siluet SVG inline statis yang diulang horizontal (tanpa animasi, tanpa file gambar eksternal).

**Kait gaya untuk pengembang:**

- `<html data-page-theme="{id}">` diatur `App.jsx`; gunakan untuk aturan CSS yang bergantung pada tema.
- `--page-ink` dan `--page-ink-soft` adalah warna teks yang langsung berada di atas latar (judul lobi, judul dan keterangan papan di layar permainan). Nilainya ditentukan per tema di `backdrop.css`. Teks yang berada di kartu/panel putih tetap memakai `text-wa-ink`.
- `--tile`, `--fx-anim`, `--fx-dur`, `--sil-h` mengatur ukuran ubin partikel, animasi, durasi, dan tinggi siluet tiap lapisan.
- `BOARD_THEMES[i].backdrop` menamai lapisan yang dipakai tema itu.

**Keterbacaan dan performa.** Latar berada di belakang semua konten dan tidak menerima klik, jadi tidak pernah menutupi papan atau tombol; kartu, papan, dan panel tetap buram. Semua latar dibuat cukup gelap untuk teks terang, ditambah vignette tipis di tepi. Tombol di header layar permainan memakai latar putih agar terbaca di semua tema. Tidak ada `filter`/`blur` dan tidak ada gambar eksternal; seluruh grafis latar sekitar 32 KB CSS (±5 KB setelah gzip). Pengguna dengan `prefers-reduced-motion` tidak mendapat partikel bergerak dan crossfade menjadi nyaris instan.

Pada mode Mobile (`data-layout='mobile'`), kolom selebar ponsel tidak lagi mengecat kanvas buram, sehingga latar tampak di seluruh lebar layar.

### Musik per tema

Setiap tema juga memilih musik latarnya sendiri lewat field `bgm` di `BOARD_THEMES` (preset ada di `src/data/bgmPresets.js`). Musik berganti dengan crossfade 2,2 detik saat tema diubah dan mengikuti volume/mute di Settings. Tabel preset dan cara kerjanya ada di [AUDIO.md](AUDIO.md).

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

1. Tambahkan entri ber-ID unik ke `BOARD_THEMES` di `src/data/boardThemes.js`, lengkap dengan field `bgm` (id preset di `src/data/bgmPresets.js`) dan `backdrop` (id lapisan latar).
2. Tambahkan blok `[data-board-theme='id-baru']` di `src/styles/board.css` dan tentukan variabel yang ingin dioverride. Gunakan nama variabel papan yang sudah ada agar kotak, badge, tangga, dan ular tetap konsisten.
3. (Opsional) Untuk hiasan bentuk khusus, tambahkan komponen kecil dengan kunci ID tema ke `SNAKE_HEADS` dan/atau `LADDER_FINIALS` di `Connections.jsx`. Gunakan kelas `board-orn-a`, `board-orn-b`, `board-orn-line`, dan `board-orn-dark` agar warnanya mengikuti `--accent-1`, `--accent-2`, dan `--cell-ink`.
4. Tambahkan lapisan `.page-backdrop__layer--id-baru` dan blok `html[data-page-theme='id-baru']` (`--page-ink`, `--page-ink-soft`) di `src/styles/backdrop.css`, serta preset musik di `bgmPresets.js`. Jalankan `npm run verify:audio` untuk memeriksa kelengkapan.
5. Pilih warna dengan kontras yang memadai untuk angka kotak dan penanda fitur. `ThemePicker` membuat pratinjau dari daftar `BOARD_THEMES`, sehingga entri baru otomatis tersedia di Settings dan layar persiapan.

Contoh kerangka tema:

```css
.board[data-board-theme='ocean'] {
  --board-frame: #075985;
  --board-bg: #e0f2fe;
  --cell-a: #f0f9ff;
  --cell-b: #bae6fd;
  --cell-ink: #082f49;
  --accent-1: #0f766e;
  --accent-2: #fde68a;
  --ladder-rail: #0f766e;
  --snake-body: #be123c;
  --snake-edge: #ffffff;
  --snake-edge-width: 0.4;
}
```
