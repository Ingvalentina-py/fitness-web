import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { weeklyPlanKey } from '../routines/queryKeys.js'
import { activityKeys, activityTypeKeys } from './queryKeys.js'
import {
  archiveActivityType,
  createActivity,
  createActivityType,
  fetchActivitiesByDay,
  fetchActivityTypes,
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

export function useCreateActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createActivity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: activityKeys.all }),
  })
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
