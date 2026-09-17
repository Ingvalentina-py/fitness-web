import { useQuery } from '@tanstack/react-query'
import { apiFetch } from './apiClient.js'

// Opciones válidas con sus textos en español (músculos, unidades…), definidas en la API.
// Casi nunca cambian: se piden una vez por visita.
export function useMeta() {
  return useQuery({
    queryKey: ['meta'],
    queryFn: async () => (await apiFetch('/meta')).data,
    staleTime: Infinity,
  })
}
