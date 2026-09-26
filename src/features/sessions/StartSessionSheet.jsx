import { ChevronRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router'
import Button from '../../components/Button.jsx'
import Sheet from '../../components/Sheet.jsx'
import { plural } from '../../lib/format.js'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import { useRoutineGroups, useRoutineList } from '../routines/useRoutines.js'
import styles from './StartSessionSheet.module.css'

// "Empezar rutina": elige una rutina guardada (queda cargada con sus ejercicios)
// o entrena desde cero y ve agregando ejercicios sobre la marcha.
export default function StartSessionSheet({ onClose }) {
  const navigate = useNavigate()
  const labels = useMetaLabels()
  const routinesQuery = useRoutineList()
  const groupsQuery = useRoutineGroups()

  const groupNames = new Map((groupsQuery.data ?? []).map((group) => [group._id, group.name]))
  const routines = routinesQuery.data ?? []

  function start(path) {
    onClose()
    navigate(path)
  }

  return (
    <Sheet
      open
      onClose={onClose}
      title="Empezar sesión"
      footer={
        <Button variant="secondary" icon={Sparkles} onClick={() => start('/sesion?nueva=1')}>
          Empezar desde cero
        </Button>
      }
    >
      {routinesQuery.isPending && <p className={styles.message}>Cargando tus rutinas…</p>}
      {routinesQuery.isError && <p className={styles.message}>No pudimos cargar tus rutinas.</p>}
      {routinesQuery.isSuccess && routines.length === 0 && (
        <p className={styles.message}>
          Todavía no tienes rutinas guardadas. Puedes empezar desde cero e ir agregando ejercicios.
        </p>
      )}

      <ul className={styles.list}>
        {routines.map((routine) => (
          <li key={routine._id}>
            <button
              type="button"
              className={styles.routine}
              onClick={() => start(`/sesion?rutina=${routine._id}`)}
            >
              <span className={styles.text}>
                <span className={styles.name}>{routine.name}</span>
                <span className={styles.details}>
                  {groupNames.get(routine.group) ?? labels.goal(routine.goal)} ·{' '}
                  {plural(routine.exercises.length, 'ejercicio', 'ejercicios')}
                </span>
              </span>
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </Sheet>
  )
}
