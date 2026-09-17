// Claves de caché de TanStack Query. Invalidar ['routines'] refresca todas las listas
// y detalles de rutinas a la vez.
export const routineKeys = {
  all: ['routines'],
  list: (archived) => ['routines', 'list', { archived }],
  detail: (id) => ['routines', 'detail', id],
}

export const groupKeys = { all: ['routineGroups'] }

export const weeklyPlanKey = ['weeklyPlan']
