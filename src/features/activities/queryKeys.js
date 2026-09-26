// Claves de caché de TanStack Query para las actividades y sus tipos
export const activityKeys = {
  all: ['activities'],
  day: (day) => ['activities', 'day', day],
}

export const activityTypeKeys = { all: ['activityTypes'] }
