// Claves de caché de TanStack Query para las sesiones de gimnasio
export const sessionKeys = {
  all: ['sessions'],
  day: (day) => ['sessions', 'day', day],
  detail: (id) => ['sessions', 'detail', id],
  previous: (exerciseIds) => ['sessions', 'previous', [...exerciseIds].sort().join(',')],
}
