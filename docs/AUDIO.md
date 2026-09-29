# Sistem Audio

## Pendahuluan

Permainan ini menggunakan Web Audio API untuk menghasilkan musik dan efek suara secara sintetis. Tidak ada file audio eksternal seperti MP3 atau WAV yang perlu diunduh atau dimuat. Pendekatan ini menjaga ukuran aset tetap kecil dan menghindari proses decoding file audio, sementara suara dibentuk langsung oleh osilator, noise, filter, dan envelope gain.

## Arsitektur File

- `src/audio/audioEngine.js` adalah mesin audio. Modul ini membuat `AudioContext`, bus gain untuk BGM dan SFX, serta compressor ringan. Fungsi `tone()` membentuk nada dari osilator dan envelope; `noise()` membuat noise terfilter. `playSfx()` memilih efek suara, sedangkan `startBgm()` dan `stopBgm()` mengelola musik latar.
- `src/audio/useAudioSync.js` menghubungkan Settings React dengan mesin audio. Hook ini mengambil volume efektif, mengirimkannya melalui `setVolumes()`, memulai atau menghentikan BGM, membuka kunci audio setelah interaksi pengguna pertama, dan menjeda audio ketika tab disembunyikan.

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

BGM dibangkitkan secara dinamis dari osilator dan pola nada yang tersimpan di kode. Musik memakai progresi akor C–Am–F–G pada 100 BPM dengan sedikit swing, dan berulang setiap delapan bar. Susunannya mencakup pad akor lembut, bass, melodi bernada sine, serta shaker noise tipis. Pola melodi berganti antara dua frasa.

Penjadwal lookahead menjadwalkan nada hingga 1,2 detik ke depan dan memeriksa jadwal setiap 150 ms. Cara ini menjaga timing lebih stabil meskipun timer JavaScript tidak presisi. BGM memiliki fade-in saat mulai dan fade-out saat dihentikan.

## Pengaturan dan Interaksi Pengguna

### Kebijakan autoplay

Browser umumnya menahan pemutaran audio sebelum ada interaksi pengguna. `useAudioSync` memasang listener untuk `pointerdown`, `touchend`, `click`, dan `keydown`. Interaksi pertama memanggil `unlockAudio()`, yang membuat atau melanjutkan `AudioContext`. Jika browser belum mengizinkan audio, listener tetap terpasang sampai konteks berhasil berjalan. Sebelum itu, pemanggilan SFX tidak menghasilkan suara.

### Volume dan mute

Settings menyediakan volume **Master**, **BGM**, dan **SFX**, serta kontrol mute. Nilai slider disimpan dalam rentang 0–100 bersama pengaturan aplikasi; mesin audio menerima nilai efektif dalam rentang 0–1:

```js
effectiveVolume = muted ? 0 : (master / 100) * (channelVolume / 100)
```

Nilai efektif BGM dan SFX dikirim ke bus gain masing-masing melalui `setVolumes()`. Perubahan volume diterapkan dengan transisi gain singkat agar tidak terdengar mendadak. Saat mute aktif, kedua nilai efektif menjadi nol; unmute mengembalikan audio mengikuti nilai slider. BGM mulai ketika volumenya lebih dari nol dan audio sudah dibuka kuncinya. Ketika tab menjadi tersembunyi, konteks audio dijeda dan dilanjutkan kembali saat tab aktif.