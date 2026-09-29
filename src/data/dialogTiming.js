// Waktu tampil dialog RPG (ms). Dipakai useAutoChat (kapan baris berikutnya muncul)
// dan TypewriterText (kecepatan mengetik), agar keduanya selalu selaras.

export const TYPE_MS_PER_CHAR = 26
// Jeda membaca setelah seluruh teks selesai diketik.
export const HOLD_AFTER_TYPING_MS = 1900
// Jeda sebelum baris pertama muncul, supaya tidak menabrak animasi lain.
export const FIRST_LINE_DELAY_MS = 350
// Maksimal baris yang mengantre selain baris yang sedang tampil; kelebihan membuang yang tertua.
export const MAX_QUEUED_LINES = 2

export function getLineDuration(text) {
  return text.length * TYPE_MS_PER_CHAR + HOLD_AFTER_TYPING_MS
}
