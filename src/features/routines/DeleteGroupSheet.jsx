import { useState } from 'react'
import Alert from '../../components/Alert.jsx'
import ConfirmSheet from '../../components/ConfirmSheet.jsx'
import Field from '../../components/Field.jsx'
import { useDeleteGroup } from './useRoutines.js'

// Confirmar la eliminación de un grupo. Si tiene rutinas (incluso archivadas),
// hay que elegir a qué grupo moverlas.
export default function DeleteGroupSheet({ group, groups, onClose }) {
  const deleteGroup = useDeleteGroup()
  const otherGroups = groups.filter((item) => item._id !== group._id)
  const [moveTo, setMoveTo] = useState(otherGroups[0]?._id ?? '')

  // La API responde GROUP_NOT_EMPTY si hay rutinas archivadas que no se ven en la lista
  const needsMove = group.routineCount > 0 || deleteGroup.error?.code === 'GROUP_NOT_EMPTY'
  const cannotMove = needsMove && otherGroups.length === 0

  return (
    <ConfirmSheet
      title={`¿Eliminar "${group.name}"?`}
      description={
        needsMove
          ? 'Sus rutinas no se pierden: pasan al grupo que elijas.'
          : 'El grupo está vacío. Esta acción no se puede deshacer.'
      }
      confirmLabel="Eliminar grupo"
      danger
      isPending={deleteGroup.isPending}
      confirmDisabled={cannotMove}
      onClose={onClose}
      onConfirm={() =>
        deleteGroup.mutate(
          { id: group._id, moveTo: needsMove ? moveTo : undefined },
          { onSuccess: onClose },
        )
      }
    >
      {needsMove && otherGroups.length > 0 && (
        <Field
          as="select"
          label="Mover sus rutinas a"
          value={moveTo}
          onChange={(event) => setMoveTo(event.target.value)}
        >
          {otherGroups.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </Field>
      )}
      {cannotMove && <Alert>Crea otro grupo primero para mover estas rutinas.</Alert>}
      {deleteGroup.isError && deleteGroup.error.code !== 'GROUP_NOT_EMPTY' && (
        <Alert>{deleteGroup.error.message}</Alert>
      )}
    </ConfirmSheet>
  )
}
