// Convierte los detalles de error de la API en un objeto por campo:
// [{ field: 'body.email', message }] → { email: message }
// Los errores que no son de un campo concreto quedan en la clave '' (vacía).
export function getFieldErrors(error) {
  const errors = {}

  for (const { field, message } of error?.details ?? []) {
    const name = field.replace(/^body\.?/, '')
    errors[name] ??= message
  }

  return errors
}
