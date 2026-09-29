export const FINISH_MODES = [
  {
    id: 'quick',
    label: 'Quick Finish',
    description: 'Permainan selesai saat pemain pertama mencapai kotak 100. Posisi pemain lain menentukan peringkat berikutnya.',
  },
  {
    id: 'play-to-end',
    label: 'Play to End',
    description: 'Permainan berlanjut sampai semua pemain mencapai kotak 100. Pemain yang sudah finish dilewati.',
  },
]

export const DEFAULT_FINISH_MODE = 'quick'