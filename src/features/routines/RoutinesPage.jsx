import { ArchiveRestore, ChevronDown, Dumbbell, FolderPlus, Plus, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import Alert from '../../components/Alert.jsx'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { Reveal, Stagger } from '../../components/Reveal.jsx'
import { moveItem } from '../../lib/format.js'
import DeleteGroupSheet from './DeleteGroupSheet.jsx'
import GroupFormSheet from './GroupFormSheet.jsx'
import GroupSection from './GroupSection.jsx'
import WeeklyPlanCard from './WeeklyPlanCard.jsx'
import {
  useCreateSuggestedSplit,
  useReorderGroups,
  useRoutineGroups,
  useRoutineList,
  useUpdateRoutine,
} from './useRoutines.js'
import styles from './RoutinesPage.module.css'

export default function RoutinesPage() {
  const groupsQuery = useRoutineGroups()
  const routinesQuery = useRoutineList()
  const archivedQuery = useRoutineList({ archived: true })
  const reorderGroups = useReorderGroups()

  // null = cerrado; {} = nuevo grupo; { group } = editar
  const [groupForm, setGroupForm] = useState(null)
  const [groupToDelete, setGroupToDelete] = useState(null)

  // Rutinas activas agrupadas por grupo y en su orden
  const routinesByGroup = useMemo(() => {
    const map = new Map()
    const sorted = [...(routinesQuery.data ?? [])].sort((a, b) => a.order - b.order)
    for (const routine of sorted) {
      map.set(routine.group, [...(map.get(routine.group) ?? []), routine])
    }
    return map
  }, [routinesQuery.data])

  const groups = groupsQuery.data ?? []
  const isLoading = groupsQuery.isPending || routinesQuery.isPending
  const hasRoutines = (routinesQuery.data?.length ?? 0) > 0

  function moveGroup(index, direction) {
    const ordered = moveItem(groups, index, index + direction)
    reorderGroups.mutate(ordered.map((group) => group._id))
  }

  return (
    <Stagger>
      <Reveal>
        <PageHeader title="Rutinas" subtitle="Tus grupos, rutinas guardadas y plan semanal." />
      </Reveal>

      <Reveal className={styles.actions}>
        <Button as={Link} to="/rutinas/nueva" icon={Plus}>
          Nueva rutina
        </Button>
        <Button variant="secondary" icon={FolderPlus} onClick={() => setGroupForm({})}>
          Nuevo grupo
        </Button>
      </Reveal>

      {isLoading && (
        <Reveal>
          <GlassCard>Cargando tus rutinas…</GlassCard>
        </Reveal>
      )}

      {(groupsQuery.isError || routinesQuery.isError) && (
        <Reveal>
          <Alert>No pudimos cargar tus rutinas. Recarga la página.</Alert>
        </Reveal>
      )}

      {!isLoading && !hasRoutines && (
        <Reveal>
          <FirstRoutineEmptyState />
        </Reveal>
      )}

      {!isLoading && (
        <Reveal>
          <WeeklyPlanCard />
        </Reveal>
      )}

      {groups.map((group, index) => (
        <Reveal key={group._id}>
          <GroupSection
            group={group}
            routines={routinesByGroup.get(group._id) ?? []}
            canMoveUp={index > 0}
            canMoveDown={index < groups.length - 1}
            onMove={(direction) => moveGroup(index, direction)}
            onEdit={() => setGroupForm({ group })}
            onDelete={() => setGroupToDelete(group)}
          />
        </Reveal>
      ))}

      {!isLoading && groups.length === 0 && (
        <Reveal>
          <EmptyState
            icon={FolderPlus}
            color="orange"
            title="Crea tu primer grupo"
            description="Los grupos son carpetas para ordenar tus rutinas, por ejemplo Tren inferior o Cardio y clases."
            action={
              <Button icon={FolderPlus} onClick={() => setGroupForm({})}>
                Nuevo grupo
              </Button>
            }
          />
        </Reveal>
      )}

      {archivedQuery.data?.length > 0 && (
        <Reveal>
          <ArchivedRoutines routines={archivedQuery.data} />
        </Reveal>
      )}

      {groupForm && <GroupFormSheet group={groupForm.group} onClose={() => setGroupForm(null)} />}
      {groupToDelete && (
        <DeleteGroupSheet
          group={groupToDelete}
          groups={groups}
          onClose={() => setGroupToDelete(null)}
        />
      )}
    </Stagger>
  )
}

function FirstRoutineEmptyState() {
  const createSuggestedSplit = useCreateSuggestedSplit()

  return (
    <EmptyState
      icon={Dumbbell}
      color="fuchsia"
      title="Crea tu primera rutina"
      description="Arma una desde cero o empieza con la división sugerida: 4 rutinas (inferior y superior, fuerza e hipertrofia) y un plan semanal listo para editar."
      action={
        <>
          <Button as={Link} to="/rutinas/nueva" icon={Plus}>
            Crear rutina
          </Button>
          <Button
            variant="secondary"
            icon={Sparkles}
            onClick={() => createSuggestedSplit.mutate()}
            disabled={createSuggestedSplit.isPending}
          >
            {createSuggestedSplit.isPending ? 'Cargando…' : 'Usar división sugerida'}
          </Button>
        </>
      }
      note={createSuggestedSplit.isError ? createSuggestedSplit.error.message : undefined}
    />
  )
}

// Lista plegable de rutinas archivadas, con la opción de restaurarlas
function ArchivedRoutines({ routines }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const updateRoutine = useUpdateRoutine()

  return (
    <GlassCard>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((value) => !value)}
      >
        <span>Rutinas archivadas ({routines.length})</span>
        <ChevronDown
          className={isExpanded ? styles.chevronOpen : undefined}
          size={22}
          aria-hidden="true"
        />
      </button>

      {isExpanded && (
        <ul className={styles.archivedList}>
          {routines.map((routine) => (
            <li key={routine._id} className={styles.archivedRow}>
              <span className={styles.archivedName}>{routine.name}</span>
              <Button
                variant="ghost"
                size="sm"
                icon={ArchiveRestore}
                onClick={() => updateRoutine.mutate({ id: routine._id, isArchived: false })}
                disabled={updateRoutine.isPending}
              >
                Restaurar
              </Button>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  )
}
