import { useEffect, useState } from 'react'

// Ancho real del contenedor, para dibujar el SVG a escala 1:1.
// Si se dibujara con un lienzo fijo y se dejara escalar, el grosor de las líneas y
// el tamaño de los textos cambiarían con el ancho de la pantalla: en el celular
// quedarían ilegibles y en el computador, enormes.
export function useElementWidth(ref, fallback = 320) {
  const [width, setWidth] = useState(fallback)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.round(entry.contentRect.width))
    })
    observer.observe(element)

    return () => observer.disconnect()
  }, [ref])

  return width
}
