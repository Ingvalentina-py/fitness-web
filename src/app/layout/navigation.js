import { CalendarDays, Dumbbell, Sun, TrendingUp } from 'lucide-react'

// Pestañas principales, en orden. La barra inferior pone el "+" justo en el medio,
// así que agregar una pestaña aquí (ej. Alimentación) no obliga a rediseñar nada:
//   { to: '/alimentacion', label: 'Alimentación', icon: Salad },
export const NAV_ITEMS = [
  { to: '/', label: 'Hoy', icon: Sun, end: true },
  { to: '/rutinas', label: 'Rutinas', icon: Dumbbell },
  { to: '/historial', label: 'Historial', icon: CalendarDays },
  { to: '/progreso', label: 'Progreso', icon: TrendingUp },
]
