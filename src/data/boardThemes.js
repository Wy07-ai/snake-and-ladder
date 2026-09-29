// Daftar tema papan. Warna & gaya visual tiap tema ada di styles/board.css
// (selector [data-board-theme='id']); file ini hanya identitas dan teks pilihan.
export const BOARD_THEMES = [
  { id: 'classic', label: 'Classic', emoji: '🎲', description: 'Hijau segar ala obrolan grup.' },
  { id: 'cyberpunk', label: 'Cyberpunk', emoji: '🌃', description: 'Neon menyala di malam kota.' },
  { id: 'jungle', label: 'Jungle', emoji: '🌴', description: 'Petualangan di tengah rimba.' },
]

export const DEFAULT_BOARD_THEME = 'classic'
