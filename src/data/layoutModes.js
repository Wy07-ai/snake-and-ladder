// Mode tampilan layar permainan. Data murni (tanpa JSX) agar dipakai oleh validasi
// settings, layar Settings, dan GameScreen sekaligus.

export const LAYOUT_MODES = [
  {
    id: 'desktop',
    label: 'Mode Desktop',
    emoji: '🖥️',
    description: 'Layar lebar: papan di kiri, pemain, dadu, dan dialog bot di kanan (side-by-side).',
  },
  {
    id: 'mobile',
    label: 'Mode HP / Mobile',
    emoji: '📱',
    description: 'Tampilan ringkas satu kolom: papan di atas, dadu dan dialog di bawah agar mudah dijangkau jempol.',
  },
]

export const DEFAULT_LAYOUT_MODE = 'desktop'

// Lebar di bawah ini (48rem = 768px) dianggap layar HP saat pemain belum pernah memilih.
export const MOBILE_MAX_WIDTH_QUERY = '(max-width: 47.99rem)'
