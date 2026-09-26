import { Dumbbell, Sparkles } from 'lucide-react'
import { useState } from 'react'
import Chip from '../../components/Chip.jsx'
import Sheet from '../../components/Sheet.jsx'
import { getIcon } from '../../components/icons.js'
import ActivityFormSheet from '../../features/activities/ActivityFormSheet.jsx'
import { useActivityTypes } from '../../features/activities/useActivities.js'
import StartSessionSheet from '../../features/sessions/StartSessionSheet.jsx'
import styles from './QuickAddSheet.module.css'

// Panel del botón "+": empezar una sesión de gimnasio o registrar otra actividad.
export default function QuickAddSheet({ open, onClose }) {
  // Solo pide los tipos de actividad cuando el panel se abre por primera vez
  const { data: activityTypes } = useActivityTypes({ enabled: open })
  const [isStartOpen, setIsStartOpen] = useState(false)
  // null = cerrado; { typeId } = formulario abierto (con el tipo ya elegido, si se tocó uno)
  const [activityForm, setActivityForm] = useState(null)

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
          onSelect={() => setActivityForm({})}
        />
      </div>

      {activityTypes?.length > 0 && (
        <section className={styles.types} aria-labelledby="quick-add-types">
          <h3 id="quick-add-types" className={styles.typesTitle}>
            Registra en un toque
          </h3>
          <ul className={styles.chips}>
            {activityTypes.map((type) => (
              <li key={type._id}>
                {/* Tocar un tipo abre el formulario con ese tipo ya elegido */}
                <button
                  type="button"
                  className={styles.chipButton}
                  onClick={() => setActivityForm({ typeId: type._id })}
                >
                  <Chip icon={getIcon(type.icon)} color={type.color}>
                    {type.name}
                  </Chip>
                </button>
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

      {activityForm && (
        <ActivityFormSheet
          initialTypeId={activityForm.typeId}
          onClose={() => {
            setActivityForm(null)
            onClose()
          }}
        />
      )}
    </Sheet>
  )
}

function Option({ icon: Icon, tone, title, description, onSelect }) {
  return (
    <button type="button" className={styles.option} onClick={onSelect}>
      <span className={styles.optionIcon} style={{ '--tone': tone }} aria-hidden="true">
        <Icon size={26} strokeWidth={2.25} />
      </span>
      <span className={styles.optionText}>
        <span className={styles.optionTitle}>{title}</span>
        <span className={styles.optionDescription}>{description}</span>
      </span>
    </button>
  )
}
