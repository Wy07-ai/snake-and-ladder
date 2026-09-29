// Aturan papan, validasi, analisis, dan generator acak (logic murni, tanpa React).
//
// Sebuah "board" adalah `{ ladders: [{ start, end }], snakes: [{ start, end }] }`.
// Tangga naik (end > start), ular turun (end < start). Modul ini tidak tahu apa pun
// soal preset atau UI; lihat `boardResolver.js` dan `data/boardPresets.js`.

export const BOARD_SIZE = 100
// Selisih minimal antara kepala dan ekor agar bentuk ular/tangga masih terbaca di papan.
export const MIN_SPAN = 3

// ---------------------------------------------------------------------------
// RNG berbenih (mulberry32): benih yang sama selalu menghasilkan papan yang sama,
// sehingga papan acak bisa diulang/dibagikan lewat angka seed.
// ---------------------------------------------------------------------------
export function createRng(seed) {
  let state = seed >>> 0
  return function random() {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function randomSeed() {
  return Math.floor(Math.random() * 4294967296) >>> 0
}

// ---------------------------------------------------------------------------
// Validasi
// ---------------------------------------------------------------------------
const isSquare = (value) => Number.isInteger(value) && value >= 1 && value <= BOARD_SIZE

// Memeriksa papan terhadap semua aturan. Mengembalikan `{ valid, errors }`; `errors`
// berisi pesan (bahasa Indonesia) yang menjelaskan tiap pelanggaran.
//
// Aturan anti-loop:
//  1. Setiap kotak paling banyak menjadi PANGKAL (start) satu ular/tangga.
//  2. Ekor ular atau ujung tangga tidak boleh jatuh di kotak yang menjadi pangkal/kepala
//     ular/tangga lain. Ini mencegah rantai dan siklus, mis. kepala ular tepat di ujung
//     tangga (naik lalu langsung turun lagi) atau ekor ular tepat di pangkal tangga.
//  3. Kotak 1 (start) dan 100 (finis) tidak boleh menjadi pangkal.
//  4. Dari kotak mana pun yang bisa dicapai pemain, petak 100 harus masih bisa dicapai
//     (tidak ada "lubang hitam" tempat pemain terjebak selamanya).
export function validateBoard(board) {
  const errors = []
  const ladders = Array.isArray(board?.ladders) ? board.ladders : null
  const snakes = Array.isArray(board?.snakes) ? board.snakes : null
  if (!ladders || !snakes) {
    return { valid: false, errors: ['Papan harus punya daftar `ladders` dan `snakes`.'] }
  }

  const connections = [
    ...ladders.map((c) => ({ ...c, type: 'tangga' })),
    ...snakes.map((c) => ({ ...c, type: 'ular' })),
  ]

  for (const c of connections) {
    if (!isSquare(c.start) || !isSquare(c.end)) {
      errors.push(`${c.type} ${c.start}→${c.end}: kotak harus bilangan bulat 1-100.`)
    }
  }
  if (errors.length) return { valid: false, errors }

  for (const c of ladders) {
    if (c.end <= c.start) errors.push(`Tangga ${c.start}→${c.end} harus naik.`)
    if (c.end >= BOARD_SIZE) errors.push(`Tangga ${c.start}→${c.end} tidak boleh berujung di kotak 100.`)
  }
  for (const c of snakes) {
    if (c.end >= c.start) errors.push(`Ular ${c.start}→${c.end} harus turun.`)
  }
  for (const c of connections) {
    if (c.start <= 1) errors.push(`${c.type} ${c.start}→${c.end}: kotak 1 tidak boleh jadi pangkal.`)
    if (c.start >= BOARD_SIZE) errors.push(`${c.type} ${c.start}→${c.end}: kotak 100 tidak boleh jadi pangkal.`)
    if (Math.abs(c.end - c.start) < MIN_SPAN) {
      errors.push(`${c.type} ${c.start}→${c.end}: terlalu pendek (minimal ${MIN_SPAN} kotak).`)
    }
  }

  const starts = new Map()
  for (const c of connections) {
    if (starts.has(c.start)) {
      errors.push(`Kotak ${c.start} dipakai dua kali sebagai pangkal (${starts.get(c.start)} dan ${c.type}).`)
    } else {
      starts.set(c.start, c.type)
    }
  }
  for (const c of connections) {
    const other = starts.get(c.end)
    if (other && c.end !== c.start) {
      errors.push(
        `${c.type} ${c.start}→${c.end} berakhir di pangkal ${other}; ` +
          'kepala ular tidak boleh langsung terhubung ke pangkal tangga (atau sebaliknya).',
      )
    }
  }
  if (errors.length) return { valid: false, errors }

  const analysis = analyzeBoard(board)
  if (!analysis.canFinish) errors.push('Tidak ada jalur dadu dari kotak 1 ke kotak 100.')
  if (analysis.trapSquares.length) {
    errors.push(`Pemain bisa terjebak selamanya di kotak: ${analysis.trapSquares.join(', ')}.`)
  }
  return { valid: errors.length === 0, errors }
}

// ---------------------------------------------------------------------------
// Analisis (graf transisi dadu)
// ---------------------------------------------------------------------------
function buildJumpTable(board) {
  const jump = new Array(BOARD_SIZE + 1).fill(0).map((_, square) => square)
  for (const c of board.ladders) jump[c.start] = c.end
  for (const c of board.snakes) jump[c.start] = c.end
  return jump
}

// Kotak tujuan setelah melempar `roll` dari `square`, sama persis dengan aturan game:
// bergerak maju (dibatasi 100), lalu ular/tangga di kotak mendarat dijalankan sekali.
function step(jump, square, roll) {
  return jump[Math.min(square + roll, BOARD_SIZE)]
}

// Menghitung, untuk papan yang sudah lolos aturan dasar:
//  - `reachable`: kotak yang bisa dicapai dari kotak 1.
//  - `canFinish`: kotak 100 bisa dicapai dari kotak 1.
//  - `trapSquares`: kotak yang bisa dicapai tetapi tidak punya jalur ke 100.
//  - `minRolls`: jumlah lemparan minimum (jalur terbaik, dadu selalu beruntung).
//  - `expectedRolls`: rata-rata lemparan untuk sampai ke 100 (dadu acak, tanpa bonus 6).
export function analyzeBoard(board) {
  const jump = buildJumpTable(board)

  // Maju: BFS dari kotak 1.
  const dist = new Array(BOARD_SIZE + 1).fill(Infinity)
  dist[1] = 0
  const queue = [1]
  for (let head = 0; head < queue.length; head += 1) {
    const square = queue[head]
    if (square === BOARD_SIZE) continue
    for (let roll = 1; roll <= 6; roll += 1) {
      const next = step(jump, square, roll)
      if (dist[next] === Infinity) {
        dist[next] = dist[square] + 1
        queue.push(next)
      }
    }
  }
  const reachable = queue.slice().sort((a, b) => a - b)

  // Mundur: kotak yang punya jalur menuju 100.
  const predecessors = Array.from({ length: BOARD_SIZE + 1 }, () => [])
  for (let square = 1; square < BOARD_SIZE; square += 1) {
    for (let roll = 1; roll <= 6; roll += 1) predecessors[step(jump, square, roll)].push(square)
  }
  const canReachEnd = new Array(BOARD_SIZE + 1).fill(false)
  canReachEnd[BOARD_SIZE] = true
  const back = [BOARD_SIZE]
  for (let head = 0; head < back.length; head += 1) {
    for (const previous of predecessors[back[head]]) {
      if (!canReachEnd[previous]) {
        canReachEnd[previous] = true
        back.push(previous)
      }
    }
  }

  const canFinish = dist[BOARD_SIZE] !== Infinity
  const trapSquares = reachable.filter((square) => !canReachEnd[square])

  let expectedRolls = Infinity
  if (canFinish && trapSquares.length === 0) {
    // Iterasi Gauss-Seidel untuk E[p] = 1 + rata-rata(E[tujuan]); E[100] = 0.
    const expected = new Array(BOARD_SIZE + 1).fill(0)
    for (let iteration = 0; iteration < 20000; iteration += 1) {
      let delta = 0
      for (let square = BOARD_SIZE - 1; square >= 1; square -= 1) {
        let sum = 0
        for (let roll = 1; roll <= 6; roll += 1) sum += expected[step(jump, square, roll)]
        const value = 1 + sum / 6
        delta = Math.max(delta, Math.abs(value - expected[square]))
        expected[square] = value
      }
      if (delta < 1e-9) break
    }
    expectedRolls = expected[1]
  }

  return {
    reachable,
    canFinish,
    trapSquares,
    minRolls: dist[BOARD_SIZE],
    expectedRolls,
  }
}

// ---------------------------------------------------------------------------
// Generator acak
// ---------------------------------------------------------------------------
export const DEFAULT_GENERATOR_OPTIONS = {
  ladderCount: [6, 10],
  snakeCount: [6, 10],
  // Rentang panjang (selisih nomor kotak) ular/tangga.
  ladderSpan: [8, 55],
  snakeSpan: [8, 55],
  // Papan acak hanya diterima bila rata-rata lemparannya wajar (tidak terlalu instan
  // maupun terlalu menyiksa).
  expectedRolls: [14, 42],
  maxAttempts: 400,
}

const randomInt = (rng, min, max) => min + Math.floor(rng() * (max - min + 1))

// Menyusun satu kandidat. Aturan pangkal/ekor ditegakkan sambil membangun (kotak yang
// sudah dipakai tidak dipilih lagi); validateBoard tetap jadi keputusan akhir.
function buildCandidate(rng, options) {
  const startsTaken = new Set()
  const endsTaken = new Set()
  const ladders = []
  const snakes = []

  const place = (kind, target) => {
    const [minSpan, maxSpan] = kind === 'ladder' ? options.ladderSpan : options.snakeSpan
    for (let attempt = 0; attempt < 60; attempt += 1) {
      const span = randomInt(rng, Math.max(MIN_SPAN, minSpan), maxSpan)
      const start = kind === 'ladder' ? randomInt(rng, 2, 98 - MIN_SPAN) : randomInt(rng, 2 + MIN_SPAN, 99)
      const end = kind === 'ladder' ? start + span : start - span
      if (end < 1 || end > 99) continue
      if (startsTaken.has(start) || endsTaken.has(start)) continue
      if (startsTaken.has(end) || end === start) continue
      startsTaken.add(start)
      endsTaken.add(end)
      target.push({ start, end })
      return
    }
  }

  const ladderTotal = randomInt(rng, ...options.ladderCount)
  const snakeTotal = randomInt(rng, ...options.snakeCount)
  for (let i = 0; i < ladderTotal; i += 1) place('ladder', ladders)
  for (let i = 0; i < snakeTotal; i += 1) place('snake', snakes)

  const byStart = (a, b) => a.start - b.start
  return { ladders: ladders.sort(byStart), snakes: snakes.sort(byStart) }
}

// Membuat papan acak yang PASTI valid (lolos validateBoard) dan seimbang, atau `null`
// bila setelah `maxAttempts` percobaan tidak ada yang cocok (sangat jarang; pemanggil
// menyediakan papan cadangan). `seed` yang sama menghasilkan papan yang sama.
export function generateRandomBoard({ seed = randomSeed(), ...overrides } = {}) {
  const options = { ...DEFAULT_GENERATOR_OPTIONS, ...overrides }
  const rng = createRng(seed)
  const [minRolls, maxRolls] = options.expectedRolls

  for (let attempt = 1; attempt <= options.maxAttempts; attempt += 1) {
    const candidate = buildCandidate(rng, options)
    if (!validateBoard(candidate).valid) continue
    const { expectedRolls } = analyzeBoard(candidate)
    if (expectedRolls < minRolls || expectedRolls > maxRolls) continue
    return { ...candidate, seed }
  }
  return null
}
