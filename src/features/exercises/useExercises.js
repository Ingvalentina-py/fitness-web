import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { archiveExercise, createExercise, fetchExercises, updateExercise } from './exercisesApi.js'

const PAGE_SIZE = 30

// Búsqueda paginada del catálogo: cada "Ver más" pide la página siguiente y se suma a la lista.
// filters: { search, scope, muscle, equipment }
export function useExerciseSearch(filters) {
  return useInfiniteQuery({
    queryKey: ['exercises', 'search', filters],
    queryFn: ({ pageParam }) => fetchExercises({ ...filters, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) =>
      pagination.hasNextPage ? pagination.page + 1 : undefined,
    // Mientras llega la búsqueda nueva, se siguen viendo los resultados anteriores
    placeholderData: keepPreviousData,
  })
}

// Al crear o editar un ejercicio se refrescan las búsquedas y las rutinas (muestran su nombre)
function useInvalidateExerciseData() {
  const queryClient = useQueryClient()

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['exercises'] }),
      queryClient.invalidateQueries({ queryKey: ['routines'] }),
    ])
}

export function useCreateExercise() {
  const invalidate = useInvalidateExerciseData()
  return useMutation({ mutationFn: createExercise, onSuccess: invalidate })
}

export function useUpdateExercise() {
  const invalidate = useInvalidateExerciseData()
  return useMutation({ mutationFn: updateExercise, onSuccess: invalidate })
}

export function useArchiveExercise() {
  const invalidate = useInvalidateExerciseData()
  return useMutation({ mutationFn: archiveExercise, onSuccess: invalidate })
}
