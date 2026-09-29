# Bot, Persona, dan Dialog RPG

## Pendahuluan

Bot memiliki persona untuk memberi dinamika obrolan bergaya RPG selama permainan. Pemain tidak mengetik pesan: dialog muncul otomatis sebagai reaksi satu arah terhadap event permainan, seperti naik tangga, terkena ular, atau mendekati finis. Reaksi dipilih dari kumpulan variasi, diberi nama dan data persona bot, lalu ditampilkan dalam kotak dialog.

## Profil dan Persona Bot

Profil yang dimaksudkan untuk tiga bot bawaan:

| Bot | Persona | Avatar dialog | Warna persona |
| --- | --- | --- | --- |
| Rizky | Toksik, mudah emosi, dan kompetitif | 🤬 | `#c92a2a` |
| Bagas | Santuy, humoris, dan suka meme | 🤣 | `#e67700` |
| Davin | Dingin, kalkulatif, dan fokus strategi/angka | 🧠 | `#1971c2` |

Nama tampil dapat diganti melalui pengaturan pemain; ID persona tetap `rizky`, `bagas`, dan `davin`. Catatan implementasi: label slot di `src/data/playerNames.js` sudah memakai karakter yang dimaksudkan di atas, tetapi properti `style` di `src/data/botPersonas.js` saat ini berbeda: Rizky tercatat "Santai dan santun", Bagas "Kompetitif dan sarkastis", dan Davin "Humoris dan memeable". Sejumlah teks reaksi juga masih mencerminkan gaya lama tersebut. Selaraskan data persona dan variasi dialog bila profil pada tabel harus menjadi perilaku runtime.

## Arsitektur dan File Terkait

### Data

- `src/data/botPersonas.js` menyimpan metadata per persona: `id`, `name`, `avatar`, `style`, dan `color`. Warna dipakai untuk bingkai/nama di dialog; avatar menjadi indikator ekspresi.
- `src/data/chatTriggers.js` menyimpan variasi dialog yang dikelompokkan menurut nama event. Setiap reaksi berisi `personaId`, `emotion`, dan `text`. Teks dapat memakai placeholder seperti `{player}`, `{target}`, `{dice}`, `{streak}`, dan `{position}`.
- `src/data/dialogTiming.js` mengatur tempo dialog: ketikan per karakter, jeda membaca setelah teks selesai, jeda sapaan awal, batas antrean, dan fungsi untuk menghitung lama satu baris.

### Hook dan komponen

- `src/hooks/useAutoChat.js` menerima event dari `useGame`, memilih reaksi, mengganti placeholder, lalu mengatur antrean. Hanya satu baris tampil pada satu waktu. Maksimal dua baris menunggu; ketika antrean penuh, baris menunggu yang paling lama dibuang. `GAME_OVER` adalah event interupsi yang mengganti dialog/antrean saat ini.
- `src/components/chat/RpgDialog.jsx` menampilkan kotak dialog, potret bidak pembicara bila pemainnya ditemukan, avatar ekspresi, dan nama dengan warna persona.
- `src/components/chat/TypewriterText.jsx` menampilkan teks huruf demi huruf. Kecepatan dasarnya 26 ms per karakter; koma menambah jeda 50 ms dan `.`, `!`, `?` menambah 90 ms. Jika sistem pengguna memilih reduced motion, teks langsung ditampilkan penuh.
- `src/screens/GameScreen.jsx` menghubungkan `useGame` ke `useAutoChat`, merender `RpgDialog`, dan memainkan blip dialog setiap kali baris mulai tampil.

Satu baris biasanya bertahan selama durasi ketikan ditambah jeda baca 1.900 ms. Sapaan pembuka dijadwalkan 350 ms setelah hook dipasang.

## Mekanisme Pemicu Dialog

`src/hooks/useGame.js` mengirim event berikut ke hook dialog:

| Event | Kondisi pemicu |
| --- | --- |
| `GAME_START` | Sapaan pembuka setelah layar permainan aktif. |
| `LADDER_CLIMB` | Pemain mendarat di petak tangga dan berpindah naik. |
| `SNAKE_BITE` | Pemain mendarat di petak ular dan meluncur turun. |
| `OVERTAKE` | Pemain melewati setidaknya satu lawan yang sebelumnya berada di depannya. Target pertama yang ditemukan dikirim sebagai `extra.target`. Tidak dipicu jika posisi akhir 100. |
| `CLUTCH_ZONE` | Posisi pion bergerak dari bawah petak 90 ke petak 90 atau lebih. |
| `DICE_SIX` | Lemparan menghasilkan 6 dan bukan bagian dari rangkaian angka yang sama. |
| `DICE_STREAK` | Lemparan menghasilkan angka yang sama dengan lemparan pemain sebelumnya. Ini berlaku untuk angka apa pun; enam yang berulang masuk ke event ini, bukan `DICE_SIX`. |
| `GAME_OVER` | Permainan menetapkan pemenang sesuai finish mode. Event ini langsung mengganti dialog yang sedang tampil. |

Event dadu tertentu memiliki peluang untuk berbicara sebelum reaksi dipilih:

| Event | Peluang dasar |
| --- | ---: |
| `DICE_SIX` | 60% |
| `DICE_STREAK` | 90% |
| `OVERTAKE` | 80% |

Kesulitan mengubah peluang tersebut: mudah mengalikan dengan 0,6, sedang memakai nilai dasar, dan sulit mengalikan dengan 1,5 (maksimum 100%). Event lain tidak memiliki pengali peluang dan selalu mencoba memilih reaksi.

Saat memilih pembicara, bot yang melakukan aksi dan bot yang menjadi target dihindari jika ada persona lain yang cocok. Emosi yang disukai berbeda menurut event; reaksi yang baru saja dipakai untuk event yang sama juga dihindari selama masih ada alternatif. Setelah pemilihan, placeholder diganti dengan nama dan nilai event yang tersedia.

## Panduan Kustomisasi

### Menambah variasi dialog

Tambahkan variasi pada event yang sesuai di `src/data/chatTriggers.js`. Helper lokal `reactions()` mengubah pasangan emosi/teks menjadi objek reaksi untuk persona yang disebutkan:

```js
...reactions('rizky', [
  ['sarcastic', '{player} naik ke petak {position}. Jangan terlalu cepat merayakan.'],
  ['confident', 'Saya sudah memperhitungkan peluang ini.'],
]),
```

Pastikan nama placeholder didukung oleh `triggerEvent()` di `useAutoChat.js`. Saat menambah event baru, kirim event dari `useGame`, tambahkan variasi dengan nama event yang sama di `CHAT_TRIGGERS`, dan sesuaikan `EVENT_CHANCE` atau daftar emosi pilihan di `useAutoChat` bila diperlukan. Untuk event yang harus memotong dialog, tambahkan ke `INTERRUPT_EVENTS`.

### Menambah bot baru

Tambahkan metadata bot di `src/data/botPersonas.js`, lalu gunakan ID yang sama untuk seluruh integrasi. Tambahkan reaksi untuk persona baru ke event yang diinginkan di `src/data/chatTriggers.js`; jika tidak ada reaksi untuk event tersebut, bot tidak dapat dipilih untuk event itu.

Untuk menjadikannya bot yang dapat dimainkan, perubahan di dua file data dialog saja belum cukup. Registri pemain berada di `BOT_PLAYERS` dalam `src/engine/gameEngine.js`, sedangkan slot nama dan ID yang valid berada di `NAME_SLOTS` dalam `src/data/playerNames.js`. Perbarui registri tersebut dan titik UI/konfigurasi terkait agar bot dapat dipilih. ID harus konsisten karena dipakai untuk mencocokkan persona, pemain yang berbicara, nama kustom, dan potret.