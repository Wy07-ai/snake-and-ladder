function BoardCell({ isPlayerHere, square }) {
  return (
    <div
      className={`relative flex aspect-square items-center justify-center border border-wa-primary/10 text-xs font-semibold sm:text-sm ${square % 2 === 0 ? 'bg-wa-soft' : 'bg-wa-paper'}`}
      aria-label={`Kotak ${square}${isPlayerHere ? ', posisi pemain' : ''}`}
    >
      <span>{square}</span>
      {isPlayerHere && (
        <span className="absolute bottom-1 right-1 size-2.5 rounded-full bg-wa-green ring-2 ring-white sm:size-3" aria-hidden="true" />
      )}
    </div>
  )
}

export default BoardCell