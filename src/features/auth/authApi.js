import { ApiError, apiFetch } from '../../lib/apiClient.js'

// La cookie de sesión viaja sola en cada petición: el código nunca toca el token.

// Devuelve null si no hay sesión: no es un error, simplemente nadie ha entrado
export async function getCurrentUser() {
  try {
    const { data } = await apiFetch('/users/me')
    return data
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null
    throw error
  }
}

export async function login(credentials) {
  const { data } = await apiFetch('/auth/login', { method: 'POST', body: credentials })
  return data
}

export async function register(account) {
  const { data } = await apiFetch('/auth/register', { method: 'POST', body: account })
  return data
}

export function logout() {
  return apiFetch('/auth/logout', { method: 'POST' })
}
