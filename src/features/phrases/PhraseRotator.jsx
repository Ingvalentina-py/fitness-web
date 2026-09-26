import { Pause, Volume2 } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import IconButton from '../../components/IconButton.jsx'
import { canSpeak, speak } from '../../lib/speech.js'
import { usePhrases } from './usePhrases.js'
import styles from './PhraseRotator.module.css'

// Cada cuánto cambia la frase
const ROTATION_MS = 6000

// Frases que van rotando. `contexts` es la lista de momentos que aplican ahora:
// en Hoy son las generales y, si llevas racha, también las de racha.
export default function PhraseRotator({ contexts = ['general'], canSpeakAloud = false }) {
  const general = usePhrases({ context: contexts[0] })
  const extra = usePhrases({ context: contexts[1] ?? contexts[0] })
  const reduceMotion = useReducedMotion()

  // Se empieza en una frase al azar: así no ves siempre la misma al abrir la app
  const [index, setIndex] = useState(() => Math.floor(Math.random() * 1000))
  const [isPaused, setIsPaused] = useState(false)

  // Una sola lista, sin repetir, en orden aleatorio estable para esta visita
  const phrases = mergePhrases(general.data, contexts.length > 1 ? extra.data : [])

  useEffect(() => {
    if (isPaused || phrases.length < 2) return

    const id = setInterval(() => setIndex((current) => (current + 1) % phrases.length), ROTATION_MS)
    return () => clearInterval(id)
  }, [isPaused, phrases.length])

  if (phrases.length === 0) return null
  const phrase = phrases[index % phrases.length]

  return (
    <div
      className={styles.rotator}
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
    >
      {/* Al tocar la frase se queda quieta: a veces una quiere leerla con calma */}
      <button
        type="button"
        className={styles.phrase}
        aria-pressed={isPaused}
        aria-label={isPaused ? 'Seguir cambiando de frase' : 'Dejar esta frase quieta'}
        onClick={() => setIsPaused((current) => !current)}
      >
        {/* initial={false}: la primera frase aparece ya escrita, sin fundido de entrada.
            Si la pestaña está en segundo plano no hay animación que la revele. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={phrase._id}
            initial={{ opacity: 0, filter: reduceMotion ? 'none' : 'blur(6px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: reduceMotion ? 'none' : 'blur(6px)' }}
            transition={{ duration: reduceMotion ? 0.15 : 0.5 }}
          >
            {phrase.text}
          </motion.span>
        </AnimatePresence>
      </button>

      <span className={styles.actions}>
        {isPaused && (
          <span className={styles.paused}>
            <Pause size={14} strokeWidth={2.5} aria-hidden="true" /> En pausa
          </span>
        )}
        {canSpeakAloud && canSpeak() && (
          <IconButton
            icon={Volume2}
            label="Escuchar la frase"
            size="sm"
            onClick={() => speak(phrase.text)}
          />
        )}
      </span>
    </div>
  )
}

// Junta las frases de los contextos que aplican, sin repetidas y en un orden estable
// (el punto de partida al azar es el que da variedad).
function mergePhrases(first = [], second = []) {
  const byId = new Map([...first, ...second].map((phrase) => [phrase._id, phrase]))
  return [...byId.values()].sort((a, b) => a._id.localeCompare(b._id))
}
