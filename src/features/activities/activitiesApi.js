import { apiFetch } from '../../lib/apiClient.js'

const dataOf = async (request) => (await request).data

// ── Actividades (gimnasio y otras juntas) ──
export const fetchActivitiesByDay = (day) => dataOf(apiFetch(`/activities${day ? `?day=${day}` : ''}`))

export const fetchActivitiesInRange = ({ from, to }) =>
  dataOf(apiFetch(`/activities?from=${from}&to=${to}`))

export const createActivity = (activity) =>
  dataOf(apiFetch('/activities', { method: 'POST', body: activity }))

export const updateActivity = ({ id, ...changes }) =>
  dataOf(apiFetch(`/activities/${id}`, { method: 'PATCH', body: changes }))

export const deleteActivity = (id) => apiFetch(`/activities/${id}`, { method: 'DELETE' })

// ── Tipos de actividad ──
export const fetchActivityTypes = () => dataOf(apiFetch('/activity-types'))

export const createActivityType = (activityType) =>
  dataOf(apiFetch('/activity-types', { method: 'POST', body: activityType }))

export const updateActivityType = ({ id, ...changes }) =>
  dataOf(apiFetch(`/activity-types/${id}`, { method: 'PATCH', body: changes }))

export const archiveActivityType = (id) => apiFetch(`/activity-types/${id}`, { method: 'DELETE' })
