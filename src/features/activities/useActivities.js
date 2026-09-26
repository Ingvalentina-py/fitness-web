import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { weeklyPlanKey } from '../routines/queryKeys.js'
import { activityKeys, activityTypeKeys } from './queryKeys.js'
import {
  archiveActivityType,
  createActivity,
  createActivityType,
  deleteActivity,
  fetchActivitiesByDay,
  fetchActivitiesInRange,
  fetchActivityTypes,
  updateActivity,
  updateActivityType,
} from './activitiesApi.js'

// ── Actividades ──

// Todo lo registrado en un día: sesiones de gimnasio y otras actividades.
// Sin `day`, la API responde con el día de hoy en la zona horaria de la persona.
export function useActivitiesByDay(day) {
  return useQuery({
    queryKey: activityKeys.day(day ?? 'hoy'),
    queryFn: () => fetchActivitiesByDay(day),
  })
}

// Un rango de días: el mes que muestra el calendario del historial
export function useActivitiesInRange({ from, to }) {
  return useQuery({
    queryKey: activityKeys.range(from, to),
    queryFn: () => fetchActivitiesInRange({ from, to }),
  })
}

// Registrar, corregir o borrar cambia el día, el calendario y (si era una sesión)
// las estadísticas: se refresca todo lo de actividades.
function useRefreshActivities() {
  const queryClient = useQueryClient()

  return () => queryClient.invalidateQueries({ queryKey: activityKeys.all })
}

export function useCreateActivity() {
  const refresh = useRefreshActivities()
  return useMutation({ mutationFn: createActivity, onSuccess: refresh })
}

export function useUpdateActivity() {
  const refresh = useRefreshActivities()
  return useMutation({ mutationFn: updateActivity, onSuccess: refresh })
}

export function useDeleteActivity() {
  const refresh = useRefreshActivities()
  return useMutation({ mutationFn: deleteActivity, onSuccess: refresh })
}

// ── Tipos de actividad ──

// Cambian poco: se piden una vez y se reutilizan durante la visita
export function useActivityTypes({ enabled = true } = {}) {
  return useQuery({
    queryKey: activityTypeKeys.all,
    queryFn: fetchActivityTypes,
    staleTime: 10 * 60_000,
    enabled,
  })
}

// Al crear, editar o archivar un tipo cambian las listas, lo registrado con él
// y el plan semanal (un tipo archivado sale del plan)
function useRefreshActivityTypes() {
  const queryClient = useQueryClient()

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: activityTypeKeys.all }),
      queryClient.invalidateQueries({ queryKey: activityKeys.all }),
      queryClient.invalidateQueries({ queryKey: weeklyPlanKey }),
    ])
}

export function useCreateActivityType() {
  const refresh = useRefreshActivityTypes()
  return useMutation({ mutationFn: createActivityType, onSuccess: refresh })
}

export function useUpdateActivityType() {
  const refresh = useRefreshActivityTypes()
  return useMutation({ mutationFn: updateActivityType, onSuccess: refresh })
}

export function useArchiveActivityType() {
  const refresh = useRefreshActivityTypes()
  return useMutation({ mutationFn: archiveActivityType, onSuccess: refresh })
}
