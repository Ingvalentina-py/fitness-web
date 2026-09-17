import { Archive, ArrowDown, ArrowUp, Copy, Ellipsis, GripVertical, Pencil } from 'lucide-react'
import { Reorder, useDragControls } from 'motion/react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import ActionSheet from '../../components/ActionSheet.jsx'
import IconButton from '../../components/IconButton.jsx'
import { plural } from '../../lib/format.js'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import { useDuplicateRoutine, useUpdateRoutine } from './useRoutines.js'
import styles from './RoutineRow.module.css'

// Rutina dentro de un grupo. Se reordena arrastrando la manija (⋮⋮) o con
// "Subir"/"Bajar" en su menú, que también sirve con teclado.
export default function RoutineRow({ routine, canMoveUp, canMoveDown, onMove, onDragEnd }) {
  const dragControls = useDragControls()
  const labels = useMetaLabels()
  const navigate = useNavigate()
  const duplicateRoutine = useDuplicateRoutine()
  const updateRoutine = useUpdateRoutine()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <Reorder.Item
      as="li"
      value={routine}
      className={styles.row}
      // Solo se arrastra desde la manija: así el resto de la fila permite desplazar la página
      dragListener={false}
      dragControls={dragControls}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.02, boxShadow: '0 16px 32px -12px rgb(28 22 51 / 0.35)' }}
    >
      <span
        className={styles.handle}
        onPointerDown={(event) => dragControls.start(event)}
        aria-hidden="true"
      >
        <GripVertical size={20} />
      </span>

      <Link to={`/rutinas/${routine._id}`} className={styles.main}>
        <span className={styles.name}>{routine.name}</span>
        <span className={styles.details}>
          {labels.goal(routine.goal)} · {plural(routine.exercises.length, 'ejercicio', 'ejercicios')}
        </span>
      </Link>

      <IconButton
        icon={Ellipsis}
        label={`Opciones de ${routine.name}`}
        onClick={() => setIsMenuOpen(true)}
      />

      <ActionSheet
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        title={routine.name}
        actions={[
          { label: 'Editar', icon: Pencil, onSelect: () => navigate(`/rutinas/${routine._id}`) },
          { label: 'Duplicar', icon: Copy, onSelect: () => duplicateRoutine.mutate(routine._id) },
          canMoveUp && { label: 'Subir', icon: ArrowUp, onSelect: () => onMove(-1) },
          canMoveDown && { label: 'Bajar', icon: ArrowDown, onSelect: () => onMove(1) },
          {
            label: 'Archivar',
            icon: Archive,
            danger: true,
            onSelect: () => updateRoutine.mutate({ id: routine._id, isArchived: true }),
          },
        ]}
      />
    </Reorder.Item>
  )
}
