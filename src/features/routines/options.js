// Colores que se pueden elegir para un grupo (paleta del plan)
export const GROUP_COLORS = [
  { value: '#FF2E7E', label: 'Fucsia' },
  { value: '#FF6B2C', label: 'Naranja' },
  { value: '#FFC928', label: 'Amarillo' },
  { value: '#7BDC3A', label: 'Lima' },
  { value: '#12D6C5', label: 'Turquesa' },
  { value: '#8A84A3', label: 'Ciruela suave' },
]

// Descansos sugeridos entre series, en segundos
export const REST_OPTIONS = [0, 30, 45, 60, 75, 90, 120, 150, 180, 240, 300]

// 90 → "1:30 min", 45 → "45 s"
export function formatRest(seconds) {
  if (seconds === 0) return 'Sin descanso'
  if (seconds < 60) return `${seconds} s`

  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return remainder === 0 ? `${minutes} min` : `${minutes}:${String(remainder).padStart(2, '0')} min`
}
