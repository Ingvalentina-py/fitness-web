import { createElement } from 'react'
import { getIcon } from './icons.js'

// Dibuja un ícono a partir del nombre que guarda la API (ej. "heart-pulse").
// Resuelve el componente sin declararlo dentro del render de quien lo usa.
export default function IconByName({ name, ...props }) {
  return createElement(getIcon(name), props)
}
