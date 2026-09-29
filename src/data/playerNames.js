// Slot nama yang bisa diubah: pemain utama + tiga bot. Data murni (tanpa JSX)
// agar dipakai oleh validasi settings, engine permainan, dan UI sekaligus.
// `id` sama dengan id pemain di engine dan id persona di botPersonas.js.

export const NAME_MAX_LENGTH = 16

export const NAME_SLOTS = [
  { id: 'human', label: 'Nama kamu', defaultName: 'Kamu' },
  { id: 'rizky', label: 'Bot 1 · toksik & emosian', defaultName: 'Rizky' },
  { id: 'bagas', label: 'Bot 2 · meme & santuy', defaultName: 'Bagas' },
  { id: 'davin', label: 'Bot 3 · kalkulatif & dingin', defaultName: 'Davin' },
]

export const NAME_IDS = NAME_SLOTS.map((slot) => slot.id)

export const DEFAULT_NAMES = Object.fromEntries(NAME_SLOTS.map((slot) => [slot.id, slot.defaultName]))
