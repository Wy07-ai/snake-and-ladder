import { useMemo } from 'react'
import BoardCell from './BoardCell.jsx'
import Connections from './Connections.jsx'
import { DEFAULT_BOARD } from '../../data/boardPresets.js'
import { SQUARES } from '../../engine/boardGeometry.js'

// Petak khusus (label + jenis) untuk sebuah papan. Bila beberapa ujung berbagi satu
// kotak (mis. banyak ular berekor di kotak 10), yang terakhir menentukan labelnya.
function buildFeatures({ ladders, snakes }) {
  const features = new Map()
  for (const ladder of ladders) {
    features.set(ladder.start, { type: 'ladder-start', label: 'awal tangga, naik ke ' + ladder.end })
    features.set(ladder.end, { type: 'ladder-end', label: 'ujung tangga dari ' + ladder.start })
  }
  for (const snake of snakes) {
    features.set(snake.start, { type: 'snake-start', label: 'kepala ular, turun ke ' + snake.end })
    features.set(snake.end, { type: 'snake-end', label: 'ujung ular dari ' + snake.start })
  }
  return features
}

// Papan tanpa bidak: kotak + ular/tangga dengan tema tertentu. `children`
// (mis. bidak) dirender di atas papan. `compact` dipakai untuk pratinjau tema dan preset.
// `board` = { ladders, snakes } (bawaan: preset Classic).
//
// `fit` membuat papan selalu persegi (10x10 simetris), dihitung lewat container query:
//  - 'fill' (layout Desktop): papan mengisi induk, yang harus `relative` dan punya
//    tinggi dari layout (mis. baris grid `minmax(0,1fr)`). Sisi papan = min(lebar induk,
//    tinggi induk), jadi tidak pernah menimbulkan scroll.
//  - 'width' (layout HP): selebar induk, tetapi tidak lebih tinggi dari sisa layar
//    setelah dikurangi header, dialog, daftar pemain, dan kontrol (~22rem; minimal 18rem).
function BoardView({ theme = 'classic', board: boardLayout = DEFAULT_BOARD, compact = false, fit = false, children }) {
  const features = useMemo(() => buildFeatures(boardLayout), [boardLayout])
  const board = (
    <div className={`board${compact ? ' board--compact' : ''}`} data-board-theme={theme} aria-hidden={compact || undefined}>
      <div className="relative">
        <div className="grid grid-cols-10" aria-label="Papan ular tangga 100 kotak">
          {SQUARES.map((square) => (
            <BoardCell key={square} square={square} feature={features.get(square)} />
          ))}
        </div>
        <Connections board={boardLayout} theme={theme} />
        {children}
      </div>
    </div>
  )

  if (!fit) return board

  if (fit === 'fill') {
    return (
      <div className="absolute inset-0 grid w-full items-center justify-items-center [container-type:size]">
        <div className="w-[min(100cqw,100cqh)]">{board}</div>
      </div>
    )
  }

  return (
    <div className="grid w-full justify-items-center [container-type:inline-size]">
      <div className="w-[min(100cqw,max(18rem,calc(100dvh-22rem)))]">{board}</div>
    </div>
  )
}

export default BoardView
