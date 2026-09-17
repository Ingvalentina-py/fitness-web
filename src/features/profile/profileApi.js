import { apiFetch } from '../../lib/apiClient.js'

// changes: { name?, preferences?: { weightUnit?, weekStartsOn?, timezone?, voicePhrases? } }
export async function updateProfile(changes) {
  const { data } = await apiFetch('/users/me', { method: 'PATCH', body: changes })
  return data
}

export async function changePassword(passwords) {
  const { data } = await apiFetch('/users/me/password', { method: 'PATCH', body: passwords })
  return data
}
