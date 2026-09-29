export const CHAT_TRIGGERS = {
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