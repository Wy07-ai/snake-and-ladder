# Aturan dan Mekanika Permainan

## Pendahuluan

Permainan ini adalah Ular Tangga klasik yang dimodifikasi dengan beberapa aturan modern: lemparan bonus untuk angka 6, batas dua angka 6 beruntun, pilihan mode kemenangan, beberapa preset papan, serta giliran bot. Logika pergerakan dan hasil permainan dipisahkan dari UI agar dapat diuji tanpa menjalankan animasi.

## Aturan Dasar Pergerakan

- Papan memiliki 100 kotak bernomor 1 sampai 100. Setiap pemain memulai di kotak 1.
- Setiap lemparan memajukan pion sejumlah langkah sesuai angka dadu, selama tidak melewati kotak 100.
- Jika pion tepat mendarat di pangkal tangga, pion naik ke ujung tangga. Jika mendarat di kepala ular, pion turun ke ujung ular.
- Perpindahan ular/tangga dilakukan setelah langkah dadu selesai. Papan dan pasangan titik awal/akhir ditentukan oleh preset yang dipilih.
- `src/data/boardData.js` berisi susunan original ular dan tangga. Preset papan lain didefinisikan di `src/data/boardPresets.js`; papan dipilih dan divalidasi melalui `src/engine/boardResolver.js` sebelum permainan dimulai.

## Mekanika Dadu dan Bonus Lemparan

### Perhitungan dadu

Untuk lemparan biasa, engine menghitung nilai dari bilangan acak `random` pada rentang 0 sampai kurang dari 1:

```js
hasil = Math.floor(random() * jumlahSisi) + 1
```

Dengan dadu enam sisi, hasilnya bilangan bulat 1-6. Bila sumber acak seragam, setiap angka memiliki peluang $1/6$. Untuk lemparan ketiga setelah dua angka 6 beruntun, `jumlahSisi` dibatasi menjadi 5 sehingga hasilnya 1-5 dan peluang mendapatkan 6 menjadi nol.

### Bonus angka 6 dan batas beruntun

Setiap angka 6 memberi pemain lemparan tambahan. Dua angka 6 berturut-turut masih sah dan memberi lemparan ketiga. Namun, lemparan ketiga menggunakan maksimal lima sisi: hasilnya tidak dapat berupa 6, sehingga giliran berakhir setelah gerakan tersebut.

Contoh:

| Urutan lemparan | Hasil | Dampak |
| --- | ---: | --- |
| Lemparan pertama | 6 | Bergerak 6 kotak, lalu mendapat bonus lemparan. |
| Lemparan kedua | 6 | Bergerak 6 kotak lagi, lalu mendapat bonus lemparan kedua. |
| Lemparan ketiga | 1-5 | Dadu dibatasi ke 1-5; bergerak sesuai hasil dan giliran berpindah. |

Jika angka kedua bukan 6, bonus tidak berlanjut dan giliran berpindah seperti biasa. Rangkaian dihitung per pemain dan direset untuk pemain tersebut ketika hasil lemparan berubah atau permainan direset.

## Exact Fit: Mendarat di Kotak 100

Untuk menang, pemain harus mendarat tepat di kotak 100. `movePlayer()` menolak langkah yang akan melewati 100; pion tetap di posisi sebelumnya dan tidak menjalankan animasi langkah.

Contoh: dari kotak 97, hasil 3 membawa pemain ke 100; hasil 4 membuat pemain tetap di 97.

Catatan implementasi: bonus 6 diproses terpisah dari pergerakan. Karena itu, jika angka 6 membuat pemain melewati kotak 100, pion memang diam, tetapi engine tetap memberikan lemparan bonus. Ini berbeda dari aturan “overshoot selalu mengakhiri giliran”; untuk mengubahnya, logika bonus di `src/hooks/useGame.js` perlu mempertimbangkan apakah gerakan diterima.

## Mode Kemenangan

| Mode | Aturan |
| --- | --- |
| **Quick Finish** (`quick`) | Permainan langsung berakhir saat pemain pertama mencapai 100. Pemain tersebut menjadi juara 1; pemain lain diurutkan berdasarkan posisi tertinggi saat game berhenti. |
| **Play to End** (`play-to-end`) | Pemain yang mencapai 100 dicatat dalam urutan finish dan dilewati pada giliran berikutnya. Permainan memberi kesempatan untuk menentukan peringkat berikutnya. |

Catatan implementasi: engine mengakhiri Play to End ketika tersisa paling banyak satu pemain yang belum finish. Artinya, pemain terakhir dapat menjadi peringkat terakhir berdasarkan posisi saat itu tanpa mencapai kotak 100; kode tidak selalu menunggu semua pemain finish seperti deskripsi label mode. Peringkat pemain yang sudah finish mengikuti urutan mereka mencapai 100.

## Alur Giliran

1. Pemain aktif melempar dadu; untuk pemain bot, jeda berpikir bergantung pada tingkat kesulitan.
2. Pion bergerak satu kotak demi satu kotak. Setelah berhenti, engine memeriksa apakah kotak akhir merupakan pangkal ular atau tangga.
3. Jika pemain mencapai 100, mode kemenangan menentukan apakah permainan berakhir atau rotasi giliran berlanjut.
4. Jika belum menang, angka 6 memberi lemparan bonus (dengan pembatasan tiga angka 6 beruntun di atas). Selain itu, giliran berpindah ke pemain aktif berikutnya.
5. Dalam Play to End, pemain yang sudah finish dilewati. Permainan berhenti saat kondisi akhir mode terpenuhi.

Bot menggunakan aturan gerakan, dadu, papan, dan kemenangan yang sama dengan pemain manusia; hanya waktu tunggu sebelum bot melempar yang berubah mengikuti kesulitan.

## Arsitektur File Terkait

- `src/engine/gameEngine.js` menyediakan fungsi aturan murni: `rollDice()`, `movePlayer()`, `getMovementSteps()`, `hasBonusRoll()`, resolusi ular/tangga, rotasi pemain aktif, dan perhitungan klasemen.
- `src/hooks/useGame.js` mengelola state dan alur giliran React: lemparan, animasi, langkah pion, bonus, perpindahan giliran, finish mode, dan reset permainan.
- `src/data/boardData.js` menyimpan daftar original ular dan tangga dalam bentuk pasangan `{ start, end }`. Konfigurasi preset tambahan berada di `src/data/boardPresets.js`.
- `src/data/finishModes.js` mendefinisikan label dan deskripsi pilihan mode; perilaku mode dijalankan di `useGame` dengan helper klasemen dari `gameEngine.js`.