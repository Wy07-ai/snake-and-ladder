function BoardCell({ feature, square }) {
  const kind = feature ? (feature.type.startsWith('ladder') ? 'ladder' : 'snake') : undefined

  return (
    <div
      className="board-cell"
      data-tone={square % 2 === 0 ? 'b' : 'a'}
      data-feature={kind}
      aria-label={`Kotak ${square}${feature ? `, ${feature.label}` : ''}`}
    >
      <span>{square}</span>
      {feature && (
        <span className="board-badge" data-kind={kind} aria-hidden="true">
          {kind === 'ladder' ? 'T' : 'U'}
        </span>
      )}
      {square === 1 && <span className="board-flag" aria-hidden="true">🚩</span>}
      {square === 100 && <span className="board-flag" aria-hidden="true">🏆</span>}
    </div>
  )
}

export default BoardCell
