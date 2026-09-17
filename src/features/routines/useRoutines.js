import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { groupKeys, routineKeys, weeklyPlanKey } from './queryKeys.js'
import {
  createGroup,
  createRoutine,
  createSuggestedSplit,
  deleteGroup,
  duplicateRoutine,
  fetchGroups,
  fetchRoutine,
  fetchRoutines,
  reorderGroups,
  reorderRoutines,
  updateGroup,
  updateRoutine,
} from './routinesApi.js'

// ── Lecturas ──

export function useRoutineGroups() {
  return useQuery({ queryKey: groupKeys.all, queryFn: fetchGroups })
}

export function useRoutineList({ archived = false } = {}) {
  return useQuery({ queryKey: routineKeys.list(archived), queryFn: () => fetchRoutines({ archived }) })
}

export function useRoutine(id) {
  return useQuery({
    queryKey: routineKeys.detail(id),
    queryFn: () => fetchRoutine(id),
    enabled: Boolean(id),
  })
}

// ── Cambios ──

// Casi cualquier cambio en rutinas afecta las listas, los conteos de los grupos y el plan semanal
function useRefreshRoutineData() {
  const queryClient = useQueryClient()

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: routineKeys.all }),
      queryClient.invalidateQueries({ queryKey: groupKeys.all }),
      queryClient.invalidateQueries({ queryKey: weeklyPlanKey }),
    ])
}

export function useCreateRoutine() {
  const refresh = useRefreshRoutineData()
  return useMutation({ mutationFn: createRoutine, onSuccess: refresh })
}

export function useUpdateRoutine() {
  const refresh = useRefreshRoutineData()
  return useMutation({ mutationFn: updateRoutine, onSuccess: refresh })
}

export function useDuplicateRoutine() {
  const refresh = useRefreshRoutineData()
  return useMutation({ mutationFn: duplicateRoutine, onSuccess: refresh })
}

export function useCreateSuggestedSplit() {
  const refresh = useRefreshRoutineData()
  return useMutation({ mutationFn: createSuggestedSplit, onSuccess: refresh })
}

export function useCreateGroup() {
  const refresh = useRefreshRoutineData()
  return useMutation({ mutationFn: createGroup, onSuccess: refresh })
}

export function useUpdateGroup() {
  const refresh = useRefreshRoutineData()
  return useMutation({ mutationFn: updateGroup, onSuccess: refresh })
}

export function useDeleteGroup() {
  const refresh = useRefreshRoutineData()
  return useMutation({ mutationFn: deleteGroup, onSuccess: refresh })
}

// Reordenar es "optimista": la pantalla cambia al instante y, si el servidor
// responde con error, se vuelve al orden anterior.
export function useReorderGroups() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reorderGroups,
    onMutate: async (groupIds) => {
      await queryClient.cancelQueries({ queryKey: groupKeys.all })
      const previous = queryClient.getQueryData(groupKeys.all)
      queryClient.setQueryData(groupKeys.all, (groups) =>
        groupIds.map((id) => groups.find((group) => group._id === id)),
      )
      return { previous }
    },
    onError: (_error, _groupIds, context) => queryClient.setQueryData(groupKeys.all, context.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: groupKeys.all }),
  })
}

export function useReorderRoutines() {
  const queryClient = useQueryClient()
  const listKey = routineKeys.list(false)

  return useMutation({
    mutationFn: reorderRoutines,
    onMutate: async ({ routineIds }) => {
      await queryClient.cancelQueries({ queryKey: listKey })
      const previous = queryClient.getQueryData(listKey)
      queryClient.setQueryData(listKey, (routines) =>
        routines.map((routine) => {
          const index = routineIds.indexOf(routine._id)
          return index === -1 ? routine : { ...routine, order: index }
        }),
      )
      return { previous }
    },
    onError: (_error, _variables, context) => queryClient.setQueryData(listKey, context.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: routineKeys.all }),
  })
}
