const reactions = (personaId, lines) => lines.map(([emotion, text]) => ({ personaId, emotion, text }))

export const CHAT_TRIGGERS = {
  GAME_START: [
    ...reactions('rizky', [
      ['playful', 'Silakan mulai kalau sudah siap. Semoga dadu kita bersahabat!'],
      ['confident', 'Baik, kita mulai. Saya akan bermain dengan tenang dan cermat.'],
      ['playful', 'Semoga semua menikmati permainan. Tapi saya tetap ingin menang, ya.'],
      ['confident', 'Papan sudah siap. Mari kita lihat siapa yang paling konsisten.'],
    ]),
    ...reactions('bagas', [
      ['competitive', 'Semua siap? Bagus. Jangan kaget kalau saya langsung memimpin.'],
      ['sarcastic', 'Silakan pemanasan dulu. Saya tunggu di garis finis.'],
      ['competitive', 'Strategi sudah matang. Kalian tinggal berusaha menyusul.'],
      ['playful', 'Mulai sekarang, alasan kalah sebaiknya disiapkan dari awal.'],
    ]),
    ...reactions('davin', [
      ['playful', 'Papan terbuka. Semoga keberuntungan sudah memperbarui aplikasinya.'],
      ['confident', 'Simulasi selesai: kemungkinan besar akan ada yang menyalahkan dadu.'],
      ['playful', 'Semoga tidak ada ular yang sedang mencari konten hari ini.'],
      ['confused', 'Semua pemain siap? Sistem mendeteksi optimisme yang mencurigakan.'],
    ]),
  ],
  LADDER_CLIMB: [
    ...reactions('rizky', [
      ['excited', 'Wah, {player} naik tangga! Selamat, semoga lancarnya sampai finis.'],
      ['proud', 'Langkah bagus, {player}. Saya akui itu cukup mengesankan.'],
      ['playful', 'Tangga yang beruntung, {player}. Nanti gantian saya, ya.'],
      ['sarcastic', 'Silakan menikmati pemandangannya dari atas, {player}. Kami menyusul.'],
    ]),
    ...reactions('bagas', [
      ['competitive', '{player} naik tangga? Pemanasan yang bagus. Coba kejar saya sekarang.'],
      ['sarcastic', 'Wah, {player} dapat jalur VIP. Papan ini pilih kasih, ya?'],
      ['proud', 'Nice, {player}. Jangan terlalu lama merayakan, posisi saya masih di depan.'],
      ['sarcastic', '{player} naik tangga, langsung merasa jadi juara. Lucu juga.'],
    ]),
    ...reactions('davin', [
      ['excited', '{player} naik tangga! Kecepatan progres meningkat, begitu juga rasa percaya diri.'],
      ['playful', 'Tangga terdeteksi. {player} baru saja memakai fitur fast travel.'],
      ['sarcastic', 'Grafik posisi {player} naik. Grafik kesombongan mungkin ikut menyusul.'],
      ['confused', 'Kenaikan mendadak. Saya perlu memeriksa apakah tangganya punya turbo.'],
    ]),
  ],
  SNAKE_BITE: [
    ...reactions('rizky', [
      ['frustrated', 'Aduh, {player} turun jauh. Semoga cepat bisa naik lagi.'],
      ['resigned', 'Yah, ularnya menang kali ini. Tetap semangat, {player}.'],
      ['confused', 'Kasihan sekali, {player}. Kenapa ular selalu muncul di saat penting?'],
      ['angry', 'Aduh, ular itu benar-benar merusak rencana {player}. Menyebalkan sekali.'],
    ]),
    ...reactions('bagas', [
      ['sarcastic', 'Ekspres turun khusus {player}, tanpa perlu reservasi.'],
      ['competitive', 'Ular menarik {player} mundur. Kesempatan saya memperlebar jarak!'],
      ['sarcastic', 'Baru saja naik daun, sekarang turun bersama ularnya.'],
      ['resigned', 'Papan memberi {player} jalur alternatif. Arahnya memang ke bawah.'],
    ]),
    ...reactions('davin', [
      ['confused', 'Posisi {player} turun drastis. Ular itu tampaknya punya agenda sendiri.'],
      ['resigned', 'Kemajuan {player} dihapus oleh satu ular. Tombol undo tidak tersedia.'],
      ['frustrated', 'Rencana perjalanan berubah: {player} kini mengambil rute bawah.'],
      ['playful', 'Ular membawa {player} turun. Layanan lift papan sedang tidak beroperasi.'],
    ]),
  ],
  OVERTAKE: [
    ...reactions('rizky', [
      ['excited', '{player} berhasil melewati {target}! Bagus, pertahankan posisinya.'],
      ['sarcastic', 'Wah, {player} menyalip {target}. Semoga tidak lupa melihat ke belakang.'],
      ['playful', 'Selisih posisi berubah. {target}, masih sempat mengejar, kok.'],
      ['proud', 'Manuver yang rapi dari {player}. Saya harus mengakui itu.'],
    ]),
    ...reactions('bagas', [
      ['competitive', '{player} menyalip {target}? Catat dulu, nanti saya lewati kalian berdua.'],
      ['sarcastic', 'Selamat, {player}. Satu lawan terlewati, tinggal pemain yang benar-benar cepat.'],
      ['competitive', '{player} lewat di depan {target}. Oke, sekarang coba susul saya.'],
      ['sarcastic', '{target} disalip {player}. Saya pura-pura tidak melihat kepanikan itu.'],
    ]),
    ...reactions('davin', [
      ['playful', '{player} melewati {target}. Peringatan: ego kedua pemain mungkin bertabrakan.'],
      ['sarcastic', 'Perubahan peringkat terdeteksi. {target}, ini bukan notifikasi yang menyenangkan.'],
      ['excited', '{player} kini di depan {target}. Grafik persaingan mulai menarik.'],
      ['confused', '{player} menyalip {target}. Apakah ini strategi atau dadu sedang berlari?'],
    ]),
  ],
  DICE_SIX: [
    ...reactions('rizky', [
      ['excited', 'Angka enam untuk {player}! Lemparan ekstra, semoga beruntung lagi.'],
      ['suspicious', 'Enam lagi? Eh, baru sekali. Saya terlalu curiga pada dadu ini.'],
      ['playful', 'Bagus, {player}. Dadu sedang berbaik hati, silakan dimanfaatkan.'],
      ['confused', 'Angka enam! Sepertinya dadu sedang ingin membantu {player}.'],
    ]),
    ...reactions('bagas', [
      ['competitive', 'ENAM! {player} boleh lempar lagi, tapi jangan harap saya ikut senang.'],
      ['sarcastic', 'Dadu memberi {player} bonus. Wah, ada yang punya orang dalam.'],
      ['excited', 'Angka enam! Gas terus, {player}. Tapi jangan sampai mendahului saya.'],
      ['competitive', 'Lemparan ekstra untuk {player}. Baiklah, jarak aman saya berkurang.'],
    ]),
    ...reactions('davin', [
      ['excited', 'Enam memberi {player} satu lemparan tambahan. RNG sedang berpose.'],
      ['playful', 'Bonus lemparan aktif. Dadu baru saja membuka DLC keberuntungan.'],
      ['suspicious', 'Hasil enam terkonfirmasi. Saya tetap ingin melihat log dadu.'],
      ['confused', 'Lemparan ekstra untuk {player}. Apakah dadu punya misi sampingan?'],
    ]),
  ],
  DICE_STREAK: [
    ...reactions('rizky', [
      ['frustrated', 'Angka {dice} lagi untuk {player}? Saya ikut heran sekaligus kesal.'],
      ['suspicious', '{player} mendapat {dice} sebanyak {streak} kali. Dadu ini yakin tidak macet?'],
      ['resigned', '{dice} terus untuk {player}. Baiklah, mungkin memang sudah takdir dadu.'],
      ['confused', 'Hasilnya {dice} lagi? Saya mulai bertanya-tanya pada papan ini.'],
      ['excited', '{player} mendapat {dice} berulang kali! Keberuntungan sedang berpihak.'],
    ]),
    ...reactions('bagas', [
      ['suspicious', '{dice} lagi, {player}? Dadu kalian sudah latihan bersama sebelumnya?'],
      ['frustrated', '{player} dapat {dice} terus. Saya ingin protes, tapi siapa yang menerima?'],
      ['competitive', '{dice} muncul {streak} kali untuk {player}. Oke, saya tetap bisa mengejar.'],
      ['resigned', 'Dadu memilih angka {dice} lagi. Saya anggap ini keputusan manajemen.'],
      ['excited', '{player} dapat {dice} lagi! Dadu sedang melakukan speedrun keberuntungan.'],
    ]),
    ...reactions('davin', [
      ['confused', 'Angka {dice} berulang {streak} kali. Apakah RNG sedang mengulang dialog?'],
      ['suspicious', 'Pola {dice} terdeteksi pada lemparan {player}. Saya perlu audit dadu.'],
      ['resigned', '{dice} lagi. Sistem menerima nasib, meski belum memahami algoritmanya.'],
      ['frustrated', 'Probabilitas mulai terasa personal. {player} mendapat {dice} lagi.'],
      ['playful', 'RNG memilih {dice} sebanyak {streak} kali. Tombol shuffle tidak ditemukan.'],
    ]),
  ],
  CLUTCH_ZONE: [
    ...reactions('rizky', [
      ['tense', '{player} sudah di petak {position}. Tinggal sedikit lagi, tetap tenang!'],
      ['nervous', 'Garis akhir makin dekat, {player}. Semoga tidak ada ular yang mengintai.'],
      ['dramatic', 'Semua lemparan terasa penting sekarang. Ayo, {player}, kamu bisa!'],
      ['excited', '{player} memasuki petak 90+. Saya ikut tegang melihatnya.'],
    ]),
    ...reactions('bagas', [
      ['competitive', 'Petak {position}, {player}? Jangan gugup. Saya cuma tinggal menyusul.'],
      ['sarcastic', 'Final stretch! Ular terakhir mungkin sedang menunggu tanda tangan juara.'],
      ['tense', '{player} makin dekat finis. Baiklah, sekarang persaingannya mulai serius.'],
      ['dramatic', 'Semua menahan napas... kecuali saya, saya masih sempat mengejek.'],
    ]),
    ...reactions('davin', [
      ['tense', '{player} mencapai petak {position}. Tingkat ketegangan naik secara tidak ilmiah.'],
      ['dramatic', 'Petak 90+ terdeteksi. Musik boss battle seharusnya mulai sekarang.'],
      ['nervous', 'Setiap lemparan menentukan. Saya mendadak lupa semua hitungan peluang.'],
      ['playful', '{player} mendekati finis. Ular terakhir, mohon jangan muncul sebagai plot twist.'],
    ]),
  ],
  GAME_OVER: [
    ...reactions('rizky', [
      ['celebratory', 'Selamat, {player}! Permainan yang bagus. Kita rematch nanti, ya.'],
      ['resigned', 'Baiklah, {player} menang kali ini. Saya terima hasilnya dengan lapang dada.'],
      ['playful', 'Kemenangan yang pantas, {player}. Tapi ronde berikutnya milik saya!'],
      ['sarcastic', 'Selamat, {player}. Dadu tampaknya memang sedang menjadi temanmu.'],
    ]),
    ...reactions('bagas', [
      ['celebratory', 'GG, {player}! Menang dulu saja, saya sedang menyusun strategi balas dendam.'],
      ['resigned', 'Oke, {player} juara. Saya cuma kalah karena papan tidak memahami potensi saya.'],
      ['sarcastic', 'Selamat, {player}. Momen ini boleh dinikmati sebelum rematch.'],
      ['competitive', '{player} menang! Catat hasilnya, saya minta pertandingan ulang.'],
    ]),
    ...reactions('davin', [
      ['celebratory', '{player} menang. Prediksi meleset, tetapi dramanya sesuai ekspektasi.'],
      ['resigned', 'Permainan selesai. Saya akan menyalahkan varians, bukan kemampuan.'],
      ['playful', 'Selamat, {player}! Statistik menyebut ini kemenangan, bukan plot armor.'],
      ['confused', '{player} menang. Saya butuh waktu untuk memperbarui model kepercayaan diri.'],
    ]),
  ],
}

export const EVENT_CHANCE = {
  DICE_SIX: 0.6,
  DICE_STREAK: 0.9,
  OVERTAKE: 0.8,
}

export const INTERRUPT_EVENTS = ['GAME_OVER']
