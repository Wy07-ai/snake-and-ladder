function BoardCell({ feature, square }) {
  const isLadder = feature?.type.startsWith('ladder')
  const isSnake = feature?.type.startsWith('snake')

  return (
    <div
      className={`relative flex aspect-square items-center justify-center border border-wa-primary/10 text-xs font-semibold sm:text-sm ${isLadder ? 'bg-emerald-100 text-emerald-950' : ''} ${isSnake ? 'bg-rose-100 text-rose-950' : ''} ${!feature && square % 2 === 0 ? 'bg-wa-soft' : ''} ${!feature && square % 2 !== 0 ? 'bg-wa-paper' : ''}`}
      aria-label={`Kotak ${square}${feature ? `, ${feature.label}` : ''}`}
    >
      <span>{square}</span>
      {feature && (
        <span
          className={`absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full text-[9px] font-bold text-white sm:right-1 sm:top-1 sm:size-5 sm:text-[10px] ${isLadder ? 'bg-emerald-700' : 'bg-rose-700'}`}
          aria-hidden="true"
        >
          {isLadder ? 'T' : 'U'}
        </span>
      )}
    </div>
  )
}

export default BoardCell