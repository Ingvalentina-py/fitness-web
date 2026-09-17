import { useEffect, useState } from 'react'

// Devuelve el valor solo cuando deja de cambiar durante `delay` ms.
// Evita pedir a la API una búsqueda por cada letra que se escribe.
export function useDebouncedValue(value, delay = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debouncedValue
}
