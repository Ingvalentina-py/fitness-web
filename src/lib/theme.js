// Aplica el tema de color a toda la app poniendo data-theme en <html>
// (los temas viven en styles/themes.css).
//
// El tema se guarda en tus preferencias, así que te sigue a cualquier dispositivo,
// pero también se copia en este navegador: al abrir la app se aplica de inmediato,
// sin esperar a que lleguen tus datos. Sin esa copia se vería un parpadeo del tema
// por defecto en cada carga.
const STORAGE_KEY = 'fitness:theme'

export const DEFAULT_THEME = 'pulse'

export function applyTheme(theme) {
  const value = theme || DEFAULT_THEME
  document.documentElement.dataset.theme = value

  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Sin almacenamiento el tema sigue funcionando: solo se aplica un poco más tarde
  }
}

export function readStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}
