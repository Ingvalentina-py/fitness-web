import {
  Activity,
  Bike,
  Dumbbell,
  Footprints,
  HeartPulse,
  Music,
  Sparkles,
  Users,
  Zap,
  createLucideIcon,
} from 'lucide-react'

// Ícono propio con el mismo estilo de trazo de Lucide, que no incluye patines
export const RollerSkate = createLucideIcon('RollerSkate', [
  ['path', { d: 'M5 3h5v7l6.5 2.2A3 3 0 0 1 19 15v2H5z', key: 'boot' }],
  ['path', { d: 'M5 7h3', key: 'laces' }],
  ['circle', { cx: '7.5', cy: '20', r: '1.5', key: 'wheel-back' }],
  ['circle', { cx: '16.5', cy: '20', r: '1.5', key: 'wheel-front' }],
])

// Nombres de ícono que guarda la API (grupos y tipos de actividad) → componente
const ICONS_BY_NAME = {
  bike: Bike,
  dumbbell: Dumbbell,
  footprints: Footprints,
  'heart-pulse': HeartPulse,
  music: Music,
  'roller-skate': RollerSkate,
  sparkles: Sparkles,
  users: Users,
  zap: Zap,
}

// Si llega un nombre desconocido, se usa un ícono genérico en vez de romper la pantalla
export function getIcon(name) {
  return ICONS_BY_NAME[name] ?? Activity
}
