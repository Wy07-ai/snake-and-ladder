import { createContext } from 'react'

// Context dipisah dari Provider agar file komponen hanya mengekspor komponen
// (aturan react-refresh).
export const SettingsContext = createContext(null)
