const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error('Falta VITE_API_URL. Copia .env.example como .env y reinicia Vite.')
}

// Error con el código HTTP y el cuerpo de la respuesta, para decidir qué mostrar en pantalla.
// status 0 significa que no hubo respuesta (servidor apagado, sin internet o bloqueo de CORS).
// code y details vienen del formato de error de la API: { error: { code, message, details } }
export class ApiError extends Error {
  constructor(message, { status, code, details, data } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
    this.data = data
  }
}

// Punto único para hablar con la API: arma la URL, envía JSON y convierte los errores en ApiError.
export async function apiFetch(path, { body, headers, ...options } = {}) {
  let response

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: body ? { 'Content-Type': 'application/json', ...headers } : headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('No se pudo conectar con el servidor.', { status: 0 })
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(data?.error?.message ?? `Error ${response.status}`, {
      status: response.status,
      code: data?.error?.code,
      details: data?.error?.details,
      data,
    })
  }

  return data
}
