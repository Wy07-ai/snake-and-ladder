// Daftar tema papan. Warna & gaya visual tiap tema ada di styles/board.css
// (selector [data-board-theme='id']); file ini hanya identitas dan teks pilihan.
// Bentuk hiasan ular/tangga per tema (kepala, ujung tangga) ada di
// components/board/Connections.jsx dan dipilih lewat `id` tema.
export const BOARD_THEMES = [
  { id: 'classic', label: 'Classic', emoji: '🎲', description: 'Hijau segar ala obrolan grup.' },
  { id: 'cyberpunk', label: 'Cyberpunk', emoji: '🌃', description: 'Neon menyala di malam kota.' },
  { id: 'jungle', label: 'Jungle', emoji: '🌴', description: 'Petualangan di tengah rimba.' },
  { id: 'china', label: 'China / Orient Express', emoji: '🏮', description: 'Merah emas, lentera, naga sutra, dan tangga bambu.' },
  { id: 'christmas', label: 'Christmas', emoji: '🎄', description: 'Salju, permen tongkat, es runcing, dan tangga kereta salju.' },
  { id: 'halloween', label: 'Halloween', emoji: '🎃', description: 'Malam seram ungu-oranye, jaring laba-laba, dan tengkorak.' },
  { id: 'desert', label: 'Desert Oasis', emoji: '🏜️', description: 'Pasir emas, mozaik toska, ular gurun, dan karpet ajaib.' },
  { id: 'royal', label: 'Royal Victorian', emoji: '👑', description: 'Beludru biru, daun emas, pita merah, dan tangga spiral.' },
  { id: 'hell', label: 'Infernal Abyss', emoji: '🔥', description: 'Lava merah, obsidian, rantai api, dan tangga tulang.' },
]

export const DEFAULT_BOARD_THEME = 'classic'
