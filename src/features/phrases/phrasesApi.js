import { apiFetch } from '../../lib/apiClient.js'

const dataOf = async (request) => (await request).data

// scope: 'all' (sistema + propias) o 'mine'. includeInactive trae también las apagadas.
export const fetchPhrases = ({ context, scope = 'all', includeInactive = false } = {}) => {
  const params = new URLSearchParams({ scope, includeInactive: String(includeInactive) })
  if (context) params.set('context', context)

  return dataOf(apiFetch(`/phrases?${params}`))
}

export const createPhrase = (phrase) => dataOf(apiFetch('/phrases', { method: 'POST', body: phrase }))

export const updatePhrase = ({ id, ...changes }) =>
  dataOf(apiFetch(`/phrases/${id}`, { method: 'PATCH', body: changes }))

export const deletePhrase = (id) => apiFetch(`/phrases/${id}`, { method: 'DELETE' })
