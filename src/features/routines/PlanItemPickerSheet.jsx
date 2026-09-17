import { ChevronRight } from 'lucide-react'
import Chip from '../../components/Chip.jsx'
import IconByName from '../../components/IconByName.jsx'
import Sheet from '../../components/Sheet.jsx'
import { getIcon } from '../../components/icons.js'
import { plural } from '../../lib/format.js'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import { useActivityTypes } from '../activities/useActivityTypes.js'
import { useRoutineGroups, useRoutineList } from './useRoutines.js'
import styles from './PlanItemPickerSheet.module.css'

// Elegir qué agregar a un día del plan: una rutina o un tipo de actividad.
// onSelect recibe el elemento con los datos que muestra la pantalla.
export default function PlanItemPickerSheet({ title, onClose, onSelect }) {
  const { data: groups = [] } = useRoutineGroups()
  const { data: routines = [] } = useRoutineList()
  const { data: activityTypes = [] } = useActivityTypes()
  const labels = useMetaLabels()

  return (
    <Sheet open onClose={onClose} title={title}>
      <section className={styles.section} aria-labelledby="plan-picker-routines">
        <h3 id="plan-picker-routines" className={styles.sectionTitle}>
          Rutinas
        </h3>
        {routines.length === 0 && <p className={styles.muted}>Aún no tienes rutinas.</p>}

        {groups.map((group) => {
          const groupRoutines = routines
            .filter((routine) => routine.group === group._id)
            .sort((a, b) => a.order - b.order)
          if (groupRoutines.length === 0) return null

          return (
            <div key={group._id} className={styles.group}>
              <p className={styles.groupName}>
                <span className={styles.groupIcon} style={{ '--tone': group.color }} aria-hidden="true">
                  <IconByName name={group.icon} size={14} strokeWidth={2.5} />
                </span>
                {group.name}
              </p>
              <ul className={styles.list}>
                {groupRoutines.map((routine) => (
                  <li key={routine._id}>
                    <button
                      type="button"
                      className={styles.option}
                      onClick={() =>
                        onSelect({
                          kind: 'routine',
                          routine: {
                            _id: routine._id,
                            name: routine.name,
                            goal: routine.goal,
                            exerciseCount: routine.exercises.length,
                            group: { _id: group._id, name: group.name, color: group.color, icon: group.icon },
                          },
                        })
                      }
                    >
                      <span className={styles.optionText}>
                        <span className={styles.optionName}>{routine.name}</span>
                        <span className={styles.muted}>
                          {labels.goal(routine.goal)} · {plural(routine.exercises.length, 'ejercicio', 'ejercicios')}
                        </span>
                      </span>
                      <ChevronRight size={20} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </section>

      <section className={styles.section} aria-labelledby="plan-picker-activities">
        <h3 id="plan-picker-activities" className={styles.sectionTitle}>
          Actividades
        </h3>
        <ul className={styles.types}>
          {activityTypes.map((type) => (
            <li key={type._id}>
              <button
                type="button"
                className={styles.typeButton}
                onClick={() => onSelect({ kind: 'activityType', activityType: type })}
              >
                <Chip icon={getIcon(type.icon)} color={type.color}>
                  {type.name}
                </Chip>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </Sheet>
  )
}
