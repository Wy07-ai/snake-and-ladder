// Dialog bot per kejadian permainan. Placeholder: {player} = pemain yang mengalami
// kejadian, {target} = lawan yang disalip (hanya OVERTAKE). Bot tidak pernah
// membicarakan dirinya sendiri: pilihan dialog diseleksi oleh useAutoChat.
export const CHAT_TRIGGERS = {
  GAME_START: [
    { personaId: 'rizky', text: 'Cepat lempar dadunya. Jangan kelamaan mikir!' },
    { personaId: 'bagas', text: 'Santuy dulu, bestie. Ular-ularnya masih tidur kok 🐍' },
    { personaId: 'davin', text: 'Peluang menang masing-masing 25%. Kita lihat siapa yang beruntung.' },
  ],
  LADDER_CLIMB: [
    { personaId: 'rizky', text: 'Wah, {player} naik tangga. Jangan sombong dulu!' },
    { personaId: 'bagas', text: '{player} nemu eskalator gratis 🤣' },
    { personaId: 'davin', text: 'Kenaikan posisi {player} mengubah peluang menang secara signifikan.' },
  ],
  SNAKE_BITE: [
    { personaId: 'rizky', text: 'Yah, {player} malah melorot. Apes banget.' },
    { personaId: 'bagas', text: 'Ular express mengantar {player} turun 🐍' },
    { personaId: 'davin', text: 'Posisi {player} turun. Keunggulan sebelumnya terhapus.' },
  ],
  OVERTAKE: [
    { personaId: 'rizky', text: '{player} nyalip {target}?! Awas, jangan sampai kesalip balik!' },
    { personaId: 'bagas', text: '{player} ngebut nyalip {target}, gaspol 🏎️' },
    { personaId: 'davin', text: '{player} kini di depan {target}. Selisih posisi berubah.' },
  ],
  DICE_SIX: [
    { personaId: 'rizky', text: 'Dapat enam? Jangan-jangan habis ini apes lagi.' },
    { personaId: 'bagas', text: 'ANGKA ENAM! Lempar lagi, {player}! 🎲' },
    { personaId: 'davin', text: 'Enam memberi satu lemparan ekstra. Manfaatkan.' },
  ],
  CLUTCH_ZONE: [
    { personaId: 'rizky', text: '{player} sudah dekat garis akhir. Jangan sampai kepleset!' },
    { personaId: 'bagas', text: 'Petak 90+! Final boss ular menunggu 🤣' },
    { personaId: 'davin', text: '{player} memasuki zona akhir. Setiap lemparan kini krusial.' },
  ],
  GAME_OVER: [
    { personaId: 'rizky', text: 'Oke, {player} menang. Rematch sekarang!' },
    { personaId: 'bagas', text: 'GG {player}! Pesta dadu dulu 🎉' },
    { personaId: 'davin', text: '{player} menang. Hasil yang konsisten.' },
  ],
}

// Peluang sebuah kejadian memicu dialog (default 1). Kejadian yang sering terjadi
// dibuat lebih jarang agar bot tidak cerewet dan antrean dialog tidak menumpuk.
export const EVENT_CHANCE = {
  DICE_SIX: 0.6,
  OVERTAKE: 0.8,
}

// Kejadian yang langsung memotong dialog yang sedang tampil.
export const INTERRUPT_EVENTS = ['GAME_OVER']
