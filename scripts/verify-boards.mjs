// Memverifikasi semua preset papan dan generator acak. Jalankan: npm run verify:boards
// Keluar dengan kode 1 bila ada pelanggaran aturan (cocok untuk CI).
import { BOARD_PRESETS } from '../src/data/boardPresets.js'
import { analyzeBoard, generateRandomBoard, validateBoard } from '../src/engine/boardGenerator.js'
import { resolveBoard } from '../src/engine/boardResolver.js'

let failures = 0
const fail = (message) => {
  failures += 1
  console.error(`  ✗ ${message}`)
}

console.log('Preset statis')
for (const preset of BOARD_PRESETS.filter((p) => !p.procedural)) {
  const board = { ladders: preset.ladders, snakes: preset.snakes }
  const { valid, errors } = validateBoard(board)
  const { expectedRolls, minRolls } = analyzeBoard(board)
  const tag = valid ? '✓' : '✗'
  console.log(
    `  ${tag} ${preset.id.padEnd(14)} tangga ${String(board.ladders.length).padStart(2)}  ular ${String(board.snakes.length).padStart(2)}  ` +
      `min ${String(minRolls).padStart(2)} lempar  rata-rata ${expectedRolls.toFixed(1)} lempar`,
  )
  if (!valid) errors.forEach(fail)
}

console.log('\nGenerator acak (3000 seed)')
const N = 3000
let generated = 0
let rollsMin = Infinity
let rollsMax = 0
let ladderTotal = 0
let snakeTotal = 0
const started = Date.now()
for (let seed = 1; seed <= N; seed += 1) {
  const board = generateRandomBoard({ seed })
  if (!board) {
    fail(`seed ${seed}: generator gagal`)
    continue
  }
  generated += 1
  const { valid, errors } = validateBoard(board)
  if (!valid) fail(`seed ${seed}: ${errors.join(' | ')}`)
  const again = generateRandomBoard({ seed })
  if (JSON.stringify(again) !== JSON.stringify(board)) fail(`seed ${seed}: tidak deterministik`)
  const { expectedRolls } = analyzeBoard(board)
  rollsMin = Math.min(rollsMin, expectedRolls)
  rollsMax = Math.max(rollsMax, expectedRolls)
  ladderTotal += board.ladders.length
  snakeTotal += board.snakes.length
}
console.log(
  `  berhasil ${generated}/${N}, rata-rata ${(ladderTotal / generated).toFixed(1)} tangga & ${(snakeTotal / generated).toFixed(1)} ular, ` +
    `lemparan ${rollsMin.toFixed(1)}-${rollsMax.toFixed(1)}, ${((Date.now() - started) / N).toFixed(1)} ms/papan`,
)

console.log('\nValidator menolak papan buruk')
const bad = {
  'kepala ular di ujung tangga': { ladders: [{ start: 10, end: 40 }], snakes: [{ start: 40, end: 5 }] },
  'ekor ular di pangkal tangga': { ladders: [{ start: 20, end: 60 }], snakes: [{ start: 50, end: 20 }] },
  'dua pangkal di kotak sama': { ladders: [{ start: 10, end: 40 }], snakes: [{ start: 10, end: 2 }] },
  'tembok 6 kepala ular': {
    ladders: [],
    snakes: [50, 51, 52, 53, 54, 55].map((start) => ({ start, end: 5 })),
  },
  'ular naik': { ladders: [], snakes: [{ start: 10, end: 30 }] },
  'tangga turun': { ladders: [{ start: 30, end: 10 }], snakes: [] },
  'tangga ke kotak 100': { ladders: [{ start: 30, end: 100 }], snakes: [] },
  'pangkal di kotak 100': { ladders: [], snakes: [{ start: 100, end: 50 }] },
}
for (const [name, board] of Object.entries(bad)) {
  if (validateBoard(board).valid) fail(`"${name}" seharusnya ditolak`)
  else console.log(`  ✓ ditolak: ${name}`)
}

console.log('\nResolver')
for (const preset of BOARD_PRESETS) {
  const board = resolveBoard(preset.id)
  if (!validateBoard(board).valid) fail(`resolveBoard(${preset.id}) tidak valid`)
}
const a = resolveBoard('random')
const b = resolveBoard('random')
if (JSON.stringify(a) === JSON.stringify(b)) fail('dua panggilan random menghasilkan papan identik')
else console.log('  ✓ preset acak menghasilkan papan berbeda tiap panggilan')
if (resolveBoard('tidak-ada').presetId !== 'classic') fail('id tak dikenal harus jatuh ke classic')
else console.log('  ✓ id tak dikenal jatuh ke classic')

console.log(failures ? `\n${failures} pelanggaran.` : '\nSemua pemeriksaan lolos.')
process.exit(failures ? 1 : 0)
