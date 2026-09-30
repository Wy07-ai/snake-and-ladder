// Memverifikasi pemetaan tema -> BGM dan perilaku crossfade audio engine tanpa browser,
// memakai AudioContext tiruan. Jalankan: npm run verify:audio
// Keluar dengan kode 1 bila ada pelanggaran (cocok untuk CI).
import { readFileSync } from 'node:fs'
import { BOARD_THEMES } from '../src/data/boardThemes.js'
import { BGM_PRESETS } from '../src/data/bgmPresets.js'

let failures = 0
const check = (ok, message) => {
  if (!ok) failures += 1
  console.log(`  ${ok ? '✓' : '✗'} ${message}`)
}

// ---- AudioContext tiruan: mencatat node, koneksi, dan ramp gain.
const created = { filters: [], gains: [] }
class Param {
  constructor(value = 0) { this.value = value; this.ramps = [] }
  setValueAtTime(v) { this.value = v }
  linearRampToValueAtTime(v, t) { this.value = v; this.ramps.push({ v, t }) }
  exponentialRampToValueAtTime(v) { this.value = v }
  setTargetAtTime(v) { this.value = v }
  cancelScheduledValues() {}
}
class Node {
  constructor() { this.connected = true }
  connect() { this.connected = true }
  disconnect() { this.connected = false }
}
class FakeContext {
  constructor() { this.state = 'running'; this.destination = new Node(); this.sampleRate = 8000; this.t0 = performance.now() }
  get currentTime() { return (performance.now() - this.t0) / 1000 }
  resume() { return Promise.resolve() }
  suspend() { return Promise.resolve() }
  createBuffer(_c, n) { return { getChannelData: () => new Float32Array(n) } }
  createGain() { const n = new Node(); n.gain = new Param(1); created.gains.push(n); return n }
  createDynamicsCompressor() { return new Node() }
  createOscillator() { const n = new Node(); n.frequency = new Param(440); n.start = () => {}; n.stop = () => {}; return n }
  createBufferSource() { const n = new Node(); n.start = () => {}; n.stop = () => {}; return n }
  createBiquadFilter() {
    const n = new Node(); n.frequency = new Param(350); n.Q = new Param(1); n.type = 'lowpass'
    created.filters.push(n); return n
  }
}
globalThis.window = globalThis
globalThis.AudioContext = FakeContext

const engine = await import('../src/audio/audioEngine.js')
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
// Filter sesi BGM = lowpass Q 0.5 yang dibuat createBgmSession (noise() memakai tipe lain).
const liveSessions = () => created.filters.filter((f) => f.type === 'lowpass' && f.Q.value === 0.5 && f.connected)

console.log('Pemetaan tema -> preset BGM')
const bgmIds = new Set(BOARD_THEMES.map((t) => t.bgm))
check(BOARD_THEMES.length === 9, `9 tema terdaftar (${BOARD_THEMES.length})`)
check(bgmIds.size === 9, 'setiap tema punya preset BGM berbeda')
const css = readFileSync(new URL('../src/styles/backdrop.css', import.meta.url), 'utf8')
for (const theme of BOARD_THEMES) {
  const preset = BGM_PRESETS[theme.bgm]
  const okPreset = Boolean(preset)
    && preset.chords?.length === 4 && preset.chords.every((c) => c.pad.length === 3)
    && [preset.melodyA, preset.melodyB].every((m) => m.length === 4 && m.every((bar) => bar.length === 8))
    && preset.bpm >= 60 && preset.bpm <= 140 && preset.filter >= 800
  check(okPreset, `${theme.id.padEnd(10)} preset "${theme.bgm}" valid (${preset?.label}, ${preset?.bpm} BPM)`)
  check(css.includes(`.page-backdrop__layer--${theme.backdrop} {`) && css.includes(`html[data-page-theme='${theme.id}']`), `${theme.id.padEnd(10)} punya lapisan latar + token teks di backdrop.css`)
}

console.log('\nEngine BGM (crossfade)')
await engine.unlockAudio()
engine.setVolumes({ bgm: 0.7, sfx: 0.8 })
engine.startBgm('classic')
check(liveSessions().length === 1, 'startBgm membuat tepat satu sesi')
check(liveSessions()[0].frequency.value === BGM_PRESETS.classic.filter, 'filter sesi mengikuti preset classic')

engine.setBgmTheme('classic')
check(liveSessions().length === 1, 'memilih tema yang sama tidak membuat sesi baru')

let previous = liveSessions()[0]
engine.setBgmTheme('halloween')
const during = liveSessions()
check(during.length === 2, 'saat crossfade: sesi lama dan baru berbunyi bersamaan')
const incoming = during.find((f) => f !== previous)
check(incoming.frequency.value === BGM_PRESETS.halloween.filter, 'sesi baru memakai filter preset halloween')
const outGain = created.gains.find((g) => g.connected && g.gain.ramps.some((r) => r.v === 0.0001))
check(Boolean(outGain), 'sesi lama diberi fade-out')
await sleep(2700)
check(liveSessions().length === 1 && liveSessions()[0] === incoming, 'setelah crossfade hanya sesi tema baru yang tersisa')
check(!previous.connected, 'node sesi lama dilepas (tanpa kebocoran)')

// Semua 9 tema berurutan, termasuk pergantian cepat sebelum crossfade selesai.
for (const theme of BOARD_THEMES) engine.setBgmTheme(theme.bgm)
check(engine.getBgmTheme() === 'hell', 'pergantian cepat berakhir di preset tema terakhir')
await sleep(2700)
check(liveSessions().length === 1 && liveSessions()[0].frequency.value === BGM_PRESETS.hell.filter, 'setelah pergantian cepat hanya satu sesi (hell) yang berbunyi')

console.log('\nMute / pengaturan')
engine.stopBgm()
await sleep(1000)
check(liveSessions().length === 0, 'stopBgm (mute) memadamkan semua sesi')
engine.setBgmTheme('jungle')
check(liveSessions().length === 0, 'ganti tema saat mute tidak menyalakan musik')
check(engine.getBgmTheme() === 'jungle', 'pilihan tema tetap diingat saat mute')
engine.startBgm()
check(liveSessions().length === 1 && liveSessions()[0].frequency.value === BGM_PRESETS.jungle.filter, 'unmute memutar musik tema terakhir (jungle)')
engine.setBgmTheme('tidak-ada')
check(engine.getBgmTheme() === 'classic', 'id preset tidak dikenal jatuh ke classic')

engine.stopBgm()
await sleep(1000)
check(liveSessions().length === 0, 'bersih di akhir: tidak ada sesi tersisa')

console.log(failures ? `\n${failures} pemeriksaan gagal` : '\nSemua pemeriksaan lolos')
process.exit(failures ? 1 : 0)
