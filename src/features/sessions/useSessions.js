import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { routineKeys } from '../routines/queryKeys.js'
import { sessionKeys } from './queryKeys.js'
import {
  createSession,
  fetchLastPerformances,
  fetchSession,
  fetchSessionsByDay,
  saveSessionAsRoutine,
} from './sessionsApi.js'

// Sesiones de un día (sin `day`, la API responde con el día de hoy en tu zona horaria)
export function useSessionsByDay(day) {
  return useQuery({ queryKey: sessionKeys.day(day ?? 'hoy'), queryFn: () => fetchSessionsByDay(day) })
}

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
      // La rutina cambió su "última vez usada"
      queryClient.invalidateQueries({ queryKey: routineKeys.all })
      return meta
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
