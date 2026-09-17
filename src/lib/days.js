const WEEKDAY_NUMBERS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

// Número del día de hoy (0 = domingo … 6 = sábado) en la zona horaria de la persona,
// que puede ser distinta a la del dispositivo (ej. si está de viaje)
export function getTodayDayOfWeek(timeZone) {
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone }).format(new Date())
  return WEEKDAY_NUMBERS[weekday]
}

// Ordena una lista indexada por día (0 = domingo) empezando por el primer día elegido
export function orderByWeekStart(days, weekStartsOn) {
  return [...days.slice(weekStartsOn), ...days.slice(0, weekStartsOn)]
}
