// Pilihan kustomisasi bidak. Data murni (tanpa JSX) agar bisa dipakai oleh
// validasi settings, layar pengaturan, dan engine permainan sekaligus.

// Karakter yang boleh dipilih pemain. Rubah, panda, dan robot sengaja tidak
// ada di sini karena sudah dipakai bot (Rizky, Bagas, Davin).
export const HUMAN_AVATARS = [
  { id: 'cat', label: 'Kucing' },
  { id: 'bunny', label: 'Kelinci' },
  { id: 'alien', label: 'Alien' },
  { id: 'ghost', label: 'Hantu' },
  { id: 'astronaut', label: 'Astronot' },
  { id: 'frog', label: 'Katak' },
]

export const PAWN_SHAPES = [
  { id: 'circle', label: 'Bulat' },
  { id: 'square', label: 'Kotak' },
  { id: 'hexagon', label: 'Segi enam' },
  { id: 'shield', label: 'Perisai' },
]

// Palet tidak memuat merah, oranye, dan biru tua milik bot, jadi bidak pemain
// tidak pernah tertukar dengan bidak lawan.
export const PAWN_COLORS = [
  { id: 'wa', label: 'Hijau WA', value: '#075e54' },
  { id: 'leaf', label: 'Hijau daun', value: '#2f9e44' },
  { id: 'cyan', label: 'Toska', value: '#0c8599' },
  { id: 'violet', label: 'Ungu', value: '#7048e8' },
  { id: 'pink', label: 'Pink', value: '#d6336c' },
  { id: 'yellow', label: 'Kuning', value: '#f2c200' },
  { id: 'brown', label: 'Cokelat', value: '#8b5a2b' },
  { id: 'slate', label: 'Abu gelap', value: '#343a40' },
]

export const DEFAULT_PAWN = { avatar: 'cat', shape: 'circle', color: '#075e54' }
