import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { currentUserKey } from '../features/auth/queryKeys.js'

// Si cualquier petición responde 401, la sesión ya no sirve (venció o se cambió la
// contraseña en otro dispositivo): se marca "sin sesión" y las rutas protegidas
// llevan a /ingresar.
function handleUnauthorized(error) {
  if (error?.status === 401) queryClient.setQueryData(currentUserKey, null)
}

// Un solo cliente para toda la app: guarda en caché las respuestas del servidor
// para no repetir peticiones y mantener los datos sincronizados entre pantallas.
export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleUnauthorized }),
  mutationCache: new MutationCache({ onError: handleUnauthorized }),
  defaultOptions: {
    queries: {
      staleTime: 30_000, // durante 30 s los datos se consideran frescos
      // Reintenta una vez solo si el fallo pudo ser temporal (sin conexión o error del servidor).
      // Un 400 o un 401 no se arreglan repitiendo la petición.
      retry: (failureCount, error) =>
        failureCount < 1 && (error?.status === 0 || error?.status >= 500),
    },
  },
})
