import { ArrowDown, ArrowUp, Ellipsis, Pencil, Plus, Trash2 } from 'lucide-react'
import { Reorder } from 'motion/react'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import ActionSheet from '../../components/ActionSheet.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import IconButton from '../../components/IconButton.jsx'
import IconByName from '../../components/IconByName.jsx'
import { moveItem, plural } from '../../lib/format.js'
import RoutineRow from './RoutineRow.jsx'
import { useReorderRoutines } from './useRoutines.js'
import styles from './GroupSection.module.css'

// Un grupo con sus rutinas, que se pueden reordenar
export default function GroupSection({ group, routines, canMoveUp, canMoveDown, onMove, onEdit, onDelete }) {
  const navigate = useNavigate()
  const reorderRoutines = useReorderRoutines()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Orden temporal solo mientras se arrastra. Al soltar se guarda en la API
  // (con actualización optimista) y la lista vuelve a salir de `routines`.
  const [draggingOrder, setDraggingOrder] = useState(null)
  const draggingOrderRef = useRef(null)
  const items = draggingOrder ?? routines

  function saveOrder(ordered) {
    const routineIds = ordered.map((routine) => routine._id)
    const unchanged = routineIds.join() === routines.map((routine) => routine._id).join()
    if (!unchanged) reorderRoutines.mutate({ groupId: group._id, routineIds })
  }

  function handleReorder(ordered) {
    draggingOrderRef.current = ordered
    setDraggingOrder(ordered)
  }

  function handleDragEnd() {
    const ordered = draggingOrderRef.current
    draggingOrderRef.current = null
    setDraggingOrder(null)
    if (ordered) saveOrder(ordered)
  }

  const titleId = `group-title-${group._id}`

  return (
    <GlassCard aria-labelledby={titleId}>
      <header className={styles.header}>
        <span className={styles.icon} style={{ '--tone': group.color }} aria-hidden="true">
          <IconByName name={group.icon} size={22} strokeWidth={2.25} />
        </span>
        <div className={styles.titles}>
          <h2 id={titleId} className={styles.title}>
            {group.name}
          </h2>
          <p className={styles.count}>{plural(routines.length, 'rutina', 'rutinas')}</p>
        </div>
        <IconButton
          icon={Ellipsis}
          label={`Opciones del grupo ${group.name}`}
          onClick={() => setIsMenuOpen(true)}
        />
      </header>

      {items.length === 0 ? (
        <p className={styles.empty}>
          Aún no hay rutinas en este grupo.{' '}
          <Link to={`/rutinas/nueva?grupo=${group._id}`}>Crear una aquí</Link>
        </p>
      ) : (
        <Reorder.Group as="ul" axis="y" values={items} onReorder={handleReorder} className={styles.list}>
          {items.map((routine, index) => (
            <RoutineRow
              key={routine._id}
              routine={routine}
              canMoveUp={index > 0}
              canMoveDown={index < items.length - 1}
              onMove={(direction) => saveOrder(moveItem(items, index, index + direction))}
              onDragEnd={handleDragEnd}
            />
          ))}
        </Reorder.Group>
      )}

      <ActionSheet
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        title={group.name}
        actions={[
          {
            label: 'Crear rutina en este grupo',
            icon: Plus,
            onSelect: () => navigate(`/rutinas/nueva?grupo=${group._id}`),
          },
          { label: 'Editar grupo', icon: Pencil, onSelect: onEdit },
          canMoveUp && { label: 'Subir grupo', icon: ArrowUp, onSelect: () => onMove(-1) },
          canMoveDown && { label: 'Bajar grupo', icon: ArrowDown, onSelect: () => onMove(1) },
          { label: 'Eliminar grupo', icon: Trash2, danger: true, onSelect: onDelete },
        ]}
      />
    </GlassCard>
  )
}
