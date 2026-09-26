import { useEffect, useState } from 'react'

// Segundos transcurridos desde que empezó la sesión, actualizados cada segundo.
// Se calcula restando fechas (no sumando 1) para que el reloj siga bien aunque
// el celular haya tenido la pantalla apagada.
export function useElapsedSeconds(startedAt) {
  const [seconds, setSeconds] = useState(() => elapsedSince(startedAt))

  useEffect(() => {
    const id = setInterval(() => setSeconds(elapsedSince(startedAt)), 1000)
    return () => clearInterval(id)
  }, [startedAt])

  return seconds
}

function elapsedSince(startedAt) {
  return Math.max(0, Math.round((Date.now() - new Date(startedAt).getTime()) / 1000))
}
