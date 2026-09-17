import { apiFetch } from '../../lib/apiClient.js'

// Arma "?search=hip&muscle=gluteMax&page=2" omitiendo los filtros vacíos
function toQueryString(params) {
  const entries = Object.entries(params).filter(([, value]) => value !== '' && value != null)
  return new URLSearchParams(entries).toString()
}

// Devuelve { data, pagination }
export function fetchExercises(params) {
  return apiFetch(`/exercises?${toQueryString(params)}`)
}

export async function createExercise(exercise) {
  return (await apiFetch('/exercises', { method: 'POST', body: exercise })).data
}

export async function updateExercise({ id, ...changes }) {
  return (await apiFetch(`/exercises/${id}`, { method: 'PATCH', body: changes })).data
}

export function archiveExercise(id) {
  return apiFetch(`/exercises/${id}`, { method: 'DELETE' })
}
