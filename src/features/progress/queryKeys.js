// Claves de caché de TanStack Query para el progreso. El rango forma parte de la
// clave: cambiar de fechas es pedir otros datos, no refrescar los mismos.
export const statsKeys = {
  all: ['stats'],
  summary: (range) => ['stats', 'summary', range],
  distribution: (range) => ['stats', 'distribution', range],
  exercises: ['stats', 'exercises'],
  exerciseProgress: (exerciseId, range) => ['stats', 'exercise', exerciseId, range],
}

export const recordKeys = { all: ['records'] }
