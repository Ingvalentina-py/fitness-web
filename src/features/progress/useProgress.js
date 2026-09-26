import { useQuery } from '@tanstack/react-query'
import { recordKeys, statsKeys } from './queryKeys.js'
import {
  fetchDistribution,
  fetchExerciseProgress,
  fetchExercisesWithHistory,
  fetchRecords,
  fetchSummary,
} from './progressApi.js'

// Mientras llegan los datos nuevos se conservan los anteriores (placeholderData):
// al cambiar de rango la pantalla no parpadea ni salta de alto.
const keepPrevious = { placeholderData: (previous) => previous }

export function useStatsSummary(range) {
  return useQuery({ queryKey: statsKeys.summary(range), queryFn: () => fetchSummary(range), ...keepPrevious })
}

export function useDistribution(range) {
  return useQuery({
    queryKey: statsKeys.distribution(range),
    queryFn: () => fetchDistribution(range),
    ...keepPrevious,
  })
}

export function useExercisesWithHistory() {
  return useQuery({ queryKey: statsKeys.exercises, queryFn: fetchExercisesWithHistory })
}

export function useExerciseProgress(exerciseId, range) {
  return useQuery({
    queryKey: statsKeys.exerciseProgress(exerciseId, range),
    queryFn: () => fetchExerciseProgress({ exerciseId, ...range }),
    enabled: Boolean(exerciseId),
    ...keepPrevious,
  })
}

export function useRecords() {
  return useQuery({ queryKey: recordKeys.all, queryFn: fetchRecords })
}
