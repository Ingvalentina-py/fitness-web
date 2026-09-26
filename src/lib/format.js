// "1 ejercicio", "3 ejercicios"
export function plural(count, singular, pluralForm) {
  return `${count} ${count === 1 ? singular : pluralForm}`
}

// Mueve un elemento de una posición a otra y devuelve una lista nueva
export function moveItem(list, fromIndex, toIndex) {
  const result = [...list]
  const [item] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, item)
  return result
}

// Números en español: separador decimal con coma y miles con punto ("1.120,5")
export function formatNumber(value, maximumFractionDigits = 1) {
  return new Intl.NumberFormat('es', { maximumFractionDigits }).format(value)
}

// 75 → "1 h 15 min"; 45 → "45 min"
export function formatDuration(minutes) {
  if (!minutes) return '—'
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60

  if (hours === 0) return `${rest} min`
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`
}

// Cuenta atrás del descanso: 90 → "1:30"
export function formatClock(seconds) {
  const safe = Math.max(0, Math.round(seconds))
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`
}
