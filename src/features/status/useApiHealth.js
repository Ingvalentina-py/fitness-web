import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../lib/apiClient.js'

// Pregunta a la API si está viva y si tiene conexión con MongoDB.
export function useApiHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiFetch('/health'),
    retry: false,
    refetchInterval: 15_000,
  })
}
