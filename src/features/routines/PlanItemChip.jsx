import Chip from '../../components/Chip.jsx'
import { getIcon } from '../../components/icons.js'

// Algo planeado para un día: una rutina (con el color e ícono de su grupo) o un tipo de actividad
export default function PlanItemChip({ item }) {
  if (item.kind === 'routine') {
    const { group } = item.routine
    return (
      <Chip icon={getIcon(group?.icon)} color={group?.color ?? 'var(--color-fuchsia)'}>
        {item.routine.name}
      </Chip>
    )
  }

  return (
    <Chip icon={getIcon(item.activityType.icon)} color={item.activityType.color}>
      {item.activityType.name}
    </Chip>
  )
}
