import { useEffect } from 'react'
import ExitScreen from './screens/ExitScreen.jsx'
import GameScreen from './screens/GameScreen.jsx'
import HowToPlayScreen from './screens/HowToPlayScreen.jsx'
import LobbyScreen from './screens/LobbyScreen.jsx'
import SettingsScreen from './screens/SettingsScreen.jsx'
import SetupScreen from './screens/SetupScreen.jsx'
import { useAudioSync } from './audio/useAudioSync.js'
import ThemeBackdrop from './components/layout/ThemeBackdrop.jsx'
import { SCREENS, useNavigation } from './hooks/useNavigation.js'
import { useSettings } from './settings/useSettings.js'

// App memilih layar aktif, menyalakan audio global (musik latar mengikuti
// Settings di semua layar), dan menandai mode tampilan di <html>. Logic permainan ada di GameScreen/useGame.
function App() {
  const { screen, navigate, goToLobby } = useNavigation()
  useAudioSync()
  const { settings } = useSettings()
  const layoutMode = settings.layout.mode
  const theme = settings.visual.theme

  // Mode tampilan dipasang di <html> agar CSS global (styles/layout.css) ikut menyesuaikan.
  useEffect(() => {
    document.documentElement.dataset.layout = layoutMode
  }, [layoutMode])

  // Tema aktif dipasang di <html> sebagai kait CSS (data-page-theme, --page-ink di styles/backdrop.css).
  useEffect(() => {
    document.documentElement.dataset.pageTheme = theme
  }, [theme])

  // Layar baru selalu dimulai dari atas (posisi scroll layar sebelumnya tidak terbawa).
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screen])

  function renderScreen() {
    switch (screen) {
      case SCREENS.SETUP:
        return <SetupScreen onBack={goToLobby} onStart={() => navigate(SCREENS.GAME)} />
      case SCREENS.GAME:
        return <GameScreen onBackToLobby={goToLobby} />
      case SCREENS.HOW_TO_PLAY:
        return <HowToPlayScreen onBack={goToLobby} />
      case SCREENS.SETTINGS:
        return <SettingsScreen onBack={goToLobby} />
      case SCREENS.EXIT:
        return <ExitScreen onBack={goToLobby} />
      default:
        return <LobbyScreen onNavigate={navigate} />
    }
  }

  return (
    <>
      <ThemeBackdrop theme={theme} />
      {renderScreen()}
    </>
  )
}

export default App
