// Preset musik latar (BGM) per tema papan. File ini murni data: audioEngine.js
// membacanya untuk mensintesis musik, dan boardThemes.js merujuk id preset lewat
// field `bgm`. Tidak ada file audio; semuanya dibangkitkan oleh Web Audio API.
//
// Bentuk preset:
//   bpm        tempo (ketukan per menit); satu langkah = not seperdelapan
//   swing      0-0.3, geser langkah ganjil agar terasa santai/mengayun
//   chords     progresi 4 akor: { bass, pad: [midi...] }, diulang sepanjang 8 bar
//   melodyA/B  4 bar x 8 langkah (midi | null); A dimainkan bar 1-4, B bar 5-8
//   voices     bentuk gelombang: pad, bass, lead (+ lead2 = lapisan oktaf atas)
//   gains      volume relatif tiap lapisan (pad, bass, lead, perc)
//   perc       gaya perkusi tipis: 'shaker' | 'tick' | 'bell' | 'none'
//   filter     lowpass master untuk warna suara (Hz); makin rendah makin gelap

const SHAKER_LIGHT = { pad: 0.035, bass: 0.15, lead: 0.1, perc: 0.03 }

export const BGM_PRESETS = {
  // Classic: musik santai asli, C - Am - F - G.
  classic: {
    label: 'Sunny Chat',
    bpm: 100,
    swing: 0.12,
    chords: [
      { bass: 48, pad: [60, 64, 67] },
      { bass: 45, pad: [60, 64, 69] },
      { bass: 41, pad: [60, 65, 69] },
      { bass: 43, pad: [59, 62, 67] },
    ],
    melodyA: [
      [79, null, 76, null, 72, 76, 79, null],
      [76, null, 72, null, 69, 72, 76, null],
      [77, null, 72, null, 69, 72, 77, null],
      [74, null, 71, null, 67, 71, 74, 79],
    ],
    melodyB: [
      [79, null, null, 76, 72, null, 76, 79],
      [81, null, 79, null, 76, null, null, 72],
      [77, null, 81, null, 77, null, 72, null],
      [79, 79, 74, null, 71, null, 74, null],
    ],
    voices: { pad: 'triangle', bass: 'triangle', lead: 'sine', lead2: 'sine' },
    gains: SHAKER_LIGHT,
    perc: 'shaker',
    filter: 20000,
  },

  // Cyberpunk: synthwave A minor, bass sawtooth berdenyut, lead persegi.
  cyberpunk: {
    label: 'Neon Drive',
    bpm: 112,
    swing: 0,
    chords: [
      { bass: 33, pad: [57, 60, 64] }, // Am
      { bass: 41, pad: [57, 60, 65] }, // F
      { bass: 36, pad: [55, 60, 64] }, // C
      { bass: 43, pad: [55, 59, 62] }, // G
    ],
    melodyA: [
      [81, null, 76, null, 79, null, 76, 72],
      [77, null, 72, null, 81, null, 77, null],
      [79, null, 76, null, 72, null, 76, 79],
      [74, null, 71, 74, 79, null, 74, null],
    ],
    melodyB: [
      [84, null, 81, null, 76, null, 81, null],
      [84, 81, null, 77, null, 72, null, 77],
      [79, null, 84, null, 79, null, 76, null],
      [83, null, 79, 74, null, 79, 83, null],
    ],
    voices: { pad: 'sawtooth', bass: 'sawtooth', lead: 'square', lead2: 'sine' },
    gains: { pad: 0.022, bass: 0.1, lead: 0.05, perc: 0.035 },
    perc: 'tick',
    filter: 2600,
  },

  // Jungle: pentatonik D, ritme perkusi kayu, melodi seperti marimba/seruling.
  jungle: {
    label: 'Rainforest Drums',
    bpm: 104,
    swing: 0.2,
    chords: [
      { bass: 38, pad: [62, 66, 69] }, // D
      { bass: 43, pad: [62, 67, 71] }, // G
      { bass: 38, pad: [62, 66, 69] }, // D
      { bass: 45, pad: [61, 64, 69] }, // A
    ],
    melodyA: [
      [74, null, 78, null, 81, 78, null, 74],
      [79, null, 83, null, 79, null, 74, null],
      [78, 81, null, 78, 74, null, 78, null],
      [76, null, 81, null, 85, null, 81, 76],
    ],
    melodyB: [
      [81, null, 78, 74, null, 78, 81, null],
      [83, null, 79, null, 74, 79, null, 83],
      [78, null, 74, null, 78, 81, 86, null],
      [85, null, 81, null, 76, null, 81, null],
    ],
    voices: { pad: 'sine', bass: 'triangle', lead: 'triangle', lead2: 'sine' },
    gains: { pad: 0.04, bass: 0.17, lead: 0.11, perc: 0.05 },
    perc: 'tick',
    filter: 6000,
  },

  // China / Orient Express: pentatonik ala guzheng, pad lembut, lonceng kecil.
  china: {
    label: 'Silk Road Lanterns',
    bpm: 84,
    swing: 0,
    chords: [
      { bass: 45, pad: [57, 64, 69] }, // A (kuint)
      { bass: 43, pad: [55, 62, 67] }, // G
      { bass: 40, pad: [59, 64, 67] }, // E
      { bass: 45, pad: [57, 64, 69] }, // A
    ],
    melodyA: [
      [76, null, null, 79, 81, null, 84, null],
      [79, null, 81, null, 76, null, null, 74],
      [76, null, 79, null, 83, null, 79, null],
      [81, null, null, 76, 74, null, 76, null],
    ],
    melodyB: [
      [88, null, 84, null, 81, null, 84, null],
      [86, null, 83, null, 79, null, null, 83],
      [84, null, 88, null, 83, null, 79, null],
      [81, null, 76, null, 81, 84, null, null],
    ],
    voices: { pad: 'sine', bass: 'sine', lead: 'triangle', lead2: 'sine' },
    gains: { pad: 0.04, bass: 0.13, lead: 0.12, perc: 0.03 },
    perc: 'bell',
    filter: 7000,
  },

  // Christmas: lonceng kereta salju, mayor hangat, tempo riang.
  christmas: {
    label: 'Sleigh Bells',
    bpm: 108,
    swing: 0.08,
    chords: [
      { bass: 43, pad: [59, 62, 67] }, // G
      { bass: 36, pad: [60, 64, 67] }, // C
      { bass: 38, pad: [62, 66, 69] }, // D
      { bass: 43, pad: [59, 62, 67] }, // G
    ],
    melodyA: [
      [79, null, 79, 83, 86, null, 83, null],
      [84, null, 79, null, 76, null, 79, null],
      [81, null, 78, null, 74, null, 78, 81],
      [83, null, 79, null, 71, null, 74, null],
    ],
    melodyB: [
      [86, null, 83, 79, null, 83, 86, null],
      [88, null, 84, null, 79, 84, null, 88],
      [86, 86, 81, null, 78, null, 81, null],
      [83, null, 86, null, 79, 79, null, null],
    ],
    voices: { pad: 'sine', bass: 'triangle', lead: 'sine', lead2: 'triangle' },
    gains: { pad: 0.035, bass: 0.13, lead: 0.1, perc: 0.045 },
    perc: 'bell',
    filter: 12000,
  },

  // Halloween: minor harmonis, pad gelap, melodi celesta yang menyeramkan.
  halloween: {
    label: 'Haunted Waltz',
    bpm: 96,
    swing: 0.05,
    chords: [
      { bass: 45, pad: [57, 60, 64] }, // Am
      { bass: 44, pad: [56, 59, 64] }, // E/G#
      { bass: 45, pad: [57, 60, 64] }, // Am
      { bass: 40, pad: [56, 59, 64] }, // E
    ],
    melodyA: [
      [81, null, 80, null, 81, null, 84, null],
      [83, null, 80, null, 76, null, 80, null],
      [81, null, 77, null, 76, 77, 81, null],
      [80, null, 76, null, 71, null, 76, null],
    ],
    melodyB: [
      [88, null, 87, null, 88, 84, null, 81],
      [83, null, 84, null, 80, null, 76, null],
      [81, 84, null, 88, null, 84, null, 81],
      [80, null, 83, null, 80, null, null, null],
    ],
    voices: { pad: 'triangle', bass: 'sine', lead: 'sine', lead2: 'triangle' },
    gains: { pad: 0.04, bass: 0.15, lead: 0.1, perc: 0.02 },
    perc: 'bell',
    filter: 4200,
  },

  // Desert Oasis: skala frigia-dominan (maqam ala Hijaz), drone lambat.
  desert: {
    label: 'Oasis Caravan',
    bpm: 88,
    swing: 0.1,
    chords: [
      { bass: 38, pad: [62, 66, 69] }, // D
      { bass: 39, pad: [62, 67, 70] }, // Eb
      { bass: 38, pad: [62, 66, 69] }, // D
      { bass: 43, pad: [62, 67, 70] }, // Gm
    ],
    melodyA: [
      [74, null, 75, 78, 77, null, 75, 74],
      [70, null, 74, null, 75, null, 78, null],
      [79, null, 78, 75, 74, null, 75, null],
      [77, null, 75, null, 74, null, null, 70],
    ],
    melodyB: [
      [86, null, 87, 90, 89, null, 87, 86],
      [82, null, 86, null, 87, null, 90, null],
      [91, null, 90, 87, 86, null, 87, null],
      [89, null, 87, null, 86, null, null, 82],
    ],
    voices: { pad: 'triangle', bass: 'triangle', lead: 'triangle', lead2: 'sine' },
    gains: { pad: 0.04, bass: 0.15, lead: 0.1, perc: 0.045 },
    perc: 'tick',
    filter: 5500,
  },

  // Royal Victorian: gaya klavikord/menuet, tempo anggun, akor barok.
  royal: {
    label: 'Court Minuet',
    bpm: 92,
    swing: 0,
    chords: [
      { bass: 41, pad: [60, 65, 69] }, // F
      { bass: 38, pad: [58, 62, 65] }, // Bb/D
      { bass: 43, pad: [59, 62, 67] }, // G
      { bass: 36, pad: [60, 64, 67] }, // C
    ],
    melodyA: [
      [81, null, 84, 81, 77, null, 81, null],
      [82, null, 86, 82, 77, null, 74, null],
      [79, null, 83, 79, 74, null, 79, null],
      [84, null, 79, null, 76, null, 79, 84],
    ],
    melodyB: [
      [89, null, 86, 84, 81, null, 77, null],
      [86, null, 82, 86, 89, null, 86, null],
      [83, 86, 91, null, 86, null, 83, null],
      [88, null, 84, 79, 84, null, 88, null],
    ],
    voices: { pad: 'sine', bass: 'triangle', lead: 'triangle', lead2: 'sine' },
    gains: { pad: 0.035, bass: 0.13, lead: 0.11, perc: 0.02 },
    perc: 'tick',
    filter: 9000,
  },

  // Infernal Abyss: drone rendah, bass sawtooth berat, dentang lonceng dalam.
  hell: {
    label: 'Ember Abyss',
    bpm: 76,
    swing: 0,
    chords: [
      { bass: 33, pad: [45, 52, 57] }, // Am (rendah)
      { bass: 34, pad: [46, 53, 58] }, // Bb (frigia)
      { bass: 33, pad: [45, 52, 57] }, // Am
      { bass: 32, pad: [44, 51, 56] }, // G#
    ],
    melodyA: [
      [69, null, null, null, 70, null, 69, null],
      [65, null, null, null, 64, null, null, null],
      [69, null, 72, null, 70, null, 69, null],
      [68, null, null, null, 64, null, null, null],
    ],
    melodyB: [
      [81, null, null, 82, null, null, 81, null],
      [77, null, 76, null, null, null, 72, null],
      [81, null, 84, null, 82, null, 81, null],
      [80, null, null, null, 76, null, null, 72],
    ],
    voices: { pad: 'sawtooth', bass: 'sawtooth', lead: 'triangle', lead2: 'sine' },
    gains: { pad: 0.022, bass: 0.13, lead: 0.09, perc: 0.03 },
    perc: 'bell',
    filter: 1500,
  },
}

export const DEFAULT_BGM_PRESET = 'classic'

// Preset untuk tema tertentu; id tidak dikenal jatuh ke Classic.
export function getBgmPreset(id) {
  return BGM_PRESETS[id] ?? BGM_PRESETS[DEFAULT_BGM_PRESET]
}
