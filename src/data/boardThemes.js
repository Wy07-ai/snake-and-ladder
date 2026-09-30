// Daftar tema papan. Warna & gaya visual tiap tema ada di styles/board.css
// (selector [data-board-theme='id']); file ini hanya identitas dan teks pilihan.
// Field `bgm` = id preset musik latar (data/bgmPresets.js); `backdrop` = id latar
// halaman penuh (kelas .page-backdrop__layer--{id} di styles/backdrop.css).
// Bentuk hiasan ular/tangga per tema (kepala, ujung tangga) ada di
// components/board/Connections.jsx dan dipilih lewat `id` tema.
export const BOARD_THEMES = [
  { id: 'classic', bgm: 'classic', backdrop: 'classic', label: 'Classic', emoji: '🎲', description: 'Hijau segar ala obrolan grup.' },
  { id: 'cyberpunk', bgm: 'cyberpunk', backdrop: 'cyberpunk', label: 'Cyberpunk', emoji: '🌃', description: 'Neon menyala di malam kota.' },
  { id: 'jungle', bgm: 'jungle', backdrop: 'jungle', label: 'Jungle', emoji: '🌴', description: 'Petualangan di tengah rimba.' },
  { id: 'china', bgm: 'china', backdrop: 'china', label: 'China / Orient Express', emoji: '🏮', description: 'Merah emas, lentera, naga sutra, dan tangga bambu.' },
  { id: 'christmas', bgm: 'christmas', backdrop: 'christmas', label: 'Christmas', emoji: '🎄', description: 'Salju, permen tongkat, es runcing, dan tangga kereta salju.' },
  { id: 'halloween', bgm: 'halloween', backdrop: 'halloween', label: 'Halloween', emoji: '🎃', description: 'Malam seram ungu-oranye, jaring laba-laba, dan tengkorak.' },
  { id: 'desert', bgm: 'desert', backdrop: 'desert', label: 'Desert Oasis', emoji: '🏜️', description: 'Pasir emas, mozaik toska, ular gurun, dan karpet ajaib.' },
  { id: 'royal', bgm: 'royal', backdrop: 'royal', label: 'Royal Victorian', emoji: '👑', description: 'Beludru biru, daun emas, pita merah, dan tangga spiral.' },
  { id: 'hell', bgm: 'hell', backdrop: 'hell', label: 'Infernal Abyss', emoji: '🔥', description: 'Lava merah, obsidian, rantai api, dan tangga tulang.' },
]

export const DEFAULT_BOARD_THEME = 'classic'
