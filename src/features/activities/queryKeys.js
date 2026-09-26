// Claves de caché de TanStack Query para las actividades y sus tipos
export const activityKeys = {
  all: ['activities'],
  day: (day) => ['activities', 'day', day],
  range: (from, to) => ['activities', 'range', from, to],
}

export const activityTypeKeys = { all: ['activityTypes'] }
