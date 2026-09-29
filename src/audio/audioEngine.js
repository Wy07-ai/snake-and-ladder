// Audio engine berbasis Web Audio API. Semua suara disintesis lewat kode,
// jadi tidak ada file audio yang harus dimuat atau dilisensikan.
//
// - SFX: playSfx('diceRoll' | 'step' | 'ladder' | 'snake' | 'dialog' | 'notification' | 'win')
// - BGM: startBgm() / stopBgm(), musik santai yang berulang otomatis
// - Volume: setVolumes({ bgm, sfx }) menerima nilai 0-1 dari getEffectiveVolume()
//
// Browser memblokir suara sebelum ada interaksi pengguna, sehingga konteks
// audio baru dibuat/dilanjutkan lewat unlockAudio() (dipanggil useAudioSync
// pada sentuhan/klik pertama). Sebelum itu semua fungsi aman dipanggil tapi diam.

import {
  DICE_BOUNCE_RATIOS,
  DICE_LAND_RATIO,
  DICE_PEAK_MS,
  DICE_ROLL_MS,
  DICE_SHAKE_HITS,
} from '../engine/gameEngine.js'

const AudioContextClass =
  typeof window !== 'undefined' ? window.AudioContext ?? window.webkitAudioContext : undefined

let ctx = null
let sfxBus = null
let bgmBus = null
let noiseBuffer = null
let bgmSession = null
const volumes = { bgm: 0, sfx: 0 }

const midiToFreq = (midi) => 440 * 2 ** ((midi - 69) / 12)
const rand = (min, max) => min + Math.random() * (max - min)

function applyVolumes() {
  if (!ctx) return
  bgmBus.gain.setTargetAtTime(volumes.bgm, ctx.currentTime, 0.05)
  sfxBus.gain.setTargetAtTime(volumes.sfx, ctx.currentTime, 0.02)
}

function ensureContext() {
  if (!AudioContextClass) return null
  if (ctx) return ctx

  ctx = new AudioContextClass()
  bgmBus = ctx.createGain()
  sfxBus = ctx.createGain()

  // Compressor ringan supaya suara yang bertumpuk tidak pecah (clipping).
  const compressor = ctx.createDynamicsCompressor()
  bgmBus.connect(compressor)
  sfxBus.connect(compressor)
  compressor.connect(ctx.destination)

  noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const data = noiseBuffer.getChannelData(0)
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1

  applyVolumes()
  return ctx
}

export function isAudioSupported() {
  return Boolean(AudioContextClass)
}

// Buat/lanjutkan konteks audio. Harus dipanggil dari event interaksi pengguna.
export async function unlockAudio() {
  const context = ensureContext()
  if (!context) return false
  if (context.state === 'suspended') {
    try {
      await context.resume()
    } catch {
      return false
    }
  }
  return context.state === 'running'
}

// Dipakai saat tab disembunyikan agar musik tidak terus berbunyi di latar.
export function suspendAudio() {
  if (ctx?.state === 'running') void ctx.suspend().catch(() => {})
}

export function resumeAudio() {
  if (ctx?.state === 'suspended') void ctx.resume().catch(() => {})
}

export function setVolumes({ bgm, sfx }) {
  volumes.bgm = Math.min(1, Math.max(0, bgm))
  volumes.sfx = Math.min(1, Math.max(0, sfx))
  applyVolumes()
}

// ---------------------------------------------------------------- building blocks

// Satu nada. `sustain` membuat envelope pad (naik-tahan-turun) alih-alih pluck.
function tone(dest, { freq, freqEnd, type = 'sine', start, duration, gain = 0.2, attack = 0.005, sustain = false }) {
  const osc = ctx.createOscillator()
  const amp = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, start + duration)

  amp.gain.setValueAtTime(0.0001, start)
  if (sustain) {
    const release = Math.min(0.35, duration / 3)
    amp.gain.linearRampToValueAtTime(gain, start + attack)
    amp.gain.setValueAtTime(gain, start + duration - release)
    amp.gain.linearRampToValueAtTime(0.0001, start + duration)
  } else {
    amp.gain.exponentialRampToValueAtTime(gain, start + attack)
    amp.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  }

  osc.connect(amp)
  amp.connect(dest)
  osc.start(start)
  osc.stop(start + duration + 0.05)
}

// Semburan noise yang difilter (klik dadu, desis ular, shaker).
function noise(dest, { start, duration, gain = 0.2, filter = 'bandpass', frequency = 2000, frequencyEnd, q = 1 }) {
  const source = ctx.createBufferSource()
  source.buffer = noiseBuffer
  const biquad = ctx.createBiquadFilter()
  biquad.type = filter
  biquad.Q.value = q
  biquad.frequency.setValueAtTime(frequency, start)
  if (frequencyEnd) biquad.frequency.exponentialRampToValueAtTime(frequencyEnd, start + duration)

  const amp = ctx.createGain()
  amp.gain.setValueAtTime(0.0001, start)
  amp.gain.exponentialRampToValueAtTime(gain, start + 0.005)
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration)

  source.connect(biquad)
  biquad.connect(amp)
  amp.connect(dest)
  source.start(start, Math.random() * 0.5)
  source.stop(start + duration + 0.05)
}

// ---------------------------------------------------------------- sound effects

const STEP_SCALE = [0, 2, 4, 7, 9, 12] // pentatonik mayor: langkah beruntun terdengar naik

const SFX = {
  // Kocokan dadu, disusun mengikuti animasi DiceButton. Semua jadwal dihitung dari
  // satu waktu mulai dan memakai konstanta yang sama dengan keyframes (gameEngine.js):
  //   DICE_SHAKE_HITS   dadu membentur dinding tangan: satu klik tiap balikan arah
  //                     guncangan, makin keras (amplitudo guncangan juga naik)
  //   puncak            aksen "lempar": desis + dentum rendah tepat di titik tertinggi
  //   puncak -> landing dadu berputar di udara (ketukan tipis)
  //   landing / bounce  dadu menyentuh meja: benturan terkeras, lalu dua pantulan kecil
  // useGame memanggil ini setelah frame pertama animasi tampil, jadi bunyi dan gerak
  // dimulai bersamaan.
  diceRoll(t, dest, { peakMs = DICE_PEAK_MS, totalMs = DICE_ROLL_MS } = {}) {
    const peak = peakMs / 1000
    const total = totalMs / 1000

    const click = (offset, gain) => {
      noise(dest, { start: t + offset, duration: 0.045, gain, frequency: rand(2200, 4400), q: 2 })
      tone(dest, { freq: rand(260, 420), freqEnd: 130, type: 'triangle', start: t + offset, duration: 0.06, gain: gain * 0.5 })
    }
    const clack = (offset, gain) => {
      noise(dest, { start: t + offset, duration: 0.06, gain, frequency: rand(2600, 3400), q: 1.4 })
      tone(dest, { freq: rand(400, 460), freqEnd: 170, type: 'triangle', start: t + offset, duration: 0.09, gain: gain * 0.8 })
    }

    DICE_SHAKE_HITS.forEach((share, index) => {
      const progress = index / (DICE_SHAKE_HITS.length - 1)
      click(peak * share, 0.1 + 0.18 * progress)
    })

    noise(dest, { start: t + peak, duration: 0.16, gain: 0.26, frequency: 600, frequencyEnd: 2600, q: 0.8 })
    tone(dest, { freq: 190, freqEnd: 70, type: 'triangle', start: t + peak, duration: 0.14, gain: 0.26 })

    const landing = total * DICE_LAND_RATIO
    ;[0.3, 0.55, 0.8].forEach((share) => click(peak + (landing - peak) * share, 0.09))

    clack(landing, 0.34)
    DICE_BOUNCE_RATIOS.forEach((ratio, index) => clack(total * ratio, index === 0 ? 0.2 : 0.1))
  },

  // Langkah pion: "tok" pendek, nadanya naik untuk tiap petak dalam satu lemparan.
  step(t, dest, { index = 0 } = {}) {
    const midi = 64 + STEP_SCALE[index % STEP_SCALE.length]
    tone(dest, { freq: midiToFreq(midi), freqEnd: midiToFreq(midi) * 0.92, type: 'triangle', start: t, duration: 0.11, gain: 0.22 })
    noise(dest, { start: t, duration: 0.02, gain: 0.05, filter: 'highpass', frequency: 3000 })
  },

  // Naik tangga: arpeggio naik lalu kilau di ujung.
  ladder(t, dest) {
    const notes = [72, 74, 76, 79, 81, 84, 88, 91]
    notes.forEach((midi, index) => {
      tone(dest, { freq: midiToFreq(midi), type: 'triangle', start: t + index * 0.075, duration: 0.24, gain: 0.17 })
      tone(dest, { freq: midiToFreq(midi + 12), type: 'sine', start: t + index * 0.075, duration: 0.12, gain: 0.04 })
    })
    ;[84, 88, 91].forEach((midi) => {
      tone(dest, { freq: midiToFreq(midi), type: 'sine', start: t + 0.62, duration: 0.55, gain: 0.1 })
    })
  },

  // Terperosok ular: luncuran turun bergetar, desis, lalu debam rendah.
  snake(t, dest) {
    const osc = ctx.createOscillator()
    const lowpass = ctx.createBiquadFilter()
    const amp = ctx.createGain()
    const lfo = ctx.createOscillator()
    const lfoDepth = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(520, t)
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.75)
    lowpass.type = 'lowpass'
    lowpass.frequency.setValueAtTime(1400, t)
    lowpass.frequency.exponentialRampToValueAtTime(220, t + 0.75)
    lfo.frequency.value = 6
    lfoDepth.gain.value = 14
    lfo.connect(lfoDepth)
    lfoDepth.connect(osc.frequency)

    amp.gain.setValueAtTime(0.0001, t)
    amp.gain.exponentialRampToValueAtTime(0.2, t + 0.03)
    amp.gain.exponentialRampToValueAtTime(0.0001, t + 0.8)

    osc.connect(lowpass)
    lowpass.connect(amp)
    amp.connect(dest)
    osc.start(t)
    lfo.start(t)
    osc.stop(t + 0.85)
    lfo.stop(t + 0.85)

    noise(dest, { start: t + 0.03, duration: 0.55, gain: 0.09, filter: 'highpass', frequency: 3600, frequencyEnd: 1800 })
    tone(dest, { freq: 110, freqEnd: 50, type: 'sine', start: t + 0.68, duration: 0.25, gain: 0.28 })
  },

  // Blip dialog RPG: nada pendek persegi, tinggi nadanya sedikit berbeda tiap baris.
  dialog(t, dest) {
    const base = rand(392, 494)
    tone(dest, { freq: base, type: 'square', start: t, duration: 0.05, gain: 0.07 })
    tone(dest, { freq: base * 1.5, type: 'square', start: t + 0.055, duration: 0.07, gain: 0.06 })
  },

  // "Ting!" pesan masuk: dua denting kaca yang naik.
  notification(t, dest) {
    ;[
      { freq: 1568, at: 0 },
      { freq: 2093, at: 0.09 },
    ].forEach(({ freq, at }) => {
      tone(dest, { freq, type: 'sine', start: t + at, duration: 0.55, gain: 0.2 })
      tone(dest, { freq: freq * 2.76, type: 'sine', start: t + at, duration: 0.22, gain: 0.035 })
    })
  },

  // Fanfare kemenangan.
  win(t, dest) {
    ;[72, 76, 79, 84].forEach((midi, index) => {
      tone(dest, { freq: midiToFreq(midi), type: 'triangle', start: t + index * 0.14, duration: 0.3, gain: 0.2 })
    })
    ;[72, 76, 79, 84].forEach((midi) => {
      tone(dest, { freq: midiToFreq(midi), type: 'sine', start: t + 0.6, duration: 1.1, gain: 0.09 })
    })
  },
}

export function playSfx(name, options = {}) {
  const play = SFX[name]
  if (!play || !ctx || ctx.state !== 'running' || volumes.sfx <= 0.001) return
  try {
    play(ctx.currentTime + 0.01, sfxBus, options)
  } catch {
    // SFX hanya pemanis; kegagalan audio tidak boleh mengganggu permainan.
  }
}

// ---------------------------------------------------------------- background music

// Musik santai: progresi C - Am - F - G, 100 BPM, sedikit swing.
// Lapisan: pad lembut, bass memantul, melodi ala marimba, dan shaker tipis.
const EIGHTH = 60 / 100 / 2
const STEPS_PER_BAR = 8
const BAR_COUNT = 8
const TOTAL_STEPS = STEPS_PER_BAR * BAR_COUNT
const LOOKAHEAD = 1.2

const CHORDS = [
  { bass: 48, pad: [60, 64, 67] }, // C
  { bass: 45, pad: [60, 64, 69] }, // Am
  { bass: 41, pad: [60, 65, 69] }, // F
  { bass: 43, pad: [59, 62, 67] }, // G
]

// Satu larik per bar, delapan langkah (per not seperdelapan); null = diam.
const MELODY_A = [
  [79, null, 76, null, 72, 76, 79, null],
  [76, null, 72, null, 69, 72, 76, null],
  [77, null, 72, null, 69, 72, 77, null],
  [74, null, 71, null, 67, 71, 74, 79],
]
const MELODY_B = [
  [79, null, null, 76, 72, null, 76, 79],
  [81, null, 79, null, 76, null, null, 72],
  [77, null, 81, null, 77, null, 72, null],
  [79, 79, 74, null, 71, null, 74, null],
]

function scheduleBgmStep(stepIndex, time, dest) {
  const bar = Math.floor(stepIndex / STEPS_PER_BAR) % BAR_COUNT
  const beat = stepIndex % STEPS_PER_BAR
  const chord = CHORDS[bar % 4]
  const t = time + (beat % 2 === 1 ? EIGHTH * 0.12 : 0)

  if (beat === 0) {
    chord.pad.forEach((midi) => {
      tone(dest, {
        freq: midiToFreq(midi),
        type: 'triangle',
        start: time,
        duration: EIGHTH * STEPS_PER_BAR * 0.98,
        gain: 0.035,
        attack: 0.25,
        sustain: true,
      })
    })
  }

  if (beat === 0 || beat === 4) {
    const midi = beat === 0 ? chord.bass : chord.bass + 7
    tone(dest, { freq: midiToFreq(midi), type: 'triangle', start: t, duration: EIGHTH * 3.4, gain: 0.15 })
  }

  const phrase = (bar < 4 ? MELODY_A : MELODY_B)[bar % 4][beat]
  if (phrase) {
    tone(dest, { freq: midiToFreq(phrase), type: 'sine', start: t, duration: 0.5, gain: 0.1 })
    tone(dest, { freq: midiToFreq(phrase + 12), type: 'sine', start: t, duration: 0.16, gain: 0.025 })
  }

  noise(dest, {
    start: t,
    duration: 0.05,
    gain: beat % 2 === 1 ? 0.03 : 0.013,
    filter: 'highpass',
    frequency: 6500,
  })
}

export function startBgm() {
  const context = ensureContext()
  if (!context || bgmSession) return

  const gain = context.createGain()
  gain.gain.setValueAtTime(0.0001, context.currentTime)
  gain.gain.linearRampToValueAtTime(1, context.currentTime + 1.5)
  gain.connect(bgmBus)

  const session = { gain, timer: null, nextTime: context.currentTime + 0.15, step: 0 }
  bgmSession = session

  // Penjadwal lookahead: menjadwalkan nada sedikit di depan agar tempo stabil
  // walaupun timer JavaScript tidak presisi.
  const tick = () => {
    if (bgmSession !== session) return
    while (session.nextTime < context.currentTime + LOOKAHEAD) {
      scheduleBgmStep(session.step, session.nextTime, session.gain)
      session.nextTime += EIGHTH
      session.step = (session.step + 1) % TOTAL_STEPS
    }
    session.timer = window.setTimeout(tick, 150)
  }
  tick()
}

export function stopBgm() {
  const session = bgmSession
  if (!session || !ctx) return
  bgmSession = null
  window.clearTimeout(session.timer)

  // Fade out; nada yang sudah terjadwal ikut redam lalu terputus.
  const now = ctx.currentTime
  session.gain.gain.cancelScheduledValues(now)
  session.gain.gain.setValueAtTime(Math.max(session.gain.gain.value, 0.0001), now)
  session.gain.gain.linearRampToValueAtTime(0.0001, now + 0.4)
  window.setTimeout(() => session.gain.disconnect(), 700)
}
