import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { activityKeys } from '../activities/queryKeys.js'
import { routineKeys } from '../routines/queryKeys.js'
import { sessionKeys } from './queryKeys.js'
import {
  createSession,
  fetchLastPerformances,
  fetchSession,
  saveSessionAsRoutine,
  updateSession,
} from './sessionsApi.js'

export function useSession(id) {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => fetchSession(id),
    enabled: Boolean(id),
  })
}

// Referencia de la vez anterior de varios ejercicios a la vez
export function useLastPerformances(exerciseIds) {
  return useQuery({
    queryKey: sessionKeys.previous(exerciseIds),
    queryFn: () => fetchLastPerformances(exerciseIds),
    enabled: exerciseIds.length > 0,
  })
}

export function useCreateSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSession,
    onSuccess: ({ data: session, meta }) => {
      // La sesión ya está en la caché: la pantalla de resumen no tiene que volver a pedirla
      queryClient.setQueryData(sessionKeys.detail(session._id), session)
      queryClient.invalidateQueries({ queryKey: sessionKeys.all })
      // La sesión también es una actividad del día (pantalla Hoy)
      queryClient.invalidateQueries({ queryKey: activityKeys.all })
      // La rutina cambió su "última vez usada"
      queryClient.invalidateQueries({ queryKey: routineKeys.all })
      return meta
    },
  })
}

// Al corregir una sesión cambian su detalle, el día en el historial y los récords
export function useUpdateSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateSession,
    onSuccess: (session) => {
      queryClient.setQueryData(sessionKeys.detail(session._id), session)
      queryClient.invalidateQueries({ queryKey: sessionKeys.all })
      queryClient.invalidateQueries({ queryKey: activityKeys.all })
    },
  })
}

export function useSaveSessionAsRoutine() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveSessionAsRoutine,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: routineKeys.all }),
  })
}
