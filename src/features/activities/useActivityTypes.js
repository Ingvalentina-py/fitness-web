import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../lib/apiClient.js'

// Tipos de actividad visibles para la persona (globales + propios), con color e ícono
export function useActivityTypes({ enabled = true } = {}) {
  return useQuery({
    queryKey: ['activityTypes'],
    queryFn: async () => (await apiFetch('/activity-types')).data,
    staleTime: 10 * 60_000,
    enabled,
  })
}
