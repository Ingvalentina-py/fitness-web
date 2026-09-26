import { shiftDay } from '../../lib/calendar.js'

// Atajos antes del calendario: nadie quiere pelear con dos fechas para ver "el último mes"
export const RANGE_PRESETS = [
  { value: '30', label: '30 días', days: 30 },
  { value: '90', label: '90 días', days: 90 },
  { value: '365', label: '1 año', days: 365 },
  { value: 'custom', label: 'Elegir fechas' },
]

export function presetRange(preset, today) {
  const { days } = RANGE_PRESETS.find((option) => option.value === preset)
  return { from: shiftDay(today, -(days - 1)), to: today }
}
