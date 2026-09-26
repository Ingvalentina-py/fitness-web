// Cálculos del calendario. Los días se manejan como texto "AAAA-MM-DD" (igual que
// en la API): comparar y ordenar textos así equivale a comparar fechas, y no hay
// horas ni zonas horarias que puedan correr un día.

// Los números del mes se arman en UTC a propósito: solo interesa qué día de la
// semana cae cada fecha, sin que el horario de verano local mueva nada.
export function toDayString(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// Suma (o resta) días a un "AAAA-MM-DD"
export function shiftDay(day, amount) {
  return new Date(Date.parse(`${day}T00:00:00Z`) + amount * 86_400_000).toISOString().slice(0, 10)
}

// El primer día de la semana que contiene a `day`, según la preferencia de la persona
export function startOfWeek(day, weekStartsOn) {
  const weekday = new Date(`${day}T00:00:00Z`).getUTCDay()
  return shiftDay(day, -((weekday - weekStartsOn + 7) % 7))
}

// "2026-09-21" → "21 sep"
export function formatDayShort(day) {
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', timeZone: 'UTC' })
    .format(new Date(`${day}T00:00:00Z`))
    .replace('.', '')
}

export function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
}

export function monthRange(year, month) {
  return { from: toDayString(year, month, 1), to: toDayString(year, month, daysInMonth(year, month)) }
}

// Semanas del mes: cada una con 7 celdas. Las de fuera del mes van vacías (null).
// `weekStartsOn` es la preferencia de la persona (0 = domingo, 1 = lunes).
export function buildMonthWeeks(year, month, weekStartsOn) {
  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay()
  const leading = (firstWeekday - weekStartsOn + 7) % 7
  const cells = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth(year, month) }, (_, index) => toDayString(year, month, index + 1)),
  ]

  while (cells.length % 7 !== 0) cells.push(null)

  return Array.from({ length: cells.length / 7 }, (_, week) => cells.slice(week * 7, week * 7 + 7))
}

// Iniciales de los días de la semana, empezando por el día que prefiera la persona
export function weekdayInitials(weekStartsOn) {
  // 4 de enero de 1970 fue domingo: sirve de punto de partida conocido
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(Date.UTC(1970, 0, 4 + ((weekStartsOn + index) % 7)))
    const letter = new Intl.DateTimeFormat('es', { weekday: 'narrow', timeZone: 'UTC' }).format(date)
    return letter.toUpperCase()
  })
}

// Hoy en la zona horaria de la persona, como "AAAA-MM-DD"
export function todayDayString(timeZone) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

// "2026-09-25" → "Viernes, 25 de septiembre". Se interpreta al mediodía para que
// ninguna zona horaria lo mueva al día anterior.
export function formatDayName(day) {
  const text = new Intl.DateTimeFormat('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${day}T12:00:00`))

  return text.charAt(0).toUpperCase() + text.slice(1)
}

// "septiembre de 2026", con la inicial en mayúscula
export function formatMonthName(year, month) {
  const text = new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month, 1)),
  )

  return text.charAt(0).toUpperCase() + text.slice(1)
}
