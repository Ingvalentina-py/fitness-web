import { Dumbbell } from 'lucide-react'
import { getIcon } from '../../components/icons.js'
import { formatDuration, formatNumber, plural } from '../../lib/format.js'

// Cómo se ve y cómo se describe cada registro del día, para que Hoy y el historial
// cuenten lo mismo. El gimnasio lleva siempre su color fijo; las demás actividades,
// el color y el ícono de su tipo.
export function activityLook(activity) {
  if (activity.kind === 'gym') {
    return {
      color: 'var(--activity-gym)',
      Icon: Dumbbell,
      name: activity.routine?.name ?? 'Sesión libre',
    }
  }

  return {
    color: activity.activityType?.color ?? 'var(--accent-energy)',
    Icon: getIcon(activity.activityType?.icon),
    name: activity.activityType?.name ?? 'Actividad',
  }
}

// Línea de detalle. En el calendario las sesiones llegan sin sus ejercicios
// (la respuesta es liviana), así que ese dato solo se muestra si está.
export function activityDetails(activity, labels) {
  const parts =
    activity.kind === 'gym'
      ? [
          `${formatNumber(activity.totalVolumeKg)} kg`,
          activity.exercises && plural(activity.exercises.length, 'ejercicio', 'ejercicios'),
          formatDuration(activity.durationMinutes),
        ]
      : [
          formatDuration(activity.durationMinutes),
          activity.intensity && `intensidad ${labels.intensity(activity.intensity).toLowerCase()}`,
          activity.distanceKm != null && `${formatNumber(activity.distanceKm)} km`,
        ]

  return parts.filter(Boolean).join(' · ')
}
