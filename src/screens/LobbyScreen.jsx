import LobbyButton from '../components/lobby/LobbyButton.jsx'
import { SCREENS } from '../hooks/useNavigation.js'

// Menu utama. Hanya tahu cara meminta navigasi lewat onNavigate;
// tidak menyentuh state permainan.
function LobbyScreen({ onNavigate = () => {} }) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-to-b from-wa-primary via-[#0a7266] to-[#054a42] px-4 py-10">
      <span className="pointer-events-none absolute -left-6 top-10 select-none text-7xl opacity-20 md:text-9xl" aria-hidden="true">🐍</span>
      <span className="pointer-events-none absolute -right-4 bottom-12 select-none text-7xl opacity-20 md:text-9xl" aria-hidden="true">🪜</span>
      <span className="pointer-events-none absolute right-8 top-16 select-none text-5xl opacity-20 md:text-7xl" aria-hidden="true">🎲</span>

      <section className="relative z-10 grid w-full max-w-md gap-8" aria-label="Menu utama">
        <header className="text-center text-white">
          <div className="mx-auto grid size-20 place-items-center rounded-2xl bg-wa-paper text-5xl shadow-lg md:size-24 md:text-6xl" aria-hidden="true">
            🎲
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-wa-soft">Permainan keluarga</p>
          <h1 className="mt-1 text-5xl font-extrabold drop-shadow md:text-6xl">Ular Tangga</h1>
        </header>

        <nav className="grid gap-4 rounded-2xl bg-black/15 p-5 backdrop-blur-sm md:p-6" aria-label="Navigasi menu">
          <LobbyButton icon="▶️" variant="primary" onClick={() => onNavigate(SCREENS.GAME)}>
            Start Game
          </LobbyButton>
          <LobbyButton icon="⚙️" onClick={() => onNavigate(SCREENS.SETTINGS)}>
            Settings
          </LobbyButton>
          <LobbyButton icon="❓" onClick={() => onNavigate(SCREENS.HOW_TO_PLAY)}>
            How to Play
          </LobbyButton>
          <LobbyButton icon="🚪" onClick={() => onNavigate(SCREENS.EXIT)}>
            Exit
          </LobbyButton>
        </nav>
      </section>
    </main>
  )
}

export default LobbyScreen
