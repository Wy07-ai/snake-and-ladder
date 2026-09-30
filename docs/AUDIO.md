# Sistem Audio

## Pendahuluan

Permainan ini menggunakan Web Audio API untuk menghasilkan musik dan efek suara secara sintetis. Tidak ada file audio eksternal seperti MP3 atau WAV yang perlu diunduh atau dimuat. Pendekatan ini menjaga ukuran aset tetap kecil dan menghindari proses decoding file audio, sementara suara dibentuk langsung oleh osilator, noise, filter, dan envelope gain.

## Arsitektur File

- `src/audio/audioEngine.js` adalah mesin audio. Modul ini membuat `AudioContext`, bus gain untuk BGM dan SFX, serta compressor ringan. Fungsi `tone()` membentuk nada dari osilator dan envelope; `noise()` membuat noise terfilter. `playSfx()` memilih efek suara, sedangkan `startBgm()`, `setBgmTheme()`, dan `stopBgm()` mengelola musik latar.
- `src/data/bgmPresets.js` menyimpan preset musik tiap tema (data murni: tempo, akor, melodi, bentuk gelombang, filter). `src/data/boardThemes.js` memetakan tiap tema ke satu preset lewat field `bgm`.
- `src/audio/useAudioSync.js` menghubungkan Settings React dengan mesin audio. Hook ini mengambil volume efektif, mengirimkannya melalui `setVolumes()`, memulai atau menghentikan BGM, mengganti musik saat tema papan berubah (`setBgmTheme()`), membuka kunci audio setelah interaksi pengguna pertama, dan menjeda audio ketika tab disembunyikan.

```text
SettingsProvider / SettingsScreen
             |
             v
       useAudioSync  ------> audioEngine
                                |       |
                             BGM bus  SFX bus
                                \       /
                                 compressor
                                      |
                               AudioContext.destination
```

## Efek Suara (SFX)

Semua suara SFX dijadwalkan pada waktu audio yang tepat menggunakan waktu `AudioContext`, bukan diputar dari rekaman. Osilator menghasilkan komponen bernada; noise terfilter menambahkan tekstur seperti klik atau desis.

- **Kocokan dadu (`diceRoll`)**: urutan klik mengikuti titik benturan pada animasi. Saat dadu mencapai puncak lemparan, ada desis naik dan nada rendah. Ketukan tipis mengisi waktu di udara, lalu bunyi benturan terkuat menandai pendaratan dan diikuti pantulan-pantulan kecil. Timing-nya memakai konstanta animasi dadu dari `src/engine/gameEngine.js`.
- **Langkah pion (`step`)**: setiap langkah berupa nada pendek berbentuk gelombang segitiga dengan sedikit noise frekuensi tinggi. Nada berpindah sepanjang skala pentatonik mayor agar rangkaian langkah terasa naik.
- **Naik tangga (`ladder`)**: arpeggio nada yang meningkat dimainkan berurutan. Lapisan nada sine satu oktaf lebih tinggi dan beberapa nada akhir yang lebih panjang memberi aksen berkilau.
- **Terperosok ular (`snake`)**: osilator sawtooth meluncur turun dari frekuensi tinggi ke rendah melalui filter low-pass. LFO memberi getaran, noise high-pass menambahkan desis, dan nada sine rendah menjadi aksen benturan di akhir.
- **Dialog bot (`dialog`)**: setiap baris mendapat dua blip gelombang persegi yang pendek; frekuensi dasarnya sedikit diacak agar bunyinya tidak selalu identik.

## Musik Latar (BGM)

BGM dibangkitkan secara dinamis dari osilator dan pola nada yang tersimpan sebagai **preset** di `src/data/bgmPresets.js`. Setiap tema papan punya preset sendiri (field `bgm` di `BOARD_THEMES`), jadi musik ikut berganti ketika pemain memilih tema baru. Semua preset memakai struktur yang sama: progresi empat akor yang berulang setiap delapan bar, pad akor lembut, bass, melodi (frasa A untuk bar 1–4, frasa B untuk bar 5–8), dan perkusi tipis. Yang berbeda antar-tema adalah tempo, swing, tangga nada, bentuk gelombang tiap lapisan, gaya perkusi, dan warna filter.

| Tema | Preset (`bgm`) | Nama | Tempo | Karakter |
| --- | --- | --- | --- | --- |
| Classic | `classic` | Sunny Chat | 100 BPM | C–Am–F–G, marimba sine, shaker; musik asli permainan. |
| Cyberpunk | `cyberpunk` | Neon Drive | 112 BPM | Synthwave A minor, bass sawtooth, lead persegi, filter 2,6 kHz. |
| Jungle | `jungle` | Rainforest Drums | 104 BPM | Pentatonik D, swing kuat, perkusi kayu (tick). |
| China / Orient Express | `china` | Silk Road Lanterns | 84 BPM | Pentatonik ala guzheng, pad sine, dentingan lonceng. |
| Christmas | `christmas` | Sleigh Bells | 108 BPM | G mayor hangat, lonceng kereta salju. |
| Halloween | `halloween` | Haunted Waltz | 96 BPM | A minor harmonis, pad gelap, lonceng celesta. |
| Desert Oasis | `desert` | Oasis Caravan | 88 BPM | Skala frigia-dominan (ala Hijaz), bass drone, tick. |
| Royal Victorian | `royal` | Court Minuet | 92 BPM | Menuet barok yang anggun, lead segitiga. |
| Infernal Abyss | `hell` | Ember Abyss | 76 BPM | Register rendah, sawtooth berat, lonceng dalam, filter 1,5 kHz. |

Penjadwal lookahead menjadwalkan nada hingga 1,2 detik ke depan dan memeriksa jadwal setiap 150 ms. Cara ini menjaga timing lebih stabil meskipun timer JavaScript tidak presisi. Tempo tiap preset dihitung dari `bpm`-nya sendiri.

### Ganti tema = crossfade

Setiap sesi BGM adalah rantai `gain -> lowpass filter -> bus BGM` dengan penjadwal sendiri. Ketika tema berganti, `useAudioSync` memanggil `setBgmTheme(presetId)`:

1. Jika BGM sedang berbunyi, sesi baru dibuat dan naik dari senyap ke penuh selama 2,2 detik, sementara sesi lama turun ke senyap dalam waktu yang sama. Keduanya berbunyi bersamaan selama crossfade, jadi tidak ada jeda hening dan tidak ada potongan mendadak.
2. Setelah fade-out selesai, penjadwal dan node sesi lama dilepas (tidak ada kebocoran node atau timer).
3. Pergantian cepat (misalnya menekan beberapa tema berturut-turut) aman: tiap sesi memudar dari nilai gain-nya saat itu, dan hanya sesi terakhir yang tersisa.
4. Memilih tema yang sama tidak melakukan apa pun. ID preset yang tidak dikenal jatuh ke `classic`.
5. Jika BGM sedang mati (mute, volume BGM 0, atau audio belum dibuka kuncinya), tema hanya diingat; `startBgm()` berikutnya langsung memutar musik tema itu.

Karena crossfade terjadi di antara sesi (bukan di bus BGM), volume Master/BGM/mute tetap mengendalikan bus yang sama dan tetap berlaku selama dan sesudah crossfade.

## Pengaturan dan Interaksi Pengguna

### Kebijakan autoplay

Browser umumnya menahan pemutaran audio sebelum ada interaksi pengguna. `useAudioSync` memasang listener untuk `pointerdown`, `touchend`, `click`, dan `keydown`. Interaksi pertama memanggil `unlockAudio()`, yang membuat atau melanjutkan `AudioContext`. Jika browser belum mengizinkan audio, listener tetap terpasang sampai konteks berhasil berjalan. Sebelum itu, pemanggilan SFX tidak menghasilkan suara.

### Volume dan mute

Settings menyediakan volume **Master**, **BGM**, dan **SFX**, serta kontrol mute. Nilai slider disimpan dalam rentang 0–100 bersama pengaturan aplikasi; mesin audio menerima nilai efektif dalam rentang 0–1:

```js
effectiveVolume = muted ? 0 : (master / 100) * (channelVolume / 100)
```

Nilai efektif BGM dan SFX dikirim ke bus gain masing-masing melalui `setVolumes()`. Perubahan volume diterapkan dengan transisi gain singkat agar tidak terdengar mendadak. Saat mute aktif, kedua nilai efektif menjadi nol; unmute mengembalikan audio mengikuti nilai slider. BGM mulai ketika volumenya lebih dari nol dan audio sudah dibuka kuncinya. Ketika tab menjadi tersembunyi, konteks audio dijeda dan dilanjutkan kembali saat tab aktif.

Mute dan slider tetap berlaku untuk musik tema. Mute mematikan semua sesi BGM (termasuk yang sedang crossfade); mengganti tema saat mute tidak menyalakan suara, dan saat unmute musik tema terbaru yang diputar.

## Menambah atau Mengubah Musik Tema

1. Tambahkan preset ber-ID unik ke `BGM_PRESETS` di `src/data/bgmPresets.js`. Bentuknya didokumentasikan di komentar file itu: `bpm`, `swing`, empat `chords`, `melodyA`/`melodyB` (4 bar × 8 langkah, `null` = diam), `voices`, `gains`, `perc` (`shaker`, `tick`, `bell`, atau `none`), dan `filter`.
2. Arahkan tema ke preset itu lewat field `bgm` di `src/data/boardThemes.js`.
3. Jalankan `npm run verify:audio`. Skrip ini memakai `AudioContext` tiruan (tanpa browser) untuk memeriksa bahwa sembilan tema punya preset yang valid, crossfade menyisakan satu sesi, mute tidak menyalakan musik, dan id tidak dikenal jatuh ke Classic.
