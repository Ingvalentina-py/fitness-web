import { apiFetch } from '../../lib/apiClient.js'

const dataOf = async (request) => (await request).data

export const fetchSession = (id) => dataOf(apiFetch(`/sessions/${id}`))

// Lo que hiciste la última vez en cada ejercicio, para mostrarlo como referencia
export const fetchLastPerformances = (exerciseIds) =>
  dataOf(apiFetch(`/sessions/previous?exerciseIds=${exerciseIds.join(',')}`))

// Devuelve la sesión y, en meta.records, los récords superados
export const createSession = (session) => apiFetch('/sessions', { method: 'POST', body: session })

// Corrige una sesión ya guardada (mismos campos que al crearla)
export const updateSession = ({ id, ...changes }) =>
  dataOf(apiFetch(`/sessions/${id}`, { method: 'PATCH', body: changes }))

export const saveSessionAsRoutine = ({ sessionId, ...body }) =>
  dataOf(apiFetch(`/sessions/${sessionId}/routine`, { method: 'POST', body }))
