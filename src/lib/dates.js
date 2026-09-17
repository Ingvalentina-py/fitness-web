// "miércoles, 17 de septiembre" → "Miércoles, 17 de septiembre", en la zona horaria de la persona
export function formatLongDate(date, timeZone) {
  const text = new Intl.DateTimeFormat('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone,
  }).format(date)

  return text.charAt(0).toUpperCase() + text.slice(1)
}
