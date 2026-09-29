import { useId } from 'react'
import Pawn from '../pawn/Pawn.jsx'
import { BOT_PLAYERS } from '../../engine/gameEngine.js'
import { NAME_SLOTS } from '../../data/playerNames.js'
import { HUMAN_AVATARS, PAWN_COLORS } from '../../data/pawnOptions.js'

const MODES = [
  { id: 'single', label: 'Solo + COM' },
  { id: 'local', label: 'Lokal' },
  { id: 'spectator', label: 'Spektator' },
  { id: 'custom', label: 'Campuran' },
]

const DIFFICULTIES = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
]

const CONTROL_LABELS = { human: 'Human', bot: 'COM' }
const FIELD_CLASS = 'min-w-0 rounded-md border border-wa-primary/20 bg-wa-paper px-3 py-2 text-sm font-semibold text-wa-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-wa-primary'
const BUTTON_CLASS = 'rounded-md border px-3 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wa-primary'

function PlayerCompositionCustomizer({ game, names, pawnsBySlot, onGameChange, onNameChange, onPawnChange }) {
  const baseId = useId()
  const activeSlots = NAME_SLOTS.slice(0, game.playerCount)

  function chooseMode(mode) {
    const playerTypes = game.playerTypes.slice()
    if (mode === 'single') playerTypes.splice(0, 4, 'human', 'bot', 'bot', 'bot')
    if (mode === 'local') playerTypes.fill('human')
    if (mode === 'spectator') playerTypes.fill('bot')
    onGameChange({ mode, playerTypes })
  }

  function chooseType(index, type) {
    const playerTypes = game.playerTypes.slice()
    playerTypes[index] = type
    onGameChange({ mode: 'custom', playerTypes })
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <p className="text-sm font-bold text-wa-ink">Mode permainan</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Mode permainan">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              className={`${BUTTON_CLASS} ${game.mode === mode.id ? 'border-wa-primary bg-wa-primary text-white' : 'border-wa-primary/20 bg-wa-paper text-wa-ink hover:border-wa-primary'}`}
              type="button"
              aria-pressed={game.mode === mode.id}
              onClick={() => chooseMode(mode.id)}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2 sm:max-w-xs">
        <label className="text-sm font-bold text-wa-ink" htmlFor={`${baseId}-count`}>Jumlah pemain</label>
        <select
          id={`${baseId}-count`}
          className={FIELD_CLASS}
          value={game.playerCount}
          onChange={(event) => onGameChange({ playerCount: Number(event.target.value) })}
        >
          {[2, 3, 4].map((count) => <option key={count} value={count}>{count} pemain</option>)}
        </select>
      </div>

      <div className="grid gap-2">
        <p className="text-sm font-bold text-wa-ink">Tingkat kesulitan bot</p>
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Tingkat kesulitan bot">
          {DIFFICULTIES.map((difficulty) => (
            <button
              key={difficulty.id}
              className={`${BUTTON_CLASS} ${game.difficulty === difficulty.id ? 'border-wa-primary bg-wa-primary text-white' : 'border-wa-primary/20 bg-wa-paper text-wa-ink hover:border-wa-primary'}`}
              type="button"
              aria-pressed={game.difficulty === difficulty.id}
              onClick={() => onGameChange({ difficulty: difficulty.id })}
            >
              {difficulty.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-wa-muted">Kesulitan mengatur tempo giliran COM dan frekuensi komentarnya. Hasil dadu tetap acak.</p>
      </div>

      <div className="grid gap-3">
        <p className="text-sm font-bold text-wa-ink">Susunan pemain</p>
        {activeSlots.map((slot, index) => {
          const type = game.playerTypes[index] ?? 'bot'
          const bot = BOT_PLAYERS.find((player) => player.id === slot.id)
          const pawn = type === 'human' ? pawnsBySlot[slot.id] : (bot ?? { avatar: 'fox', shape: 'circle', color: '#495057' })
          const nameId = `${baseId}-${slot.id}-name`
          const typeId = `${baseId}-${slot.id}-type`
          const avatarId = `${baseId}-${slot.id}-avatar`
          const colorId = `${baseId}-${slot.id}-color`

          return (
            <div key={slot.id} className="grid gap-3 border-b border-wa-primary/10 pb-3 last:border-b-0 sm:grid-cols-[minmax(8rem,1fr)_minmax(9rem,1fr)_auto] sm:items-center">
              <div className="flex min-w-0 items-center gap-3">
                <Pawn {...pawn} className="size-11 shrink-0" />
                <div className="grid min-w-0 flex-1 gap-1">
                  <label className="text-xs font-bold text-wa-muted" htmlFor={nameId}>Pemain {index + 1} · Nama</label>
                  <input
                    id={nameId}
                    className={FIELD_CLASS}
                    type="text"
                    value={names[slot.id]}
                    placeholder={slot.defaultName}
                    maxLength={16}
                    autoComplete="off"
                    onChange={(event) => onNameChange(slot.id, event.target.value)}
                    onBlur={(event) => onNameChange(slot.id, event.target.value.trim())}
                  />
                </div>
              </div>
              <div className="grid gap-1">
                <label className="text-xs font-bold text-wa-muted" htmlFor={typeId}>Kontrol</label>
                <select
                  id={typeId}
                  className={FIELD_CLASS}
                  value={type}
                  onChange={(event) => chooseType(index, event.target.value)}
                >
                  <option value="human">Human</option>
                  <option value="bot">COM</option>
                </select>
              </div>
              {type === 'human' && (
                <div className="grid grid-cols-2 gap-2 sm:min-w-64">
                  <div className="grid gap-1">
                    <label className="text-xs font-bold text-wa-muted" htmlFor={avatarId}>Avatar</label>
                    <select
                      id={avatarId}
                      className={FIELD_CLASS}
                      value={pawnsBySlot[slot.id].avatar}
                      onChange={(event) => onPawnChange(slot.id, { avatar: event.target.value })}
                    >
                      {HUMAN_AVATARS.map((avatar) => <option key={avatar.id} value={avatar.id}>{avatar.label}</option>)}
                    </select>
                  </div>
                  <div className="grid gap-1">
                    <label className="text-xs font-bold text-wa-muted" htmlFor={colorId}>Warna</label>
                    <select
                      id={colorId}
                      className={FIELD_CLASS}
                      value={pawnsBySlot[slot.id].color}
                      onChange={(event) => onPawnChange(slot.id, { color: event.target.value })}
                    >
                      {PAWN_COLORS.map((color) => <option key={color.id} value={color.value}>{color.label}</option>)}
                    </select>
                  </div>
                </div>
              )}
              {type === 'bot' && <span className="text-xs font-semibold text-wa-muted">{CONTROL_LABELS[type]}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PlayerCompositionCustomizer
