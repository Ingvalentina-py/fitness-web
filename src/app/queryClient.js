import { QueryClient } from '@tanstack/react-query'

// Un solo cliente para toda la app: guarda en caché las respuestas del servidor
// para no repetir peticiones y mantener los datos sincronizados entre pantallas.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // durante 30 s los datos se consideran frescos
      retry: 1,
    },
  },
})
