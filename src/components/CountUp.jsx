import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'

const EASE_OUT = [0.22, 1, 0.36, 1]

// Número que sube desde cero hasta su valor. Es el conteo animado del resumen de la sesión.
// El contador no es una transformación CSS, así que aquí se decide a mano cuándo animar:
// con "reducir movimiento" activado, o con la pestaña en segundo plano (donde el
// navegador no dibuja cuadros y el número se quedaría en cero), se muestra el valor final.
export default function CountUp({ value, duration = 1.4, format = (number) => Math.round(number) }) {
  const reduceMotion = useReducedMotion()
  const [animates] = useState(canAnimate)
  const count = useMotionValue(0)
  const text = useTransform(count, format)

  useEffect(() => {
    if (reduceMotion || !animates) return

    const controls = animate(count, value, { duration, ease: EASE_OUT })
    return () => controls.stop()
  }, [animates, count, duration, reduceMotion, value])

  if (reduceMotion || !animates) return <span>{format(value)}</span>
  return <motion.span>{text}</motion.span>
}

// Una pestaña en segundo plano no recibe cuadros de animación
function canAnimate() {
  return !document.hidden
}
