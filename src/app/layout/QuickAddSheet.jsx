import { Dumbbell, Sparkles } from 'lucide-react'
import { useState } from 'react'
import Badge from '../../components/Badge.jsx'
import Chip from '../../components/Chip.jsx'
import Sheet from '../../components/Sheet.jsx'
import { getIcon } from '../../components/icons.js'
import { useActivityTypes } from '../../features/activities/useActivityTypes.js'
import StartSessionSheet from '../../features/sessions/StartSessionSheet.jsx'
import styles from './QuickAddSheet.module.css'

// Panel del botón "+". Registrar otras actividades llega en la Fase 6.
export default function QuickAddSheet({ open, onClose }) {
  // Solo pide los tipos de actividad cuando el panel se abre por primera vez
  const { data: activityTypes } = useActivityTypes({ enabled: open })
  const [isStartOpen, setIsStartOpen] = useState(false)

  return (
    <Sheet open={open} onClose={onClose} title="¿Qué vas a registrar?">
      <div className={styles.options}>
        <Option
          icon={Dumbbell}
          tone="var(--color-fuchsia)"
          title="Sesión de gimnasio"
          description="Empieza una rutina guardada o entrena desde cero."
          onSelect={() => setIsStartOpen(true)}
        />
        <Option
          icon={Sparkles}
          tone="var(--color-orange)"
          title="Otra actividad"
          description="Baile, clases grupales, bicicleta, patinaje…"
        />
      </div>

      {activityTypes?.length > 0 && (
        <section className={styles.types} aria-labelledby="quick-add-types">
          <h3 id="quick-add-types" className={styles.typesTitle}>
            Tus tipos de actividad
          </h3>
          <ul className={styles.chips}>
            {activityTypes.map((type) => (
              <li key={type._id}>
                <Chip icon={getIcon(type.icon)} color={type.color}>
                  {type.name}
                </Chip>
              </li>
            ))}
          </ul>
        </section>
      )}

      {isStartOpen && (
        <StartSessionSheet
          onClose={() => {
            setIsStartOpen(false)
            onClose()
          }}
        />
      )}
    </Sheet>
  )
}

// Sin onSelect la opción aún no existe: aria-disabled (en vez de disabled)
// la mantiene enfocable y anunciada por los lectores de pantalla.
function Option({ icon: Icon, tone, title, description, onSelect }) {
  return (
    <button
      type="button"
      className={styles.option}
      aria-disabled={onSelect ? undefined : 'true'}
      onClick={onSelect}
    >
      <span className={styles.optionIcon} style={{ '--tone': tone }} aria-hidden="true">
        <Icon size={26} strokeWidth={2.25} />
      </span>
      <span className={styles.optionText}>
        <span className={styles.optionTitle}>{title}</span>
        <span className={styles.optionDescription}>{description}</span>
      </span>
      {!onSelect && <Badge>Pronto</Badge>}
    </button>
  )
}
