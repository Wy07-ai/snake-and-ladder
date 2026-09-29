import ExitScreen from './screens/ExitScreen.jsx'
import GameScreen from './screens/GameScreen.jsx'
import HowToPlayScreen from './screens/HowToPlayScreen.jsx'
import LobbyScreen from './screens/LobbyScreen.jsx'
import SettingsScreen from './screens/SettingsScreen.jsx'
import { SCREENS, useNavigation } from './hooks/useNavigation.js'

// App hanya bertugas memilih layar aktif. Logic permainan ada di GameScreen/useGame.
function App() {
  const { screen, navigate, goToLobby } = useNavigation()

  switch (screen) {
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

export default App
