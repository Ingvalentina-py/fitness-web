import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { weeklyPlanKey } from './queryKeys.js'
import { fetchWeeklyPlan, updateWeeklyPlan } from './routinesApi.js'

export function useWeeklyPlan() {
  return useQuery({ queryKey: weeklyPlanKey, queryFn: fetchWeeklyPlan })
}

// La API solo necesita los ids; la pantalla trabaja con los datos completos de cada elemento
function toPlanRequest(days) {
  return days.map((day) => ({
    dayOfWeek: day.dayOfWeek,
    items: day.items.map((item) =>
      item.kind === 'routine'
        ? { kind: 'routine', routine: item.routine._id }
        : { kind: 'activityType', activityType: item.activityType._id },
    ),
  }))
}

// Recibe los 7 días ya modificados. Se muestran al instante (optimista) y luego se
// reemplazan por la respuesta del servidor, que trae los avisos recalculados.
export function useUpdateWeeklyPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (days) => updateWeeklyPlan(toPlanRequest(days)),
    onMutate: async (days) => {
      await queryClient.cancelQueries({ queryKey: weeklyPlanKey })
      const previous = queryClient.getQueryData(weeklyPlanKey)
      queryClient.setQueryData(weeklyPlanKey, (plan) => ({ ...plan, days }))
      return { previous }
    },
    onError: (_error, _days, context) => queryClient.setQueryData(weeklyPlanKey, context.previous),
    onSuccess: (plan) => queryClient.setQueryData(weeklyPlanKey, plan),
  })
}
