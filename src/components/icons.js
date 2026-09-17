import {
  Activity,
  Bike,
  Dumbbell,
  Flame,
  Footprints,
  HeartPulse,
  Music,
  Sparkles,
  Target,
  Timer,
  Trophy,
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

// Nombres de ícono que guarda la API (grupos y tipos de actividad) → componente y nombre en español
const ICONS_BY_NAME = {
  activity: { component: Activity, label: 'Pulso' },
  bike: { component: Bike, label: 'Bicicleta' },
  dumbbell: { component: Dumbbell, label: 'Mancuerna' },
  flame: { component: Flame, label: 'Llama' },
  footprints: { component: Footprints, label: 'Huellas' },
  'heart-pulse': { component: HeartPulse, label: 'Corazón' },
  music: { component: Music, label: 'Música' },
  'roller-skate': { component: RollerSkate, label: 'Patines' },
  sparkles: { component: Sparkles, label: 'Destellos' },
  target: { component: Target, label: 'Diana' },
  timer: { component: Timer, label: 'Cronómetro' },
  trophy: { component: Trophy, label: 'Trofeo' },
  users: { component: Users, label: 'Personas' },
  zap: { component: Zap, label: 'Rayo' },
}

// Íconos que se pueden elegir para un grupo de rutinas
export const GROUP_ICON_NAMES = [
  'dumbbell',
  'footprints',
  'zap',
  'heart-pulse',
  'flame',
  'trophy',
  'timer',
  'target',
  'activity',
  'bike',
  'music',
  'sparkles',
]

// Si llega un nombre desconocido, se usa un ícono genérico en vez de romper la pantalla
export function getIcon(name) {
  return ICONS_BY_NAME[name]?.component ?? Activity
}

export function getIconLabel(name) {
  return ICONS_BY_NAME[name]?.label ?? name
}
