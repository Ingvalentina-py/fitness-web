import { Check } from 'lucide-react'
import Alert from '../../components/Alert.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import { cx } from '../../lib/cx.js'
import { DEFAULT_THEME, applyTheme } from '../../lib/theme.js'
import { useUpdateProfile } from './useProfile.js'
import styles from './ThemePicker.module.css'

// Los cuatro acentos que se ven en la muestra de cada tema
const PREVIEW_SLOTS = ['main', 'energy', 'calm', 'award']

// Elegir el tema de color de la app. Se aplica al instante (elegir un color y
// esperar a "Guardar" no tiene sentido: lo que quieres es verlo) y se guarda en
// tus preferencias, así que te acompaña a cualquier dispositivo.
export default function ThemePicker({ user, themes }) {
  const updateProfile = useUpdateProfile()
  const current = user.preferences.theme ?? DEFAULT_THEME

  function choose(theme) {
    if (theme === current) return

    applyTheme(theme)
    updateProfile.mutate(
      { preferences: { theme } },
      // Si no se pudo guardar, la app vuelve al tema anterior: lo que ves es lo que hay
      { onError: () => applyTheme(current) },
    )
  }

  return (
    <GlassCard aria-labelledby="theme-title">
      <h2 id="theme-title" className={styles.sectionTitle}>
        Tema de la app
      </h2>
      <p className={styles.description}>
        Cambia los colores de toda la app. El fondo claro se mantiene en todos.
      </p>

      {updateProfile.isError && <Alert>No pudimos guardar el tema. Inténtalo de nuevo.</Alert>}

      <fieldset className={styles.fieldset}>
        <legend className="visually-hidden">Tema de color</legend>
        <div className={styles.options}>
          {themes.map((theme) => (
            <label key={theme.value} className={cx(styles.option, current === theme.value && styles.selected)}>
              <input
                className="visually-hidden"
                type="radio"
                name="theme"
                value={theme.value}
                checked={current === theme.value}
                onChange={() => choose(theme.value)}
              />
              {/* data-theme en la muestra: los colores salen del propio tema,
                  sin repetir aquí ni un hexadecimal (ver styles/themes.css) */}
              <span className={styles.swatches} data-theme={theme.value} aria-hidden="true">
                {PREVIEW_SLOTS.map((slot) => (
                  <span
                    key={slot}
                    className={styles.swatch}
                    style={{ background: `var(--accent-${slot})` }}
                  />
                ))}
              </span>
              <span className={styles.name}>
                {theme.label}
                {current === theme.value && (
                  <Check size={16} strokeWidth={3} aria-hidden="true" />
                )}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </GlassCard>
  )
}
