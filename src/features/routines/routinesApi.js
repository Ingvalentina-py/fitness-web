import { apiFetch } from '../../lib/apiClient.js'

const dataOf = async (request) => (await request).data

// ── Grupos ──
export const fetchGroups = () => dataOf(apiFetch('/routine-groups'))

export const createGroup = (group) => dataOf(apiFetch('/routine-groups', { method: 'POST', body: group }))

export const updateGroup = ({ id, ...changes }) =>
  dataOf(apiFetch(`/routine-groups/${id}`, { method: 'PATCH', body: changes }))

export const deleteGroup = ({ id, moveTo }) =>
  apiFetch(`/routine-groups/${id}${moveTo ? `?moveTo=${moveTo}` : ''}`, { method: 'DELETE' })

export const reorderGroups = (groupIds) =>
  apiFetch('/routine-groups/order', { method: 'PUT', body: { groupIds } })

// ── Rutinas ──
export const fetchRoutines = ({ archived }) => dataOf(apiFetch(`/routines?archived=${archived}`))

export const fetchRoutine = (id) => dataOf(apiFetch(`/routines/${id}`))

export const createRoutine = (routine) => dataOf(apiFetch('/routines', { method: 'POST', body: routine }))

export const updateRoutine = ({ id, ...changes }) =>
  dataOf(apiFetch(`/routines/${id}`, { method: 'PATCH', body: changes }))

export const duplicateRoutine = (id) => dataOf(apiFetch(`/routines/${id}/duplicate`, { method: 'POST' }))

export const reorderRoutines = ({ groupId, routineIds }) =>
  apiFetch('/routines/order', { method: 'PUT', body: { groupId, routineIds } })

export const createSuggestedSplit = () =>
  dataOf(apiFetch('/routines/suggested-split', { method: 'POST' }))

// ── Plan semanal ──
export const fetchWeeklyPlan = () => dataOf(apiFetch('/weekly-plan'))

export const updateWeeklyPlan = (days) =>
  dataOf(apiFetch('/weekly-plan', { method: 'PUT', body: { days } }))
