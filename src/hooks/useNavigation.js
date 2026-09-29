import { useCallback, useState } from 'react'

export const SCREENS = {
  LOBBY: 'lobby',
  GAME: 'game',
  HOW_TO_PLAY: 'how-to-play',
  SETTINGS: 'settings',
  EXIT: 'exit',
}

// Navigasi antar-layar. Sengaja terpisah dari useGame: hook ini hanya tahu
// layar mana yang aktif, bukan apa yang terjadi di dalam permainan.
export function useNavigation(initialScreen = SCREENS.LOBBY) {
  const [screen, setScreen] = useState(initialScreen)
  const navigate = useCallback((nextScreen) => setScreen(nextScreen), [])
  const goToLobby = useCallback(() => setScreen(SCREENS.LOBBY), [])

  return { screen, navigate, goToLobby }
}
