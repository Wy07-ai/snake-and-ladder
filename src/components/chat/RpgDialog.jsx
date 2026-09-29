import { useCallback, useState } from 'react'
import Pawn from '../pawn/Pawn.jsx'
import TypewriterText from './TypewriterText.jsx'

// Satu baris dialog: potret bot di kiri, papan nama dan teks di kanan. Dipasang ulang
// (lewat `key`) untuk tiap baris sehingga animasi masuk dan ketikan mulai dari awal.
function DialogLine({ line, speaker }) {
  const [isTalking, setIsTalking] = useState(true)
  const handleDone = useCallback(() => setIsTalking(false), [])

  return (
    <div className="rpg-box" style={{ '--speaker': line.persona.color }} aria-hidden="true">
      <div className={`rpg-portrait${isTalking ? ' rpg-portrait--talking' : ''}`}>
        {speaker && <Pawn avatar={speaker.avatar} shape={speaker.shape} color={speaker.color} className="rpg-portrait-art" />}
        <span className="rpg-mood">{line.persona.avatar}</span>
      </div>
      <div className="rpg-body">
        <p className="rpg-name">{line.persona.name}</p>
        <TypewriterText text={line.text} onDone={handleDone} />
      </div>
    </div>
  )
}

// Dialog bot bergaya RPG. Pemain tidak mengetik apa pun: kotak ini hanya menampilkan
// `line` dari useAutoChat (atau kosong bila tidak ada yang sedang bicara). Tinggi slot
// dijaga tetap agar layout tidak melompat tiap kali dialog muncul atau hilang.
// `compact` dipakai layout HP (potret dan huruf lebih kecil).
function RpgDialog({ line = null, players = [], compact = false, className = '' }) {
  const speaker = line ? players.find((player) => player.id === line.persona.id) : null

  return (
    <section className={`rpg-slot${compact ? ' rpg-slot--compact' : ''} ${className}`} aria-label="Dialog bot">
      {/* Pembaca layar membaca teks lengkap sekaligus, bukan huruf demi huruf. */}
      <p className="sr-only" role="status" aria-live="polite">
        {line ? `${line.persona.name}: ${line.text}` : ''}
      </p>
      {line && <DialogLine key={line.id} line={line} speaker={speaker} />}
    </section>
  )
}

export default RpgDialog
